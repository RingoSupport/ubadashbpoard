/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import FadeLoader from "react-spinners/FadeLoader";
import { FaDownload, FaFilter, FaSearch } from "react-icons/fa";
import { CSVLink } from "react-csv";

export const Otp = () => {
	const [page, setPage] = useState(1);
	const rowsPerPage = 1000;
	const [initialRenderedData, setinitialRenderedData] = useState([]);
	const [initialFilteredRenderedData, setinitialFilteredRenderedData] =
		useState([]);
	const [downloadButton, setDownloadButton] = useState(false);
	const [timeStamp, setTimeStamp] = useState({ from: "", to: "" });
	const [loading, setLoading] = useState(false);
	const [filterValue, setFilterValue] = useState("");
	const [status, setStatus] = useState("");
	const [telco, setTelco] = useState("");

	const errorCodeDescriptions = {
		"000": "Delivered",
		100: "Delivered",
		"2:000": "Delivered",
		201: "Unknown Subscriber",
		205: "Unidentified Subscriber",
		"0dc": "Absent Subscriber",
		"21b": "Absent Subscriber",
		"023": "Absent Subscriber",
		"027": "Absent Subscriber",
		"053": "Absent Subscriber",
		"054": "Absent Subscriber",
		"058": "Absent Subscriber",
		206: "Absent Subscriber (MT/SRI)",
		602: "Absent Subscriber (MT)",
		"20d": "Call Barred / On DND",
		525: "Call barred as well",
		439: "Subscriber is barred",
		130: "Subscriber is barred on the network",
		131: "Subscriber is barred on the network",
		"21f": "Subscriber Busy for MT",
		21: "Subscriber Busy for MT",
		215: "Facility Not Supported",
		254: "Subscriber's phone inbox is full",
		220: "Subscriber's phone inbox is full",
		120: "Subscriber's phone inbox is full",
		"008": "Subscriber's phone inbox is full",
		0: "Subscriber's phone inbox is full",
		407: "MSC Timeout",
		307: "HLR Timeout",
		222: "Network System Failure",
		306: "Network System Failure",
		"032": "Network operator system failure or operator not supported",
		"082": "Network operator not supported",
		"40a": "MAP Abort",
		102: "Tele service not provisioned",
		"20b": "Tele service not provisioned",
		600: "Destination Acc ID IMSI barring",
		"065": "Submit Error",
		"069": "Submit Error",
		72: "Wrong TON/NPI",
		255: "Inactive mobile number",
		"004": "Inactive mobile number",
		510: "Ported mobile number",
		"085": "Subscriber is on DND",
		"00a": "SenderID is restricted by the operator",
		"078": "Restricted message content or senderID is blocked.",
		432: "Restricted message content or senderID is blocked.",
	};

	function isObject(obj) {
		try {
			let parsedObject = JSON.parse(obj);
			return (
				parsedObject !== undefined &&
				parsedObject !== null &&
				parsedObject.constructor == Object
			);
		} catch {
			return false;
		}
	}

	const getNetwork = (msisdn) => {
		const prefix = msisdn?.substring(0, 4);
		if (["2348", "2347"].includes(prefix)) return "MTN";
		if (["2349"].includes(prefix)) return "9mobile";
		if (["2350"].includes(prefix)) return "Glo";
		return "Airtel";
	};

	const getErrorCodeDescription = (report) => {
		if (report) {
			if (
				typeof report === "string" &&
				errorCodeDescriptions[report] !== undefined
			) {
				return `${report}: ${errorCodeDescriptions[report]}`;
			} else if (isObject(report)) {
				try {
					const parsedReport = JSON.parse(report);
					const message = parsedReport.message;
					const errorCodeMatch = message.match(/err:([0-9a-zA-Z]+)/);

					if (errorCodeMatch) {
						const errorCode = errorCodeMatch[1];
						try {
							const parsedErrorCode = JSON.parse(errorCode);
							if (parsedErrorCode && parsedErrorCode.errCode) {
								const errCode = parsedErrorCode.errCode;
								const description = errorCodeDescriptions[errCode];
								return description ? `${errCode}: ${description}` : errCode;
							}
						} catch (e) {
							// Not JSON, continue
						}
						const description = errorCodeDescriptions[errorCode];
						return description ? `${errorCode}: ${description}` : errorCode;
					}
				} catch (e) {
					console.error("Error parsing JSON:", e);
				}
			} else {
				return "Awaiting DLR";
			}
		}
		return "Awaiting DLR";
	};

	const filterTable = async () => {
		setLoading(true);
		try {
			let formattedValue =
				filterValue.length === 11 && /^\d{11}$/.test(filterValue)
					? "234" + filterValue.slice(1)
					: filterValue;

			const { data: portingData } = await axios.get(
				`https://ubasms.approot.ng/php/searchPorting.php?phone=${formattedValue}`
			);

			const validNetworks = ["MTN", "Airtel", "Glo", "9mobile"];
			const isValidNetwork = validNetworks.includes(portingData);

			const { data } = await axios.get(
				`https://ubasms.approot.ng/php/ubaOtpPhoneSearch.php?phone=${formattedValue}`
			);

			const updatedData = data.map((item) => ({
				...item,
				network: isValidNetwork ? portingData : item.network,
			}));

			const sortedData = updatedData.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);

			setinitialRenderedData(sortedData);
			setinitialFilteredRenderedData(sortedData);
			setLoading(false);
			setDownloadButton(true);
			setPage(page + 1);
			setFilterValue("");
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);
		}
	};

	const handleTimestamp = (e) => {
		e.preventDefault();
		const fromDate = new Date(timeStamp.from);
		const toDate = new Date(timeStamp.to);

		const filtered = initialFilteredRenderedData.filter((item) => {
			const itemDate = new Date(item.created_at);
			return itemDate >= fromDate && itemDate <= toDate;
		});

		const sortedFiltered = filtered.sort(
			(a, b) => new Date(b.created_at) - new Date(a.created_at)
		);
		setinitialRenderedData(sortedFiltered);
	};

	const getDlrStatusDescription = (status) => {
		switch (status) {
			case "":
				return "Pending";
			case "DELIVRD":
				return "Delivered";
			case "EXPIRED":
				return "Expired";
			case "UNDELIV":
				return "Undelivered";
			case "REJECTD":
				return "Rejected";
			case null:
				return "Sent";
			default:
				return "Delivered";
		}
	};

	const transformDataForCSV = (data) => {
		return data.map((row) => ({
			msisdn: "'" + row.msisdn,
			network: getNetwork(row.msisdn),
			senderid: row.senderid || "UBA",
			created_at: row.created_at,
			status: getDlrStatusDescription(row.dlr_status),
			error_code: getErrorCodeDescription(row.dlr_request),
			externalMessageId: window.crypto.randomUUID(),
			requestType: "OTP",
		}));
	};

	const dbColumns = [
		{
			field: "id",
			headerName: "ID",
			width: 80,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "text",
			headerName: "Message",
			width: 250,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "msisdn",
			headerName: "Recipient",
			width: 140,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "network",
			headerName: "Network",
			width: 120,
			valueGetter: (params) => {
				const network = params.row.network;
				if (
					!network ||
					(network !== "Glo" && network !== "9mobile" && network !== "Airtel")
				) {
					return getNetwork(params.row.msisdn);
				}
				return network;
			},
			headerAlign: "left",
			align: "left",
		},
		{
			field: "senderid",
			headerName: "Sender ID",
			width: 120,
			headerAlign: "left",
			align: "left",
			valueGetter: (params) => params.row?.senderid || "UBA",
		},
		{
			field: "created_at",
			headerName: "Date Time",
			width: 180,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "dlr_status",
			headerName: "Status",
			width: 140,
			headerAlign: "left",
			align: "left",
			renderCell: (params) => {
				const statusMap = {
					"": {
						label: "Pending",
						class: "bg-yellow-100 text-yellow-700 border-yellow-300",
					},
					DELIVRD: {
						label: "Delivered",
						class: "bg-green-100 text-green-700 border-green-300",
					},
					EXPIRED: {
						label: "Expired",
						class: "bg-gray-100 text-gray-700 border-gray-300",
					},
					UNDELIV: {
						label: "Undelivered",
						class: "bg-red-100 text-red-700 border-red-300",
					},
					REJECTD: {
						label: "Rejected",
						class: "bg-red-100 text-red-700 border-red-300",
					},
				};
				const status = statusMap[params.row.dlr_status] || {
					label: "Sent",
					class: "bg-blue-100 text-blue-700 border-blue-300",
				};
				return (
					<span
						className={`px-2 py-1 rounded-md text-xs font-medium border ${status.class}`}
					>
						{status.label}
					</span>
				);
			},
		},
		{
			field: "dlr_request",
			headerName: "Error Code",
			width: 200,
			headerAlign: "left",
			align: "left",
			valueGetter: (params) => getErrorCodeDescription(params.row.dlr_request),
		},
	];

	const filterTelco = (value) => {
		if (value.length > 1) {
			const networkMap = {
				mtn: "MTN",
				airtel: "Airtel",
				glo: "Globacom",
				"9mobile": "9mobile",
			};
			const filtered = initialFilteredRenderedData.filter(
				(item) => item.network === networkMap[value]
			);
			setinitialRenderedData(filtered);
		} else {
			setinitialRenderedData(initialFilteredRenderedData);
		}
	};

	const filterStatus = (value) => {
		if (value.length > 1) {
			const statusMap = {
				delivered: "DELIVRD",
				undelivered: "UNDELIV",
				expired: "EXPIRED",
				rejected: "REJECTD",
				pending: null,
			};
			const filtered = initialFilteredRenderedData.filter(
				(item) => item.dlr_status === statusMap[value]
			);
			setinitialRenderedData(filtered);
		} else {
			setinitialRenderedData(initialFilteredRenderedData);
		}
	};

	const getOtpItems = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`https://ubasms.approot.ng/php/ubaotptransactions.php?rowsPerPage=${rowsPerPage}`
			);
			const sortedData = data.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
			setinitialRenderedData(sortedData);
			setinitialFilteredRenderedData(sortedData);
			setLoading(false);
			setPage(page + 1);
		} catch (error) {
			setLoading(false);
		}
	};

	const override = {
		display: "block",
		margin: "0 auto",
	};

	useEffect(() => {
		getOtpItems();
		return () => {
			console.log("cleared data");
		};
	}, []);

	return (
		<div className='min-h-screen bg-gray-50'>
			{loading ? (
				<div className='flex justify-center items-center h-screen bg-white'>
					<div className='text-center'>
						<FadeLoader
							loading={loading}
							cssOverride={override}
							color='#DC2626'
							size={250}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
						<p className='mt-4 text-gray-600 font-medium'>
							Loading OTP transactions...
						</p>
					</div>
				</div>
			) : (
				<div className='max-w-7xl mx-auto px-4 py-6'>
					{/* Header Section */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									OTP Transaction Logs
								</h1>
								<p className='text-sm text-gray-500 mt-1'>
									View and manage all OTP message transactions
								</p>
							</div>
							{downloadButton && (
								<CSVLink
									data={transformDataForCSV(initialRenderedData)}
									filename={`OTP_Report_${new Date().toLocaleDateString()}.csv`}
									className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm'
								>
									<FaDownload className='text-sm' />
									<span>Export Report</span>
								</CSVLink>
							)}
						</div>
					</div>

					{/* Filters Section */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6'>
						<div className='flex items-center gap-2 mb-4'>
							<FaFilter className='text-red-600' />
							<h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
						</div>

						<div className='space-y-4'>
							{/* Row 1: Phone Search and Status */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* Phone Search */}
								<div className='flex gap-2'>
									<input
										type='search'
										placeholder='Search by phone number'
										className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm'
										value={filterValue}
										onChange={(e) => setFilterValue(e.target.value)}
									/>
									<button
										onClick={filterTable}
										className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-300'
									>
										<FaSearch />
									</button>
								</div>

								{/* Status Filter */}
								<select
									className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white'
									value={status}
									onChange={(e) => {
										setStatus(e.target.value);
										filterStatus(e.target.value);
									}}
								>
									<option value=''>All Status</option>
									<option value='delivered'>Delivered</option>
									<option value='undelivered'>Undelivered</option>
									<option value='expired'>Expired</option>
									<option value='pending'>Pending</option>
									<option value='rejected'>Rejected</option>
								</select>
							</div>

							{/* Row 2: Network and Date Range */}
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
								{/* Network Filter */}
								<select
									className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white'
									value={telco}
									onChange={(e) => {
										setTelco(e.target.value);
										filterTelco(e.target.value);
									}}
								>
									<option value=''>All Networks</option>
									<option value='mtn'>MTN</option>
									<option value='airtel'>Airtel</option>
									<option value='glo'>Glo</option>
									<option value='9mobile'>9mobile</option>
								</select>

								{/* Date Range */}
								<input
									type='datetime-local'
									className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm'
									value={timeStamp.from}
									onChange={(e) =>
										setTimeStamp({ ...timeStamp, from: e.target.value })
									}
									placeholder='From date'
								/>
								<input
									type='datetime-local'
									className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm'
									value={timeStamp.to}
									onChange={(e) =>
										setTimeStamp({ ...timeStamp, to: e.target.value })
									}
									placeholder='To date'
								/>
							</div>

							{/* Apply Button */}
							<div className='flex justify-end'>
								<button
									onClick={handleTimestamp}
									className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium'
								>
									Apply Date Filter
								</button>
							</div>
						</div>
					</div>

					{/* Data Grid Section */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						{initialRenderedData.length < 1 && loading ? (
							<div className='flex justify-center items-center py-20'>
								<FadeLoader
									loading={true}
									cssOverride={override}
									color='#DC2626'
									size={300}
									aria-label='Loading Spinner'
									data-testid='loader'
								/>
							</div>
						) : (
							<DataGrid
								rows={initialRenderedData}
								rowHeight={70}
								columns={dbColumns}
								initialState={{
									pagination: {
										paginationModel: { page: 0, pageSize: 10 },
									},
								}}
								sx={{
									border: "none",
									"& .MuiDataGrid-columnHeaders": {
										backgroundColor: "#f9fafb",
										borderBottom: "2px solid #e5e7eb",
										fontSize: "0.875rem",
										fontWeight: 600,
										color: "#374151",
									},
									"& .MuiDataGrid-cell": {
										borderBottom: "1px solid #f3f4f6",
										fontSize: "0.875rem",
									},
									"& .MuiDataGrid-row:hover": {
										backgroundColor: "#fef2f2",
									},
									"& .MuiDataGrid-footerContainer": {
										borderTop: "2px solid #e5e7eb",
										backgroundColor: "#f9fafb",
									},
									"& .MuiCheckbox-root.Mui-checked": {
										color: "#DC2626",
									},
									"& .MuiDataGrid-cell:focus": {
										outline: "none",
									},
								}}
								pageSizeOptions={[10, 25, 50, 100]}
								checkboxSelection
								getRowId={(row) => row?.id}
								disableRowSelectionOnClick
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
