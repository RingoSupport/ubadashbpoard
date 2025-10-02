import React, { useEffect, useState } from "react";
// Import the Image component that handles the logos
import { Image } from "./Image"; // Assuming "./Image" is the correct path

// --- Color and Styling Constants (Themed) ---
const BANK_RED = "#DC2626";
const BANK_DARK_GRAY = "#374151";
const BANK_LIGHT_GRAY = "#f3f4f6";
const BANK_BORDER_GRAY = "#e5e7eb";

// --- Helper Functions (Modernized Color Logic) ---

// Map percentage to a visual status class for the card/text
const getStatusColor = (status, percentage) => {
	// Delivered is good when high
	if (status === "delivered") {
		if (percentage >= 95) return { bg: "bg-green-500", text: "text-white" }; // Success
		if (percentage >= 80) return { bg: "bg-yellow-500", text: "text-gray-900" }; // Warning
		return { bg: "bg-red-500", text: "text-white" }; // Critical
	}
	// Undelivered, Rejected, Expired, Pending are bad when high
	if (percentage <= 1) return { bg: "bg-gray-100", text: "text-gray-700" }; // Low/Normal (white/gray)
	if (percentage <= 5) return { bg: "bg-yellow-200", text: "text-gray-900" }; // Moderate (Yellow)
	return { bg: "bg-red-200", text: "text-red-700" }; // High/Critical (Light Red)
};

// --- Sub-Component: Status Block ---
const StatusBlock = ({ status, count, percentage, colorClasses }) => (
	<div
		className={`flex justify-between items-center px-3 py-2 rounded-md ${colorClasses.bg} transition-colors duration-200`}
		style={{
			border: `1px solid ${
				colorClasses.bg === "bg-gray-100" ? BANK_BORDER_GRAY : "transparent"
			}`,
		}}
	>
		<span className={`text-xs font-medium ${colorClasses.text}`}>{status}</span>
		<span className={`text-sm font-bold ${colorClasses.text}`}>
			{count.toLocaleString()} ({percentage}%)
		</span>
	</div>
);

// --- Sub-Component: Provider Card (Image Integration) ---
const ProviderCard = ({ item, isInternational = false, paragraph }) => {
	const providerName = isInternational
		? `International ${paragraph === "OTP" ? "OTP" : "SMS"}`
		: item.name;

	const stats = isInternational
		? item // item is the 'international' state object
		: item; // item is the provider object from computeData

	const total =
		Number(stats.delivered || 0) +
		Number(stats.undelivered || 0) +
		Number(stats.expired || 0) +
		Number(stats.rejected || 0) +
		Number(stats.pending || 0);

	const calculatePercentage = (value) => {
		if (!total || total === 0) return "0.00";
		const percentage = (Number(value) / total) * 100;
		return (Math.round(percentage * 100) / 100).toFixed(2);
	};

	// Statuses to display
	const statuses = [
		{
			name: "delivered",
			label: "Delivered",
			count: Number(stats.delivered || 0),
		},
		{
			name: "undelivered",
			label: "Undelivered",
			count: Number(stats.undelivered || 0),
		},
		{ name: "pending", label: "Pending", count: Number(stats.pending || 0) },
		{ name: "rejected", label: "Rejected", count: Number(stats.rejected || 0) },
		{ name: "expired", label: "Expired", count: Number(stats.expired || 0) },
	];

	return (
		<div
			className='bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-3'
			style={{ border: `1px solid ${BANK_BORDER_GRAY}` }}
		>
			{/* Header */}
			<div
				className='flex items-center justify-between border-b pb-3 mb-1'
				style={{ borderColor: BANK_BORDER_GRAY }}
			>
				<div
					className={`flex items-center gap-2 text-base font-bold ${
						isInternational ? "text-red-700" : "text-gray-900"
					}`}
				>
					{/* --- LOGO INTEGRATION HERE --- */}
					{!isInternational && <Image name={item.name} />}
					{providerName}
				</div>

				<div className='text-xs font-semibold text-gray-500'>
					TOTAL: {total.toLocaleString()}
				</div>
			</div>

			{/* Status Blocks */}
			<div className='space-y-2'>
				{statuses.map((s) => {
					const percentage = calculatePercentage(s.count);
					const colorClasses = getStatusColor(s.name, parseFloat(percentage));

					// For international card, if total is 0, show gray for all.
					if (isInternational && total === 0) {
						colorClasses.bg = "bg-gray-100";
						colorClasses.text = "text-gray-700";
					}

					return (
						<StatusBlock
							key={s.name}
							status={s.label}
							count={s.count}
							percentage={percentage}
							colorClasses={colorClasses}
						/>
					);
				})}
			</div>
		</div>
	);
};

// --- Main Component: Delivery ---
export const Delivery = ({ datum, paragraph, computeData, otp }) => {
	const [providerData, setProviderData] = useState([]);
	const [internationalData, setInternationalData] = useState({
		delivered: 0,
		undelivered: 0,
		expired: 0,
		rejected: 0,
		pending: 0,
	});

	// 1. Set International Data based on props
	useEffect(() => {
		const source = paragraph === "OTP" ? otp : datum;
		if (source) {
			setInternationalData({
				delivered: source.delivered || 0,
				undelivered: source.undelivered || 0,
				expired: source.expired || 0,
				rejected: source.rejected || 0,
				pending: source.pending || 0,
			});
		}
	}, [paragraph, otp, datum]);

	// 2. Filter and Set Provider Data (Handling the original component's filtering logic)
	useEffect(() => {
		if (!computeData || !Array.isArray(computeData)) {
			setProviderData([]);
			return;
		}

		let filteredArray = computeData;

		// Apply original component's filtering rules
		if (computeData.length === 8) {
			filteredArray = computeData.filter((_, index) => index % 2 === 0);
		} else if (computeData.length === 6) {
			const indicesToFilter = [1, 2, 4, 5];
			filteredArray = computeData.filter(
				(_, index) => !indicesToFilter.includes(index)
			);
		}

		setProviderData(filteredArray);
	}, [computeData]);

	return (
		<div className='p-4' style={{ backgroundColor: BANK_LIGHT_GRAY }}>
			<h2 className='text-xl font-bold mb-5' style={{ color: BANK_DARK_GRAY }}>
				{paragraph} Delivery Status Overview
			</h2>

			<div
				className='grid gap-6'
				style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
			>
				{/* Render Provider Cards */}
				{providerData.map((item, index) => (
					<ProviderCard key={index} item={item} paragraph={paragraph} />
				))}

				{/* Render International Card (last in the grid) */}
				<ProviderCard
					item={internationalData}
					isInternational={true}
					paragraph={paragraph}
				/>
			</div>
		</div>
	);
};
