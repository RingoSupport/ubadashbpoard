import axios from "axios";
import React, { useState } from "react";

function HeaderForm({
	dlrData,
	isTableVisible,
	isMessageVisible,
	setMessageVisible,
	setDlrData,
	setTableVisible,
}) {
	const [phone, setPhone] = useState({ phone: "", from: "", to: "" });

	const onSubmit = async (e) => {
		e.preventDefault();
		const items = {
			phone: phone.phone,
			to: phone.to ? `${phone.to} 11:59:59` : "",
			from: phone.from ? `${phone.from} 00:00:00 ` : "",
		};

		if (phone.to && phone.from && phone.to < phone.from) {
			alert("To date must be greater than or equal to from date");
		} else {
			const last10Characters = items.phone.slice(-10);

			try {
				const { data } = await axios.get(
					`https://ubasms.approot.ng/php/query.php?phone=${last10Characters}&to=${items.to}&from=${items.from}`
				);

				if (data.length > 0) {
					setTableVisible(true);
					setDlrData(data);
				} else {
					setDlrData([]);
					setTableVisible(false);
					setMessageVisible(true);
				}
			} catch (error) {
				alert("An Error Cooured");
			}
		}
	};
	return (
		<div className='bg-white p-4 shadow-md rounded-md mb-4 '>
			<h4 className='text-center mb-4'>Transaction Search</h4>
			<form
				className='flex space-x-2 items-center justify-center'
				onSubmit={onSubmit}
			>
				<input
					type='search'
					placeholder='Phone'
					className='border rounded-lg px-2 py-1 focus:outline-none'
					value={phone.phone}
					onChange={(e) => setPhone({ ...phone, phone: e.target.value })}
				/>
				<input
					type='date'
					placeholder='From'
					className='border rounded-lg px-2 py-1 focus:outline-none'
					value={phone.from}
					onChange={(e) => setPhone({ ...phone, from: e.target.value })}
				/>
				<input
					type='date'
					placeholder='To'
					className='border rounded-lg px-2 py-1 focus:outline-none'
					value={phone.to}
					onChange={(e) => setPhone({ ...phone, to: e.target.value })}
				/>
				<button
					type='submit'
					className=' focus:outline-none font-semibold rounded-lg px-3 py-1 bg-blue-500 text-white hover:bg-blue-600'
				>
					Submit
				</button>
			</form>
		</div>
	);
}

export default HeaderForm;
