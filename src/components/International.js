import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { FaEye, FaSearch, FaDownload, FaFilter } from "react-icons/fa"; // Added FaFilter
import { CSVLink } from "react-csv";
// Assuming these utilities exist and are necessary
import { findCountryByPhoneNumber } from "../utils/international";
// import { getOperator } from "../utils/checkInternational";

export const International = () => {
	const [initialData, setInitialData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filterValue, setFilterValue] = useState("");
	const [downloadButton, setDownloadButton] = useState(false);

	// --- Utility Functions ---
	const getDlrStatusDescription = (status) => {
		if (status === null || !status) {
			return "Pending";
		} else if (status === "DELIVRD") {
			return "Delivered";
		} else if (status === "EXPIRD") {
			return "Expired";
		} else if (status === "UNDELIV") {
			return "Undelivered";
		} else if (status === "REJECTED") {
			return "Rejected";
		} else {
			return "Sent";
		}
	};

	const transformDataForCSV = (data) => {
		return data.map((row) => ({
			msisdn: "'" + row.phone,
			senderid: row.sender_id || "UBA",
			created_at: row.created_at,
			status: getDlrStatusDescription(row.status),
			country: row.phone ? findCountryByPhoneNumber(row.phone) : "N/A",
			error_reason: row.error_reason || "N/A", // ✅ Added here
			externalMessageId: row.id || window.crypto.randomUUID(),
			requestType: "International SMS",
		}));
	};

	// --- Data Fetching & Filtering Logic ---
	const getItems = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				"https://messaging.approot.ng/international.php"
			);
			setInitialData(
				data.sort((a, b) => {
					const dateA = new Date(a.created_at);
					const dateB = new Date(b.created_at);
					return dateB - dateA;
				})
			);
			setLoading(false);
			setDownloadButton(true);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const filterTable = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.get(
				`https://messaging.approot.ng/internationalSearch.php?phone=${filterValue}`
			);

			setInitialData(
				data.sort((a, b) => {
					const dateA = new Date(a.created_at);
					const dateB = new Date(b.created_at);
					return dateB - dateA;
				})
			);
			setLoading(false);
			setDownloadButton(true);
			setFilterValue(""); // Clear search input after successful search
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		getItems();
		return () => {
			console.log("cleared data");
		};
	}, []);

	// --- DataGrid Configuration ---
	const newColumns = [
		{
			field: "id",
			headerName: "ID",
			width: 80,
			headerAlign: "left",
			align: "left",
			// valueGetter: (params) =>
			// 	params.row.id || params.row.messages?.length > 0
			// 		? params.row.messages[0].id
			// 		: "", // Use the actual ID if available
		},
		{
			field: "messages",
			headerName: "Message",
			width: 250,
			headerAlign: "left",
			align: "left",
			// valueGetter: (params) =>
			// 	params.row.messages?.length > 0
			// 		? params.row.messages[0].message_text
			// 		: "N/A", // Access message text
		},
		{
			field: "phone",
			headerName: "Recipient",
			width: 140,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "sender_id",
			headerName: "Sender ID",
			width: 120,
			headerAlign: "left",
			align: "left",
			valueGetter: (params) => params.row.sender_ids || "UBA",
		},
		{
			field: "Country",
			headerName: "Country",
			width: 120,
			headerAlign: "left",
			align: "left",
			renderCell: (params) => {
				const apiCountry = params.row.country;
				const country =
					!apiCountry || apiCountry === "N/A"
						? findCountryByPhoneNumber(params.row.phone)
						: apiCountry;

				return <p className='text-sm'>{country}</p>;
			},
		},
		{
			field: "created_at",
			headerName: "Sent Date",
			width: 180,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "updated_at",
			headerName: "Delivery Date",
			width: 180,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "status",
			headerName: "Status",
			width: 140,
			headerAlign: "left",
			align: "left",
			renderCell: (params) => {
				const statusMap = {
					DELIVRD: {
						label: "Delivered",
						class: "bg-green-100 text-green-700 border-green-300",
					},
					EXPIRD: {
						label: "Expired",
						class: "bg-gray-100 text-gray-700 border-gray-300",
					},
					UNDELIV: {
						label: "Undelivered",
						class: "bg-red-100 text-red-700 border-red-300",
					},
					REJECTED: {
						label: "Rejected",
						class: "bg-red-100 text-red-700 border-red-300",
					},
				};

				// Default to Pending/Sent if null/empty
				const statusValue = params.value || "";
				const status = statusMap[statusValue] || {
					label: statusValue === "" ? "Pending" : "Sent",
					class:
						statusValue === ""
							? "bg-yellow-100 text-yellow-700 border-yellow-300"
							: "bg-blue-100 text-blue-700 border-blue-300",
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
			field: "error_reason",
			headerName: "Error Reason",
			width: 220,
			headerAlign: "left",
			align: "left",
			renderCell: (params) => {
				const status = params.row.status;
				const errorReason = params.row.error_reason;

				// If delivered, always show Delivered
				if (status === "DELIVRD") {
					return <p className='text-sm text-green-700'>Delivered</p>;
				}

				return (
					<p className='text-sm text-gray-700'>
						{errorReason ? errorReason : "N/A"}
					</p>
				);
			},
		},
	];

	const override = { display: "block", margin: "0 auto" };

	// --- JSX Render (Using Component 1 & 2 structure) ---
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
							Loading International logs...
						</p>
					</div>
				</div>
			) : (
				<div className='max-w-7xl mx-auto px-4 py-6'>
					{/* Header Section (White Card) */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									International SMS Logs
								</h1>
								<p className='text-sm text-gray-500 mt-1'>
									View and manage all international message transactions
								</p>
							</div>
							{downloadButton && (
								<CSVLink
									data={transformDataForCSV(initialData)}
									filename={`International_Report_${new Date().toLocaleDateString()}.csv`}
									className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm'
								>
									<FaDownload className='text-sm' />
									<span>Export Report</span>
								</CSVLink>
							)}
						</div>
					</div>

					{/* Filters Section (White Card) */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6'>
						<div className='flex items-center gap-2 mb-4'>
							<FaFilter className='text-red-600' />
							<h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
						</div>

						{/* Phone Search Form */}
						<form
							className='flex items-center gap-2 w-full max-w-sm'
							onSubmit={filterTable}
						>
							<input
								type='search'
								placeholder='Search by phone number'
								className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm'
								value={filterValue}
								required
								onChange={(e) => setFilterValue(e.target.value)}
							/>
							<button
								type='submit'
								className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-300'
							>
								<FaSearch />
							</button>
						</form>
					</div>

					{/* Data Grid Section (White Card) */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<DataGrid
							rows={initialData}
							rowHeight={70}
							// Using the newColumns with correct field names
							columns={newColumns}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 10 },
								},
							}}
							sx={{
								border: "none", // Override old border
								// Match Header Style
								"& .MuiDataGrid-columnHeaders": {
									backgroundColor: "#f9fafb",
									borderBottom: "2px solid #e5e7eb",
									fontSize: "0.875rem",
									fontWeight: 600,
									color: "#374151",
								},
								// Match Cell Style
								"& .MuiDataGrid-cell": {
									borderBottom: "1px solid #f3f4f6",
									fontSize: "0.875rem",
								},
								// Match Row Hover Effect (Light Red)
								"& .MuiDataGrid-row:hover": {
									backgroundColor: "#fef2f2",
								},
								// Match Footer Style
								"& .MuiDataGrid-footerContainer": {
									borderTop: "2px solid #e5e7eb",
									backgroundColor: "#f9fafb",
								},
								// Match Red Accent for Checkbox
								"& .MuiCheckbox-root.Mui-checked": {
									color: "#DC2626",
								},
								"& .MuiDataGrid-cell:focus": {
									outline: "none",
								},
							}}
							pageSizeOptions={[10, 25, 50, 100]} // Unified options
							checkboxSelection
							// Use row?.id if available, otherwise use a combination of primary keys for stability
							getRowId={(row) => row.id || `${row.phone}-${row.created_at}`}
							disableRowSelectionOnClick
						/>
					</div>
				</div>
			)}
		</div>
	);
};
