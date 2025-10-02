import React from "react";

export const Button = ({ setNumber }) => {
	const onClick = (e) => {
		e.preventDefault();

		setNumber((prev) => prev + 1);
	};

	return (
		<div>
			<button onClick={onClick}>Increase</button>
		</div>
	);
};
