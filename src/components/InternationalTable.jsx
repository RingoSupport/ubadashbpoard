import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
	TextField,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
	Typography,
	Grid,
	Button,
} from "@mui/material";
import dayjs from "dayjs";
import { FaSearch, FaDownload, FaFilter } from "react-icons/fa";
import { CSVLink } from "react-csv";

// Helper function for data transformation
const transformData = (data) => {
	return Object.entries(data).map(([country, stats]) => {
		const nullCount = Number(stats["null"]) || 0;
		const delivered = Number(stats.DELIVRD) || 0;
		const undelivered = Number(stats.UNDELIV) || 0;
		const totalMessages = nullCount + delivered + undelivered;

		const deliveredPercentage =
			totalMessages === 0 ? 0 : ((delivered / totalMessages) * 100).toFixed(2);

		return {
			country,
			nullCount,
			delivered,
			undelivered,
			totalMessages,
			deliveredPercentage: Number(deliveredPercentage), // Store as number for sorting
		};
	});
};

export const InternationalTable = () => {
	// --- State Management ---
	const [apiData, setApiData] = useState([]); // Master data set from API (for internal filtering)
	const [data, setData] = useState([]); // Filtered data for the grid
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("");
	const [loading, setLoading] = useState(true);

	// Date/Time states for API fetching
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	// Date/Time states for UI input
	const [tempStartDate, setTempStartDate] = useState(
		dayjs().startOf("day").format("YYYY-MM-DDTHH:mm")
	);
	const [tempEndDate, setTempEndDate] = useState(
		dayjs().endOf("day").format("YYYY-MM-DDTHH:mm")
	);

	// --- Data Fetching ---
	const fetchData = async (from, to) => {
		setLoading(true);
		try {
			let url = "https://messaging.approot.ng/internationaldata.php";
			let queryParams = "";

			if (from && to) {
				// Ensure the required format for the API: YYYY-MM-DD HH:mm:ss
				const formattedFrom = from.replace("T", " ") + ":00";
				const formattedTo = to.replace("T", " ") + ":59";

				url = "https://messaging.approot.ng/internationaltimedata.php";
				queryParams = `?from=${encodeURIComponent(
					formattedFrom
				)}&to=${encodeURIComponent(formattedTo)}`;
			}

			const { data: rawData } = await axios.get(url + queryParams);
			const transformedData = transformData(rawData);

			setApiData(transformedData);
			setData(transformedData); // Reset DataGrid data with new API data
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	// --- Handlers ---
	const handleDateSubmit = (e) => {
		e.preventDefault();
		// Update the actual date/time states based on temporary UI values
		setStartDate(tempStartDate);
		setEndDate(tempEndDate);

		// Fetch data immediately using the temporary values
		fetchData(tempStartDate, tempEndDate);
	};

	// --- Data Filtering (Client-side) ---
	useEffect(() => {
		let filteredData = apiData;

		// 1. Filter by search term
		if (searchTerm !== "") {
			filteredData = filteredData.filter((item) =>
				item.country.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// 2. Filter and Sort by delivery status
		if (filterStatus) {
			if (filterStatus === "delivered") {
				filteredData = filteredData
					.filter((item) => item.delivered > 0)
					.sort((a, b) => b.delivered - a.delivered);
			} else if (filterStatus === "undelivered") {
				filteredData = filteredData
					.filter((item) => item.undelivered > 0)
					.sort((a, b) => b.undelivered - a.undelivered);
			} else if (filterStatus === "null") {
				filteredData = filteredData
					.filter((item) => item.nullCount > 0)
					.sort((a, b) => b.nullCount - a.nullCount);
			}
		}

		setData(filteredData);
	}, [searchTerm, filterStatus, apiData]);

	// Fetch initial data on component mount
	useEffect(() => {
		fetchData();
	}, []);

	// --- DataGrid Columns ---
	const columns = useMemo(
		() => [
			{ field: "country", headerName: "Country", width: 180, sortable: true },
			{
				field: "delivered",
				headerName: "Delivered Count",
				width: 150,
				sortable: true,
				valueFormatter: (params) => params.value.toLocaleString(),
			},
			{
				field: "undelivered",
				headerName: "Undelivered Count",
				width: 150,
				sortable: true,
				valueFormatter: (params) => params.value.toLocaleString(),
			},
			{
				field: "nullCount",
				headerName: "Pending Count",
				width: 150,
				sortable: true,
				valueFormatter: (params) => params.value.toLocaleString(),
			},
			{
				field: "totalMessages",
				headerName: "Total Messages",
				width: 170,
				sortable: true,
				valueFormatter: (params) => params.value.toLocaleString(),
			},
			{
				field: "deliveredPercentage",
				headerName: "Delivered (%)",
				width: 170,
				sortable: true,
				type: "number",
				// Custom render for visual feedback
				renderCell: (params) => (
					<Box
						sx={{
							width: "90%",
							height: 20,
							bgcolor: "grey.300",
							borderRadius: 1,
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Box
							sx={{
								width: `${params.value}%`,
								height: "100%",
								bgcolor:
									params.value >= 70
										? "#38a169"
										: params.value >= 40
										? "#d69e2e"
										: "#e53e3e",
								borderRadius: 1,
							}}
						/>
						<Typography
							variant='caption'
							sx={{
								position: "absolute",
								fontSize: "0.75rem",
								fontWeight: "bold",
								color: "black",
								marginLeft: 1,
							}}
						>
							{params.value}%
						</Typography>
					</Box>
				),
			},
		],
		[]
	);

	// --- JSX Render (Using Unified Theme) ---
	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 3 }}>
			{/* Header Section */}
			<Box
				className='shadow-sm border border-gray-200'
				sx={{
					bgcolor: "white",
					borderRadius: 3,
					mb: 3,
					p: { xs: 2, md: 4 },
				}}
			>
				<Typography
					variant='h5'
					fontWeight='bold'
					color='text.primary'
					gutterBottom
					sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
				>
					🌍 International Delivery Analytics
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					Track and analyze SMS delivery performance across countries. Use
					filters to refine your view by date, country, or status.
				</Typography>
			</Box>

			{/* Filter Section */}
			<Box
				className='shadow-sm border border-gray-200'
				sx={{
					bgcolor: "white",
					borderRadius: 3,
					mb: 3,
					p: { xs: 2, md: 4 },
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						mb: 3,
						borderBottom: "1px solid #f3f4f6",
						pb: 1,
					}}
				>
					<FaFilter className='text-red-600 mr-2' />
					<Typography
						variant='h6'
						fontWeight='semibold'
						color='text.primary'
						sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
					>
						Report Filters
					</Typography>
				</Box>

				<form onSubmit={handleDateSubmit}>
					<Grid container spacing={2}>
						{/* Search Country */}
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label='Search Country'
								variant='outlined'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								fullWidth
								size='small'
								sx={{
									bgcolor: "white",
									borderRadius: 2,
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
									},
								}}
							/>
						</Grid>

						{/* Filter by Delivery Status */}
						<Grid item xs={12} sm={6} md={3}>
							<FormControl
								fullWidth
								size='small'
								sx={{
									bgcolor: "white",
									borderRadius: 2,
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
									},
								}}
							>
								<InputLabel>Filter by Status</InputLabel>
								<Select
									value={filterStatus}
									label='Filter by Status'
									onChange={(e) => setFilterStatus(e.target.value)}
								>
									<MenuItem value=''>All Status</MenuItem>
									<MenuItem value='delivered'>✅ Delivered</MenuItem>
									<MenuItem value='undelivered'>❌ Undelivered</MenuItem>
									<MenuItem value='null'>⏳ Pending</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						{/* Start Date-Time */}
						<Grid item xs={12} sm={6} md={2}>
							<TextField
								label='From Date'
								type='datetime-local'
								value={tempStartDate}
								onChange={(e) => setTempStartDate(e.target.value)}
								fullWidth
								size='small'
								InputLabelProps={{ shrink: true }}
								sx={{
									bgcolor: "white",
									borderRadius: 2,
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
									},
								}}
							/>
						</Grid>

						{/* End Date-Time */}
						<Grid item xs={12} sm={6} md={2}>
							<TextField
								label='To Date'
								type='datetime-local'
								value={tempEndDate}
								onChange={(e) => setTempEndDate(e.target.value)}
								fullWidth
								size='small'
								InputLabelProps={{ shrink: true }}
								sx={{
									bgcolor: "white",
									borderRadius: 2,
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
									},
								}}
							/>
						</Grid>

						{/* Apply Filter Button */}
						<Grid item xs={12} sm={6} md={2}>
							<Button
								variant='contained'
								type='submit'
								fullWidth
								sx={{
									bgcolor: "#DC2626",
									"&:hover": { bgcolor: "#B91C1C" },
									borderRadius: 2,
									textTransform: "none",
									py: "10px",
									fontWeight: 600,
								}}
								startIcon={<FaSearch />}
								disabled={loading}
							>
								Apply
							</Button>
						</Grid>
					</Grid>

					{/* Export Button */}
					<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
						{!loading && (
							<CSVLink
								data={data}
								filename={`International_Report_${new Date().toLocaleDateString()}.csv`}
								className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow'
							>
								<FaDownload className='text-sm' />
								<span>Export Report</span>
							</CSVLink>
						)}
					</Box>
				</form>
			</Box>

			{/* DataGrid Section */}
			<Box
				className='shadow-sm border border-gray-200'
				sx={{
					height: 600,
					width: "100%",
					bgcolor: "white",
					borderRadius: 3,
					overflow: "hidden",
				}}
			>
				{loading ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}
					>
						<CircularProgress sx={{ color: "#DC2626" }} />
						<Typography variant='body1' sx={{ ml: 2, color: "text.secondary" }}>
							Loading data...
						</Typography>
					</Box>
				) : (
					<DataGrid
						rows={data}
						columns={columns}
						pageSizeOptions={[10, 25, 50, 100]}
						disableSelectionOnClick
						getRowId={(row) => row.country}
						sortingOrder={["asc", "desc"]}
						initialState={{
							pagination: { paginationModel: { pageSize: 10 } },
							sorting: {
								sortModel: [{ field: "deliveredPercentage", sort: "desc" }],
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
						}}
					/>
				)}
			</Box>
		</Box>
	);
};
