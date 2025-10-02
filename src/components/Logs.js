import React, { useState } from "react";
import axios from "axios";
import { FaDownload, FaFilter, FaClock } from "react-icons/fa";
import { FadeLoader } from "react-spinners";
import {
	Box,
	Typography,
	Button,
	Grid,
	TextField,
	Alert,
	CircularProgress,
	Tabs,
	Tab,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";

// --- Themed Components & Styles ---

const BANK_RED = "#DC2626"; // Primary Accent
const BANK_DARK_GRAY = "#374151"; // Primary Text/Header Color
const BANK_LIGHT_GRAY_BG = "#f3f4f6"; // App Background
const BANK_BORDER_GRAY = "#e5e7eb"; // Border Color

// Custom Tabs Component
const ThemedTabs = styled(Tabs)({
	borderBottom: `2px solid ${BANK_BORDER_GRAY}`,
	"& .MuiTabs-indicator": {
		backgroundColor: BANK_RED,
		height: 3,
	},
});

const ThemedTab = styled(Tab)({
	textTransform: "none",
	fontWeight: 600,
	fontSize: "1rem",
	color: BANK_DARK_GRAY,
	"&.Mui-selected": {
		color: BANK_RED,
	},
});

// Themed Red Button
const RedButton = styled(Button)({
	backgroundColor: BANK_RED,
	"&:hover": {
		backgroundColor: "#A51717", // Darker Red on hover
	},
	fontWeight: "bold",
});

// --- Utility Components for each Tab Content ---

// 1. Airtime/Data Logs
const AirtimeDataLogs = ({
	transaction,
	setTransaction,
	downloadButtonStat,
	handleDownloadTransaction,
	error,
	setToDateTransaction,
	setFromDateTransaction,
	toDateTransaction,
	fromDateTransaction,
}) => (
	<Box
		sx={{
			p: 3,
			maxWidth: 500,
			mx: "auto",
			bgcolor: "white",
			borderRadius: 2,
			border: `1px solid ${BANK_BORDER_GRAY}`,
		}}
	>
		<Tabs
			value={transaction}
			onChange={(e, newValue) => setTransaction(newValue)}
			centered
			sx={{ mb: 3 }}
		>
			<Tab
				value='Airtime'
				label='Airtime'
				sx={{ color: transaction === "Airtime" ? BANK_RED : BANK_DARK_GRAY }}
			/>
			<Tab
				value='Data'
				label='Data'
				sx={{ color: transaction === "Data" ? BANK_RED : BANK_DARK_GRAY }}
			/>
		</Tabs>

		<DownloadForm
			title={`${transaction} Download`}
			fromDateState={[fromDateTransaction, setFromDateTransaction]}
			toDateState={[toDateTransaction, setToDateTransaction]}
			onSubmit={handleDownloadTransaction}
			buttonText={downloadButtonStat ? "Processing..." : "Download CSV"}
			disabled={downloadButtonStat}
			error={error}
			isDateTime={false}
		/>
	</Box>
);

// 2. Download Logs (Local, OTP, International, Non-Trans)
const DownloadLogs = ({
	area,
	setArea,
	downloadButtonStat,
	handleDownload,
	error,
}) => {
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	return (
		<Box
			sx={{
				p: 3,
				maxWidth: 800,
				mx: "auto",
				bgcolor: "white",
				borderRadius: 2,
				border: `1px solid ${BANK_BORDER_GRAY}`,
			}}
		>
			<ThemedTabs
				value={area}
				onChange={(e, newValue) => setArea(newValue)}
				variant='scrollable'
				scrollButtons='auto'
			>
				<ThemedTab value='local' label='Local SMS' />
				<ThemedTab value='international' label='International SMS' />
				<ThemedTab value='otp' label='OTP SMS' />
				<ThemedTab value='nontrans' label='Non-Transactional SMS' />
			</ThemedTabs>

			<Box sx={{ mt: 3 }}>
				<DownloadForm
					title={`${area.toUpperCase()} Logs Download`}
					fromDateState={[fromDate, setFromDate]}
					toDateState={[toDate, setToDate]}
					onSubmit={(e) => {
						e.preventDefault();
						handleDownload(fromDate, toDate, area); // Pass states to main handler
					}}
					buttonText={downloadButtonStat ? "Processing..." : "Download CSV"}
					disabled={downloadButtonStat}
					error={error}
					isDateTime={false}
				/>
			</Box>
		</Box>
	);
};

// 3. Delivery Status Logs (Single Date Export)
const DeliveryStatusLogs = ({ loading, handleSubmit, dates, setDates }) => (
	<Box
		sx={{
			p: 4,
			maxWidth: 400,
			mx: "auto",
			bgcolor: "white",
			borderRadius: 2,
			border: `1px solid ${BANK_BORDER_GRAY}`,
			textAlign: "center",
		}}
	>
		<Typography
			variant='h6'
			sx={{ color: BANK_DARK_GRAY, mb: 3, fontWeight: "bold" }}
		>
			Export Network Summary
		</Typography>
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<TextField
				label='Select Date'
				type='date'
				value={dates}
				onChange={(e) => setDates(e.target.value)}
				required
				fullWidth
				size='small'
				InputLabelProps={{ shrink: true }}
				sx={{
					mb: 3,
					"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
						{ borderColor: BANK_RED },
					"& .MuiInputLabel-root.Mui-focused": { color: BANK_RED },
				}}
			/>
			<RedButton
				type='submit'
				disabled={loading}
				variant='contained'
				startIcon={
					loading ? (
						<CircularProgress size={20} color='inherit' />
					) : (
						<FaDownload />
					)
				}
			>
				{loading ? "Generating..." : "Download CSV"}
			</RedButton>
		</form>
	</Box>
);

// 4. Failure Logs (OTP, International, Validation needed)
const FailureLogs = ({
	area,
	setArea,
	downloadButtonStat,
	handleDownloadTransactions,
	errors,
	fromDateTransactions,
	setFromDateTransactions,
	toDateTransactions,
	setToDateTransactions,
}) => {
	// Check if the date difference is more than 24 hours (for validation feedback)
	const isDateRangeValid = () => {
		if (!fromDateTransactions || !toDateTransactions) return true;
		const fromDate = new Date(fromDateTransactions);
		const toDate = new Date(toDateTransactions);
		const differenceInTime = toDate - fromDate;
		const differenceInHours = differenceInTime / (1000 * 60 * 60);
		return differenceInHours <= 24 && differenceInHours >= 0;
	};

	return (
		<Box
			sx={{
				p: 3,
				maxWidth: 800,
				mx: "auto",
				bgcolor: "white",
				borderRadius: 2,
				border: `1px solid ${BANK_BORDER_GRAY}`,
			}}
		>
			<ThemedTabs
				value={area}
				onChange={(e, newValue) => setArea(newValue)}
				variant='scrollable'
				scrollButtons='auto'
			>
				<ThemedTab value='otpsms' label='Local OTP SMS' />
				<ThemedTab value='inter' label='International SMS' />
				<ThemedTab value='interotpsms' label='International OTP SMS' />
			</ThemedTabs>

			<Box sx={{ mt: 3 }}>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					Note: Failure report downloads are restricted to a **24-hour range**
					due to data volume.
				</Typography>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleDownloadTransactions();
					}}
				>
					<Grid container spacing={3} alignItems='center'>
						<Grid item xs={12} sm={5}>
							<TextField
								label='From Date'
								type='date'
								value={fromDateTransactions}
								onChange={(e) => setFromDateTransactions(e.target.value)}
								required
								fullWidth
								size='small'
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								label='To Date'
								type='date'
								value={toDateTransactions}
								onChange={(e) => setToDateTransactions(e.target.value)}
								required
								fullWidth
								size='small'
								InputLabelProps={{ shrink: true }}
								error={!isDateRangeValid()}
								helperText={
									!isDateRangeValid()
										? "Date range must not exceed 24 hours."
										: ""
								}
							/>
						</Grid>
						<Grid item xs={12} sm={2}>
							<RedButton
								type='submit'
								disabled={downloadButtonStat || !isDateRangeValid()}
								variant='contained'
								fullWidth
								startIcon={
									downloadButtonStat ? (
										<CircularProgress size={20} color='inherit' />
									) : (
										<FaDownload />
									)
								}
							>
								{downloadButtonStat ? "Loading..." : "Download"}
							</RedButton>
						</Grid>
					</Grid>

					{(errors || !isDateRangeValid()) && (
						<Alert severity='error' sx={{ mt: 2 }}>
							{errors || "The selected date range exceeds 24 hours."}
						</Alert>
					)}
				</form>
			</Box>
		</Box>
	);
};

// Generic Download Form component (for reuse and cleaner styling)
const DownloadForm = ({
	fromDateState,
	toDateState,
	onSubmit,
	buttonText,
	disabled,
	error,
	isDateTime = false,
	title,
}) => {
	const [fromDate, setFromDate] = fromDateState;
	const [toDate, setToDate] = toDateState;

	return (
		<form onSubmit={onSubmit}>
			<Typography
				variant='h6'
				sx={{
					color: BANK_DARK_GRAY,
					mb: 3,
					fontWeight: "bold",
					textAlign: "center",
				}}
			>
				{title}
			</Typography>
			<Grid container spacing={3} justifyContent='center' sx={{ mb: 3 }}>
				<Grid item xs={12} sm={5}>
					<TextField
						label='From Date'
						type={isDateTime ? "datetime-local" : "date"}
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
						required
						fullWidth
						size='small'
						InputLabelProps={{ shrink: true }}
						sx={{
							"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
								{ borderColor: BANK_RED },
							"& .MuiInputLabel-root.Mui-focused": { color: BANK_RED },
						}}
					/>
				</Grid>
				<Grid item xs={12} sm={5}>
					<TextField
						label='To Date'
						type={isDateTime ? "datetime-local" : "date"}
						value={toDate}
						onChange={(e) => setToDate(e.target.value)}
						required
						fullWidth
						size='small'
						InputLabelProps={{ shrink: true }}
						sx={{
							"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
								{ borderColor: BANK_RED },
							"& .MuiInputLabel-root.Mui-focused": { color: BANK_RED },
						}}
					/>
				</Grid>
			</Grid>

			<Box sx={{ textAlign: "center" }}>
				{error && (
					<Alert severity='error' sx={{ mb: 2, display: "inline-flex" }}>
						{error}
					</Alert>
				)}
				<RedButton
					type='submit'
					disabled={disabled}
					variant='contained'
					startIcon={
						disabled ? (
							<CircularProgress size={20} color='inherit' />
						) : (
							<FaDownload />
						)
					}
				>
					{buttonText}
				</RedButton>
			</Box>
		</form>
	);
};

// --- Main Logs Component ---
export const Logs = () => {
	// --- State Management ---
	const [tab, setTab] = useState("daily"); // Replaced 'border' with 'tab'
	const [area, setArea] = useState("local"); // Used for Download Logs and Failure Logs sub-tabs
	const [transaction, setTransaction] = useState("Airtime"); // Used for Airtime/Data logs

	// Download Log States (Date-based)
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	// Airtime/Data Log States
	const [fromDateTransaction, setFromDateTransaction] = useState("");
	const [toDateTransaction, setToDateTransaction] = useState("");

	// Failure Log States
	const [fromDateTransactions, setFromDateTransactions] = useState("");
	const [toDateTransactions, setToDateTransactions] = useState("");

	// Delivery Status Log States
	const [dates, setDates] = useState("");

	// Generic UI States
	const [loading, setLoading] = useState(false); // Used for Delivery Status CSV
	const [downloadButtonStat, setDownloadButtonStat] = useState(false); // Used for other downloads
	const [error, setError] = useState(null); // Used for general download errors
	const [errors, setErrors] = useState(""); // Used for Failure Log validation errors

	// --- Handlers (Original Logic Preserved) ---

	const handleDownloadTransaction = async (e) => {
		e.preventDefault();
		setError(null);
		if (!fromDateTransaction || !toDateTransaction) {
			setError("Please select both from and to dates.");
			return;
		}

		try {
			setDownloadButtonStat(true);
			const fromDateTime = `${fromDateTransaction}`;
			const toDateTime = `${toDateTransaction}`;

			let url =
				transaction === "Airtime"
					? "https://ubasms.approot.ng/php/airtimecsv.php"
					: "https://ubasms.approot.ng/php/datacsv.php";

			const { data } = await axios.get(url, {
				params: { fromDate: fromDateTime, toDate: toDateTime },
				responseType: "blob",
			});

			if (data) {
				const blob = new Blob([data], { type: "text/csv" });
				const csvUrl = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = csvUrl;
				a.download = `${transaction.toLowerCase()}_${fromDateTime}_${toDateTime}.csv`;
				a.click();
			} else {
				setError("Error downloading CSV: No data received.");
			}
		} catch (err) {
			setError("An error occurred while downloading the CSV.");
			console.error(err);
		} finally {
			setDownloadButtonStat(false);
		}
	};

	const handleDownload = async (fromDate, toDate, currentArea) => {
		setError(null);
		if (!fromDate || !toDate) {
			setError("Please select both from and to dates.");
			return;
		}

		const fromDates = new Date(fromDate);
		const toDates = new Date(toDate);
		const currentDate = new Date();

		// Validation checks
		if (fromDates > toDates) {
			setError('The "from" date cannot be greater than the "to" date.');
			return;
		}
		if (fromDates > currentDate || toDates > currentDate) {
			setError("Dates cannot be greater than the current date.");
			return;
		}

		try {
			setDownloadButtonStat(true);
			let url;
			let name;

			if (currentArea === "local") {
				url = "https://ubasms.approot.ng/php/download.php";
				name = "local";
			} else if (currentArea === "otp") {
				url = "https://ubasms.approot.ng/php/otpdownload.php";
				name = "otp";
			} else if (currentArea === "international") {
				url = "https://messaging.approot.ng/internationalTransaction.php";
				name = "international";
			} else {
				// nontrans
				url = "https://ubasms.approot.ng/php/nontransdownload.php";
				name = "nontransactional";
			}

			const { data } = await axios.get(url, {
				params: { fromDate: fromDate, toDate: toDate },
				responseType: "blob",
			});

			if (data) {
				const blob = new Blob([data], { type: "text/csv" });
				const csvUrl = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = csvUrl;
				a.download = `sms_data_${name}_${fromDate}_${toDate}.csv`;
				a.click();
			} else {
				setError("Error downloading CSV: No data received.");
			}
		} catch (err) {
			setError("An error occurred while downloading the CSV.");
			console.error(err);
		} finally {
			setDownloadButtonStat(false);
		}
	};

	const handleDownloadTransactions = async () => {
		setErrors("");

		if (!fromDateTransactions || !toDateTransactions) {
			setErrors("Please select both from and to dates.");
			return;
		}

		const fromDate = new Date(fromDateTransactions);
		const toDate = new Date(toDateTransactions);
		const differenceInTime = toDate - fromDate;
		const differenceInHours = differenceInTime / (1000 * 60 * 60);

		if (differenceInHours > 24 || differenceInHours < 0) {
			setErrors(
				"The date range must not exceed 24 hours and 'from' must be before 'to'."
			);
			return;
		}

		const formattedStartDate = `${fromDateTransactions} 00:00:00`;
		const formattedEndDate = `${toDateTransactions} 23:59:59`;

		let endpoint;
		if (area === "otpsms") {
			endpoint = "https://ubasms.approot.ng/php/ubadashboard/failurereport.php";
		} else if (area === "inter") {
			endpoint = "https://messaging.approot.ng/internationalcsv.php";
		} else if (area === "interotpsms") {
			endpoint = "https://messaging.approot.ng/internationalotpcsv.php";
		}

		try {
			setDownloadButtonStat(true);
			const { data } = await axios({
				url: endpoint,
				method: "GET",
				params: {
					start_date: formattedStartDate,
					end_date: formattedEndDate,
				},
				responseType: "blob",
			});

			const url = window.URL.createObjectURL(new Blob([data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${area}_failure_report.csv`);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (err) {
			console.error(err);
			setErrors(
				"An error occurred while downloading the file. Check console for details."
			);
		} finally {
			setDownloadButtonStat(false);
		}
	};

	const handleSubmitDeliveryStatus = () => {
		if (!dates) {
			setErrors("Please select a date.");
			return;
		}
		handleDownloadCSV();
	};

	const handleDownloadCSV = async () => {
		setLoading(true);
		setErrors("");

		try {
			const formData = new FormData();
			formData.append("from", dates);
			formData.append("to", dates);

			const { data } = await axios.post(
				"https://ubasms.approot.ng/php/smscsv.php",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
					responseType: "blob",
				}
			);

			const url = window.URL.createObjectURL(new Blob([data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `network_summary_${dates}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error fetching or downloading data:", error);
			setErrors("Failed to download network summary. Server error.");
		} finally {
			setLoading(false);
		}
	};

	// --- JSX Structure ---
	return (
		<Box sx={{ p: 3, bgcolor: BANK_LIGHT_GRAY_BG, minHeight: "100vh" }}>
			<Box sx={{ mb: 4 }}>
				<Typography
					variant='h4'
					fontWeight='bold'
					sx={{
						color: BANK_DARK_GRAY,
						borderBottom: `2px solid ${BANK_RED}`,
						pb: 1,
						display: "inline-block",
					}}
				>
					System Logs & Downloads 📥
				</Typography>
			</Box>

			{/* Main Navigation Tabs */}
			<Box
				sx={{
					bgcolor: "white",
					borderRadius: 2,
					border: `1px solid ${BANK_BORDER_GRAY}`,
					mb: 4,
					p: 2,
				}}
			>
				<ThemedTabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
					<ThemedTab value='daily' label='Airtime/Data Logs' />
					<ThemedTab value='download' label='SMS Logs Download' />
					<ThemedTab value='logs' label='Network Status Export' />
					<ThemedTab value='Failure' label='Failure Logs (24hr Max)' />
				</ThemedTabs>
			</Box>

			{/* Content Display */}
			<Box sx={{ mt: 3 }}>
				{tab === "daily" && (
					<AirtimeDataLogs
						transaction={transaction}
						setTransaction={setTransaction}
						downloadButtonStat={downloadButtonStat}
						handleDownloadTransaction={handleDownloadTransaction}
						error={error}
						fromDateTransaction={fromDateTransaction}
						setFromDateTransaction={setFromDateTransaction}
						toDateTransaction={toDateTransaction}
						setToDateTransaction={setToDateTransaction}
					/>
				)}

				{tab === "download" && (
					<DownloadLogs
						area={area}
						setArea={setArea}
						downloadButtonStat={downloadButtonStat}
						handleDownload={handleDownload}
						error={error}
						// States are managed internally within DownloadLogs to simplify the main component
					/>
				)}

				{tab === "logs" && (
					<DeliveryStatusLogs
						loading={loading}
						handleSubmit={handleSubmitDeliveryStatus}
						dates={dates}
						setDates={setDates}
					/>
				)}

				{tab === "Failure" && (
					<FailureLogs
						area={area}
						setArea={setArea}
						downloadButtonStat={downloadButtonStat}
						handleDownloadTransactions={handleDownloadTransactions}
						errors={errors}
						fromDateTransactions={fromDateTransactions}
						setFromDateTransactions={setFromDateTransactions}
						toDateTransactions={toDateTransactions}
						setToDateTransactions={setToDateTransactions}
					/>
				)}
			</Box>
		</Box>
	);
};
