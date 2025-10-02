// src/components/MetricsGrid.js
import React from "react";
import { motion } from "framer-motion";
import { Paper, Box, Grid, Typography, LinearProgress } from "@mui/material";

const getProgressBarColor = (name) => {
	switch (name) {
		case "Delivered":
			return "#16a34a"; // Green
		case "Undelivered":
			return "#ef4444"; // Red
		case "Pending / Enroute":
			return "#eab308"; // Yellow
		case "Expired":
			return "#3b82f6"; // Blue
		case "Unknown":
			return "#78350f"; // Brown
		default:
			return "#94a3b8"; // Gray
	}
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: { y: 0, opacity: 1 },
};

const MetricsGrid = ({ metrics }) => {
	return (
		<Grid container spacing={3} sx={{ mb: 4 }}>
			{metrics.map((item, index) => (
				<Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
					<motion.div variants={itemVariants}>
						<Paper
							elevation={3}
							sx={{
								p: 3,
								borderRadius: "12px",
								backgroundColor: "#fff",
								transition: "transform 0.3s ease-in-out",
								"&:hover": { transform: "scale(1.03)" },
							}}
						>
							<Typography
								variant='body2'
								component='h3'
								sx={{
									fontSize: "0.80rem", // Smaller text for the label
									fontWeight: "semibold",
									color: "text.secondary",
									textTransform: "uppercase",
									mb: 1,
								}}
							>
								{item.name}
							</Typography>
							<Typography
								variant='h5'
								component='p'
								sx={{
									fontSize: "1.5rem", // Size for the value
									fontWeight: "bold",
									mb: 2,
								}}
							>
								{item.value}
							</Typography>
							<Box sx={{ width: "100%" }}>
								<LinearProgress
									variant='determinate'
									value={parseFloat(item.percentage)}
									sx={{
										height: 8,
										borderRadius: "5px",
										backgroundColor: "#e5e7eb",
										"& .MuiLinearProgress-bar": {
											backgroundColor: getProgressBarColor(item.name),
										},
									}}
								/>
							</Box>
							<Typography
								variant='caption' // Smallest variant
								sx={{
									color: "text.disabled",
									mt: 1,
								}}
							>
								{item.percentage}
							</Typography>
						</Paper>
					</motion.div>
				</Grid>
			))}
		</Grid>
	);
};

export default MetricsGrid;
