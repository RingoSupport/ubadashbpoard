// src/components/Design.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Tab, Tabs } from "@mui/material"; // Added Tabs, Tab
import FadeLoader from "react-spinners/FadeLoader";
import { motion } from "framer-motion";
import MetricsGrid from "./MetricsGrid";
import { computeDashboardData } from "../utils/dataUtils";
import { Delivery } from "./Delivery"; // Your existing Delivery component

// --- Bank Color Palette ---
const BANK_RED = "#DC2626"; // Primary Accent
const BANK_DARK_GRAY = "#374151"; // Primary Text/Header Color
const BANK_LIGHT_GRAY_BG = "#f7f7f7"; // Background Color
const BANK_BORDER_GRAY = "#e5e7eb"; // Border/Divider Color

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const options = {
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
};

const paragraphs = ["All Messages", "Transactional", "OTP"];

export const Design = ({
	items,
	loading,
	datum,
	otpItems,
	datumOtp,
	showSideBarFunc,
	sidebar,
}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [computedData, setComputedData] = useState({
		totalSms: 0,
		totalValue: 0,
		metrics: [],
	});
	const [currentItems, setCurrentItems] = useState([]);

	useEffect(() => {
		const selectedItems = paragraphs[activeIndex] === "OTP" ? otpItems : items;
		setCurrentItems(selectedItems);
		const data = computeDashboardData(selectedItems);
		setComputedData(data);
	}, [activeIndex, items, otpItems]);

	const handleTabChange = (event, newValue) => {
		setActiveIndex(newValue);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
					backgroundColor: BANK_LIGHT_GRAY_BG,
				}}
			>
				<FadeLoader color={BANK_RED} /> {/* Use Red for loader */}
			</Box>
		);
	}

	return (
		<motion.div
			className='p-6 min-h-screen'
			style={{ backgroundColor: BANK_LIGHT_GRAY_BG }} // Apply light gray background
			variants={containerVariants}
			initial='hidden'
			animate='visible'
		>
			{/* Header */}
			<header className='flex justify-between items-center mb-8'>
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
				>
					<Typography
						variant='h4'
						component='h1'
						sx={{ color: BANK_DARK_GRAY, fontWeight: "bold" }} // Use Dark Gray
					>
						📊 **{paragraphs[activeIndex]}** Detailed Insights
					</Typography>
					<Typography
						variant='body2'
						className='text-sm'
						sx={{ color: "text.secondary" }}
					>
						Last Updated on {new Date().toLocaleString("en-US", options)}
					</Typography>
				</motion.div>
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
				>
					<Button
						onClick={showSideBarFunc}
						variant='contained'
						sx={{
							backgroundColor: BANK_RED, // Use BANK RED
							"&:hover": {
								backgroundColor: "#A51717", // Darker Red on hover
							},
							boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
							textTransform: "none",
							fontWeight: "bold",
							color: "white", // Ensure text is white
						}}
					>
						{sidebar ? "Expand" : "DePress"}
					</Button>
				</motion.div>
			</header>

			{/* Tabs (Styled with Red Accent) */}
			<Paper
				elevation={1}
				sx={{
					mb: 4,
					borderRadius: "8px",
					bgcolor: "white",
					border: `1px solid ${BANK_BORDER_GRAY}`, // Use gray border
				}}
			>
				<Tabs
					value={activeIndex}
					onChange={handleTabChange}
					TabIndicatorProps={{
						style: { backgroundColor: BANK_RED, height: 3 }, // Red indicator
					}}
				>
					{paragraphs.map((paragraph, index) => (
						<Tab
							key={index}
							label={paragraph}
							sx={{
								textTransform: "none",
								fontWeight: "bold",
								color: index === activeIndex ? BANK_RED : BANK_DARK_GRAY, // Active red, inactive dark gray
								"&:hover": {
									backgroundColor: "#FEF2F2", // Light red hover
								},
							}}
						/>
					))}
				</Tabs>
			</Paper>

			{/* Metrics Grid */}
			<MetricsGrid metrics={computedData.metrics} />

			{/* Chart Section */}
			<Paper
				elevation={3}
				sx={{
					p: 4,
					borderRadius: "12px",
					backgroundColor: "#fff", // White paper background
					mt: 4,
				}}
			>
				<Typography
					variant='h6'
					sx={{ color: BANK_DARK_GRAY, fontWeight: "bold", mb: 3 }}
				>
					📈 Delivery Status By Networks
				</Typography>
				<Box>
					<Delivery
						datum={datum}
						paragraph={paragraphs[activeIndex]}
						computeData={currentItems}
						otp={datumOtp}
					/>
				</Box>
			</Paper>
		</motion.div>
	);
};
