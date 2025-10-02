import axios from "axios";
import React, { useEffect } from "react";
import { testData } from "../utils/test";

export const Para = ({ setForm }) => {
	useEffect(() => {
		const getData = async () => {
			console.log("first");
			try {
				const { data } = await axios.get(
					"https://ubasms.approot.ng/php/transactional.php"
				);
				if (data) {
					testData(data);
				} else {
					console.log("first");
				}
			} catch (error) {
				console.log(error);
			}
		};
		getData();
	}, []);

	return (
		<div className='cursor-pointer' onClick={() => setForm(true)}>
			Para
		</div>
	);
};
