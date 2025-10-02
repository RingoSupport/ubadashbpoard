import React from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughNut = ({
	successCount,
	failureCount,
	undeliveredCount,
	expiredCount,
}) => {
	const data = {
		labels: [
			"number of failure",
			"number of expired",
			"number of undelivered",
			"number of success",
		],
		datasets: [
			{
				label: "Transaction Count",
				data: [failureCount, expiredCount, undeliveredCount, successCount],
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 159, 64, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	return (
		<Doughnut
			data={data}
			width={"250%"}
			height={"250%"}
			options={{ maintainAspectRatio: false }}
		/>
	);
};
