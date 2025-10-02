import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFetch(url, auto = true, deps = []) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(auto);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			const res = await axios.get(url);
			setData(res.data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		if (auto) fetchData();
	}, [fetchData, ...deps]);

	return { data, loading, error, refetch: fetchData };
}
