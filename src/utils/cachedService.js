// CacheService.js
const CACHE_KEY = "cachedData";
const CACHE_EXPIRATION = 60 * 1000; // 1 minute

export const getFromCacheOrFetch = async (fetchFunction, setLoading) => {
	const cachedData = localStorage.getItem(CACHE_KEY);
	if (cachedData) {
		const { data, timestamp } = JSON.parse(cachedData);
		// console.log(data, timestamp);
		if (data) {
			const currentTime = new Date().getTime();
			// console.log(currentTime, timestamp, currentTime - timestamp);

			if (currentTime - timestamp < CACHE_EXPIRATION) {
				return data;
			} else {
				setLoading(true);
				const freshData = await fetchFunction();
				// console.log(freshData);

				// Store the fetched data in the cache
				const dataToCache = {
					data: freshData,
					timestamp: new Date().getTime(),
				};
				localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
				setLoading(false);
				return freshData;
			}
		} else {
			console.log("first");
			setLoading(true);
			const freshData = await fetchFunction();
			// console.log(freshData);

			// Store the fetched data in the cache
			const dataToCache = {
				data: freshData,
				timestamp: new Date().getTime(),
			};
			localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
			setLoading(false);
			return freshData;
		}
	}
};
