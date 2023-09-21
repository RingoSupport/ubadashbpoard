import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { checkDlr } from "../utils/dlr";
import FadeLoader from "react-spinners/FadeLoader";

export const Transactions = () => {
	const [dataItems, setDataItems] = useState([]);
	const [initialData, setinitialData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filterValue, setFilterValue] = useState("");

	const [rangeValue, setRangeValue] = useState({ number: "", range: "" });

	const filterTable = (val) => {
		setFilterValue(val);
		if (filterValue.length > 0) {
			const filteredData = dataItems.filter((item) =>
				item.ssml_subscriber_number.includes(filterValue)
			);
			setinitialData(filteredData);
		} else {
			setinitialData(dataItems);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setRangeValue({ ...rangeValue, [name]: value });
		console.log(rangeValue);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!rangeValue.number && !rangeValue.range) {
			return alert("please select a filter value");
		}
		const dateRange = calculateDateRange(rangeValue.range);
		console.log(dateRange);
		setLoading(true);
		try {
			const { data } = await axios.get(
				`http://34.118.77.154:9091/php/filterByValue.php?phone=${rangeValue.number}&from=${dateRange.startDate}&to=${dateRange.endDate}`
			);
			setDataItems(data);
			setinitialData(data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const calculateDateRange = (selectedOption) => {
		const today = new Date();
		let startDate;
		let endDate;

		if (selectedOption === "last2days") {
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 2);
		} else if (selectedOption === "last7days") {
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 7);
		} else if (selectedOption === "lastMonth") {
			startDate = new Date(today);
			startDate.setMonth(today.getMonth() - 1);
		}
		endDate = new Date(today);
		endDate.setHours(23, 59, 59, 999); // Set the time to 11:59:59

		return {
			startDate: startDate.toISOString().slice(0, 19).replace("T", " "), // Format as 'YYYY-MM-DD HH:MM:SS'
			endDate: endDate.toISOString().slice(0, 19).replace("T", " "), // Format as 'YYYY-MM-DD HH:MM:SS'
		};
	};
	const newColumns = [
		{ field: "pk_ssml_log_time", headerName: "Timestamp", width: 200 },
		{ field: "ssml_called_number", headerName: "From", width: 100 },
		{ field: "ssml_calling_number", headerName: "To", width: 100 },
		{
			field: "ssml_correlate_id",
			headerName: "Correlate ID",
			type: "number",
			width: 150,
		},
		{
			field: "ssml_result",
			headerName: "Status",
			sortable: false,
			width: 100,
			valueGetter: (params) => `${checkDlr(params.row.ssml_result)}`,
		},
		{
			field: "ssml_smpp_message_id",
			headerName: "Message ID",
			type: "number",
			width: 200,
		},
		{
			field: "ssml_content",
			headerName: "Message",
			type: "number",
			width: 200,
		},
		{
			field: "ssml_subscriber_number",
			headerName: "Subscriber Number",
			type: "number",
			width: 120,
		},
	];

	const getItems = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				"http://34.118.77.154:9091/php/transactions.php"
			);
			setDataItems(data);
			setinitialData(data);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const override = {
		display: "block",
		margin: "0 auto",
	};

	useEffect(() => {
		getItems();

		return () => {
			console.log("cleared data");
		};
	}, []);

	return (
		<div>
			{loading ? (
				<div className='flex justify-center items-center h-screen'>
					<FadeLoader
						loading={loading}
						cssOverride={override}
						size={250}
						aria-label='Loading Spinner'
						data-testid='loader'
					/>
				</div>
			) : (
				<div>
					<div className='flex justify-center flex-col items-center overflow-auto bg-gray-100'>
						<div className='space-x-4 flex justify-between items-center bg-gray-300 my-4 w-full p-4'>
							{/* Form 1 */}
							<form className='flex items-center justify-center text-center  space-x-2'>
								<span className=''>Filter Table</span>
								<input
									type='number'
									placeholder='Enter a number'
									className='border focus:outline-none border-gray-300 px-3 py-2 rounded-md'
									value={filterValue}
									onChange={(e) => filterTable(e.target.value)}
								/>
							</form>

							{/* Form 2 */}
							<form
								className='flex justify-center items-center space-x-2'
								onSubmit={handleSubmit}
							>
								<span className=''>Search</span>
								<input
									type='search'
									placeholder='Enter a number'
									className='border border-gray-300 px-3 py-2 rounded-md focus:outline-none'
									name='number'
									value={rangeValue.number}
									onChange={(e) => handleChange(e)}
								/>
								<select
									className='border focus:outline-none border-gray-300 px-3 py-2 rounded-md'
									name='range'
									value={rangeValue.range}
									onChange={(e) => handleChange(e)}
								>
									<option value=''>Select Range</option>
									<option value='last2days'>Last 2 days</option>
									<option value='last7days'>Last 7 days</option>
									<option value='lastMonth'>Last month</option>
								</select>
								<button
									type='submit'
									className='bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600'
								>
									Submit
								</button>
							</form>
						</div>
						<div className='flex flex-col justify-center items-center p-8'>
							<DataGrid
								rows={initialData}
								columns={newColumns}
								initialState={{
									pagination: {
										paginationModel: { page: 0, pageSize: 10 },
									},
								}}
								sx={{
									boxShadow: 2,
									border: 0.5,
									width: "82%",
								}}
								pageSizeOptions={[10, 20]}
								checkboxSelection
								getRowId={(row) => row?.ssml_smpp_message_id}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
