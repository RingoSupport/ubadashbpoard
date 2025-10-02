export function mergeLogTimes(data) {
	const mergedData = {};

	// Iterate through the data array

	data.forEach((item) => {
		const messageId = item.ssml_smpp_message_id;

		if (!mergedData[messageId]) {
			mergedData[messageId] = { ...item };
		} else {
			if (item.ssml_result === "0") {
				console.log("first");
				const content = item.messageContent;
				// If the result is '0', merge the pk_ssml_log_time
				mergedData[messageId].pk_ssml_log_time += ` ${item.pk_ssml_log_time}`;
				mergedData[messageId].messageContent
					? (mergedData[messageId].messageContent = content)
					: (mergedData[messageId].messageContent = "");
			} else {
				// If the result is not '0', update other properties as needed
				// You can customize this part based on your requirements
				const items = mergedData[messageId].ssml_calling_number;
				const data = item.ssml_calling_number;

				const dlr = item.messageDlr;
				mergedData[messageId].pk_ssml_log_time += ` ${item.pk_ssml_log_time}`;
				mergedData[messageId].ssml_result = item.ssml_result;
				mergedData[messageId].ssml_called_number = items;
				mergedData[messageId].ssml_calling_number = data;

				mergedData[messageId].messageDlr
					? (mergedData[messageId].messageDlr = dlr)
					: (mergedData[messageId].messageDlr = "");
				// Add more properties here
			}
		}
	});

	// Convert the mergedData object back to an array
	const mergedArray = Object.values(mergedData);

	return mergedArray;

	// const mergedData = {};

	// data.forEach((item) => {
	// 	const id = item.ssml_smpp_message_id;
	// 	console.log(item.ssml_result);
	// 	if (!mergedData[id]) {
	// 		mergedData[id] = { ...item };
	// 	} else if (item.ssml_result === "0") {
	// 		console.log(mergedData[id].ssml_resul);
	// 		console.log(item.ssml_result);
	// 		mergedData[id].pk_ssml_log_time += ` ${item.pk_ssml_log_time}`;
	// 		mergedData[id].ssml_result = item.ssml_result;
	// 	}
	// });

	// return Object.values(mergedData);
}
