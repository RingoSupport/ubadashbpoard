export const network = (item) => {
	if (item === "1") {
		return "MTN";
	} else if (item === "2") {
		return "Airtel";
	} else if (item === "3") {
		return "Glo";
	} else {
		return "9mobile";
	}
};
