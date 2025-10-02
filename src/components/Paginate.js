import React, { useState, useEffect } from "react";
// import { getFromCacheOrFetch } from "./CacheService";
import { getFromCacheOrFetch } from "../utils/cachedService";
import axios from "axios";

export const Paginate = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		// Implement your API fetch logic here
		try {
			// setIsLoading(true); // Set loading to true while fetching data
			const { data } = await axios.get(
				"https://ubasms.approot.ng/php/check.php"
			);
			// countData(data);
			return data;
			// setData(data);
			// setIsLoading(false); // Set loading back to false after data is fetched
		} catch (error) {
			// setIsLoading(false); // Set loading to false in case of an error
		}
	};

	const changeLoading = (boolean) => {
		setLoading(boolean);
	};

	useEffect(() => {
		const fetchAndSetData = async () => {
			const cachedData = await getFromCacheOrFetch(fetchData, changeLoading);
			setData(cachedData);
		};
		fetchAndSetData();

		const interval = setInterval(() => {
			fetchAndSetData();
		}, 200000);

		// Clean up the interval when the component unmounts
		return () => {
			clearInterval(interval);
		};
	}, []);

	return <div>{loading ? "Loading" : JSON.stringify(data)}</div>;
};
