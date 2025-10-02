export const computeDashboardData = (items) => {
	if (!items || items.length === 0) {
		return {
			totalSms: 0,
			metrics: [
				{ name: "Delivered", value: 0, percentage: "0.00%" },
				{ name: "Undelivered", value: 0, percentage: "0.00%" },
				{ name: "Pending / Enroute", value: 0, percentage: "0.00%" },
				{ name: "Expired", value: 0, percentage: "0.00%" },
				{ name: "Unknown", value: 0, percentage: "0.00%" },
			],
		};
	}

	const totals = items.reduce(
		(acc, networkData) => {
			acc.delivered += Number(networkData.delivered || 0);
			acc.undelivered += Number(networkData.undelivered || 0);
			acc.pending += Number(networkData.pending || 0);
			acc.expired += Number(networkData.expired || 0);
			acc.unknown +=
				Number(networkData.issues || 0) + Number(networkData.rejected || 0);
			acc.totalSent += Number(networkData.ack || networkData.total_count || 0);
			return acc;
		},
		{
			delivered: 0,
			undelivered: 0,
			pending: 0,
			expired: 0,
			unknown: 0,
			totalSent: 0,
		}
	);

	const totalSent = totals.totalSent;

	const getPercentage = (value) =>
		totalSent > 0 ? `${((value / totalSent) * 100).toFixed(2)}%` : "0.00%";

	const metrics = [
		{
			name: "Delivered",
			value: totals.delivered,
			percentage: getPercentage(totals.delivered),
		},
		{
			name: "Undelivered",
			value: totals.undelivered,
			percentage: getPercentage(totals.undelivered),
		},
		{
			name: "Pending / Enroute",
			value: totals.pending,
			percentage: getPercentage(totals.pending),
		},
		{
			name: "Expired",
			value: totals.expired,
			percentage: getPercentage(totals.expired),
		},
		{
			name: "Unknown",
			value: totals.unknown,
			percentage: getPercentage(totals.unknown),
		},
	];

	return { totalSms: totalSent, metrics };
};
