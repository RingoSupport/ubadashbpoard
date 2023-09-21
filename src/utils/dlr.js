export const checkDlr = (dlr) => {
	if (dlr === "1") {
		return "ACK";
	} else if (dlr === "2") {
		return "DLIVRD";
	} else if (dlr === "3") {
		return "EXPIRD";
	} else if (dlr === "5") {
		return "UNDLIVRD";
	} else if (dlr === "8") {
		return "REJECTD";
	}
};
