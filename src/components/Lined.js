/* eslint-disable array-callback-return */
import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const Lined = ({ check }) => {
	const labels = ["Delivered", "Expired", "Pending", "Undelivered"];

	const filterArray = (name) => {
		const data = check.filter((item) => item.name.toLowerCase() === name);
		const finalData = [];
		data.map((item) => {
			finalData.push(item.delivered);
			finalData.push(item.expired);
			finalData.push(item.pending);
			finalData.push(item.undelivered);
		});
		return finalData;
	};

	const datasets = {
		labels,
		datasets: [
			{
				label: "MTN",
				data: filterArray("mtn"),
				backgroundColor: "rgba(255, 255, 0, 1)",
			},
			{
				label: "Airtel",
				data: filterArray("airtel"),
				backgroundColor: "red",
			},
			{
				label: "9mobile",
				data: filterArray("9mobile"),
				backgroundColor: "rgba(0, 100, 0, 1)",
			},
			{
				label: "Glo",
				data: filterArray("glo"),
				backgroundColor: "Glo",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
		},
		title: {
			display: true,
			text: "Bar Chart For Telcos",
		},
	};
	return (
		<div>
			<div>
				<Bar data={datasets} options={options} />
			</div>
		</div>
	);
};
