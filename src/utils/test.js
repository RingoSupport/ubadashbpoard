export const testData = (data) => {
	const mergedData = {};

	data.forEach((entry) => {
		const messageID = entry.ssml_smpp_message_id;
		const logTime = new Date(entry.pk_ssml_log_time);

		if (mergedData[messageID]) {
			const timeDifference = (logTime - mergedData[messageID].logTime) / 1000; // Convert to seconds
			mergedData[messageID].timeDifference = timeDifference;
		} else {
			mergedData[messageID] = {
				logTime,
				timeDifference: 0, // Initialize with 0 seconds for the first entry
			};
		}
	});

	console.log("Merged data with time differences:");
	const timeIntervals = {
		"12s": 0,
		"30s": 0,
		"1m": 0,
		"2m": 0,
		"3m": 0,
		"4m": 0,
		"5m": 0,
		"10m": 0,
		"30m": 0,
		"60m": 0,
		"60+m": 0,
	};

	for (const messageID in mergedData) {
		const entry = mergedData[messageID];
		const timeDifference = entry.timeDifference;

		if (timeDifference > 60 * 60) {
			timeIntervals["60+m"]++;
		} else if (timeDifference > 30 * 60) {
			timeIntervals["60m"]++;
		} else if (timeDifference > 10 * 60) {
			timeIntervals["30m"]++;
		} else if (timeDifference > 5 * 60) {
			timeIntervals["10m"]++;
		} else if (timeDifference > 1 * 60) {
			timeIntervals["5m"]++;
		} else if (timeDifference > 30) {
			timeIntervals["4m"]++;
		} else if (timeDifference > 12) {
			timeIntervals["3m"]++;
		} else if (timeDifference > 30) {
			timeIntervals["2m"]++;
		} else if (timeDifference > 12) {
			timeIntervals["1m"]++;
		} else if (timeDifference > 30) {
			timeIntervals["30s"]++;
		} else if (timeDifference > 12) {
			timeIntervals["12s"]++;
		}
	}

	console.log("Counts in time intervals:");
	for (const interval in timeIntervals) {
		console.log(`Time Interval ${interval}: ${timeIntervals[interval]}`);
	}

	const resultCounts = {};
	const resultDescriptions = {
		1: "[ENROUTE]",
		2: "[DELIVERED]",
		3: "[EXPIRED]",
		5: "[UNDELIVERABLE]",
		7: "[UNKNOWN]",
	};

	data.forEach((entry) => {
		const result = entry.ssml_result;

		if (result !== "0" && resultDescriptions[result]) {
			if (!resultCounts[result]) {
				resultCounts[result] = 1;
			} else {
				resultCounts[result]++;
			}
		}
	});

	const resultCountsWithDescriptions = {};
	for (const result in resultCounts) {
		resultCountsWithDescriptions[resultDescriptions[result]] =
			resultCounts[result];
	}

	let countZero = 0;
	let countNonZero = 0;

	data.forEach((entry) => {
		const result = entry.ssml_result;
		if (result === "0") {
			countZero++;
		} else {
			countNonZero++;
		}
	});

	const result = countNonZero - countZero;

	console.log("Count of ssml_result '0':", countZero);
	console.log("Count of ssml_result not '0':", countNonZero);
	console.log("Subtraction result:", result);
	console.log([resultCountsWithDescriptions]);
};
