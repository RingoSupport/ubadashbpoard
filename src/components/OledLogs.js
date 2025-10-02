import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
	Box,
	TextField,
	Button,
	Typography,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Paper,
	Chip,
} from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";

export const OledLogs = () => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState("");

	// Custom cell renderer for Result with chips
	const renderStatusChip = (params) => {
		const value = params.value;
		if (!value || value === "null")
			return (
				<Chip
					label='Pending'
					size='small'
					sx={{ background: "#9e9e9e", color: "#fff" }}
				/>
			);
		if (value.toUpperCase() === "DELIVRD")
			return (
				<Chip
					label='Delivered'
					size='small'
					sx={{ background: "#4caf50", color: "#fff" }}
				/>
			);
		if (value.toUpperCase() === "UNDELIV")
			return (
				<Chip
					label='Undelivered'
					size='small'
					sx={{ background: "#D42E11", color: "#fff" }}
				/>
			);
		return <Chip label={value} size='small' />;
	};

	const columns = [
		{
			field: "ssml_result",
			headerName: "Result",
			flex: 1,
			renderCell: renderStatusChip,
		},
		{ field: "ssml_network", headerName: "Network", flex: 1 },
		{ field: "ssml_message_id", headerName: "Message ID", flex: 1.5 },
		{
			field: "ssml_subscriber_number",
			headerName: "Subscriber Number",
			flex: 1.2,
		},
		{ field: "pk_ssml_log_time", headerName: "Log Time", flex: 1.5 },
		{ field: "ssml_logid", headerName: "Log ID", flex: 1 },
	];

	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const getLast10Digits =
				phoneNumber.length > 10 ? phoneNumber.slice(-10) : phoneNumber;

			const response = await axios.get(
				`https://ubasms.approot.ng/php/numberSearch.php?phone=${getLast10Digits}`
			);

			if (response.data && response.data.length > 0) {
				const sortedRows = response.data.sort(
					(a, b) => new Date(b.pk_ssml_log_time) - new Date(a.pk_ssml_log_time)
				);
				setRows(sortedRows);
			} else {
				setRows([]);
				setError("No data found for the provided phone number.");
			}
		} catch (error) {
			setError("An error occurred while fetching the data.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box p={3}>
			<Card
				elevation={4}
				sx={{
					borderRadius: 3,
					overflow: "hidden",
					backgroundColor: "#fff",
					border: "1px solid #e0e0e0",
				}}
			>
				<CardHeader
					title={
						<Typography
							variant='h6'
							fontWeight='bold'
							sx={{ color: "#D42E11" }}
						>
							OLD Logs Search
						</Typography>
					}
					subheader={
						<Typography variant='body2' color='text.secondary'>
							Enter a phone number to fetch logs and view subscriber details
						</Typography>
					}
				/>
				<Divider />

				<CardContent>
					<Box
						display='flex'
						gap={2}
						mb={3}
						flexDirection={{ xs: "column", sm: "row" }}
					>
						<TextField
							label='Phone Number'
							variant='outlined'
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							fullWidth
							size='small'
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: 2,
								},
							}}
						/>
						<Button
							variant='contained'
							onClick={fetchData}
							sx={{
								borderRadius: 2,
								px: 4,
								backgroundColor: "#D42E11",
								"&:hover": { backgroundColor: "#b6250e" },
							}}
						>
							Fetch Logs
						</Button>
					</Box>

					{loading ? (
						<Box
							display='flex'
							justifyContent='center'
							alignItems='center'
							height={300}
						>
							<ClipLoader size={60} color='#D42E11' loading={loading} />
						</Box>
					) : error ? (
						<Paper
							elevation={0}
							sx={{
								p: 3,
								textAlign: "center",
								backgroundColor: "#fff5f5",
								color: "#D42E11",
								borderRadius: 2,
								border: "1px solid #ffcdd2",
							}}
						>
							{error}
						</Paper>
					) : (
						<Box sx={{ height: 500, width: "100%" }}>
							<DataGrid
								rows={rows}
								columns={columns}
								pageSize={10}
								rowsPerPageOptions={[10, 20]}
								getRowId={(row) => row.ssml_logid}
								sx={{
									borderRadius: 2,
									border: "1px solid #e0e0e0",
									boxShadow: 1,
									"& .MuiDataGrid-columnHeaders": {
										backgroundColor: "#f5f5f5",
										color: "#333",
										fontWeight: "bold",
									},
									"& .MuiDataGrid-row:hover": {
										backgroundColor: "#fafafa",
									},
								}}
							/>
						</Box>
					)}
				</CardContent>
			</Card>
		</Box>
	);
};
