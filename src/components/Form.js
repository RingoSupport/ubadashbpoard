import React from "react";

export const Form = ({ showPara, setForm }) => {
	const onSubmit = (e) => {
		e.preventDefault();
		showPara();
		setForm(false);
	};
	return (
		<form action='' onSubmit={onSubmit}>
			<select name='' id=''>
				<option value='davinci'>davinci</option>
				<option value='davinci'>davinci</option>
				<option value='davinci'>davinci</option>
				<option value='davinci'>davinci</option>
			</select>
			<button>submit</button>
		</form>
	);
};
