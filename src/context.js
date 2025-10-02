import React, { createContext, useContext, useState } from "react";

const SessionTimeoutContext = createContext();

export function SessionTimeoutProvider({ children }) {
	const [userIsActive, setUserIsActive] = useState(true);
	const [logoutAction, setLogoutAction] = useState(false);

	const logout = () => {
		localStorage.clear();
	};

	const contextValue = {
		userIsActive,
		setUserIsActive,
	};
	// const fetchFunction = async () => {
	// 	// Implement your API fetch logic here
	// 	try {
	// 		// setIsLoading(true); // Set loading to true while fetching data
	// 		const { data } = await axios.get(
	// 			"https://ubasms.approot.ng/php/normal.php"
	// 		);
	// 		return data;
	// 	} catch (error) {
	// 		// setIsLoading(false); // Set loading to false in case of an error
	// 	}
	// };

	// const fetchData = useCallback(async () => {
	// 	const cachedData = localStorage.getItem(CACHE_KEY);
	// 	if (cachedData) {
	// 		const { data, timestamp } = JSON.parse(cachedData);
	// 		const currentTime = new Date().getTime();
	// 		if (data) {
	// 			if (currentTime - timestamp < CACHE_EXPIRATION) {
	// 				return data;
	// 			} else {
	// 				setIsLoading(true);
	// 				const freshData = await fetchFunction();
	// 				console.log(freshData);

	// 				// Store the fetched data in the cache
	// 				const dataToCache = {
	// 					data: freshData,
	// 					timestamp: new Date().getTime(),
	// 				};
	// 				localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
	// 				setIsLoading(false);
	// 				return freshData;
	// 			}
	// 		}
	// 	} else {
	// 		setIsLoading(true);
	// 		const freshData = await fetchFunction();
	// 		// console.log(freshData);

	// 		// Store the fetched data in the cache
	// 		const dataToCache = {
	// 			data: freshData,
	// 			timestamp: new Date().getTime(),
	// 		};
	// 		localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
	// 		setIsLoading(false);
	// 		return freshData;
	// 	}
	// }, [CACHE_EXPIRATION]);

	// useEffect(() => {
	// 	const fetchAndSetData = async () => {
	// 		const cachedData = await fetchData();
	// 		setData(cachedData);
	// 	};
	// 	fetchAndSetData();

	// 	const interval = setInterval(() => {
	// 		fetchAndSetData();
	// 	}, 120000);

	// 	// Clean up the interval when the component unmounts
	// 	return () => {
	// 		clearInterval(interval);
	// 	};
	// }, [fetchData]);

	return (
		<SessionTimeoutContext.Provider
			value={{
				contextValue,
				logout,
				logoutAction,
				setLogoutAction,
			}}
		>
			{children}
		</SessionTimeoutContext.Provider>
	);
}

export function useSessionTimeout() {
	return useContext(SessionTimeoutContext);
}

// select ssml_result, ssml_network_id,count(*)
//  from smpp_database where pk_ssml_log_time >'2023-10-18' and ssml_source = '0' and ssml_direction='2' group by ssml_network_id, ssml_result;

//  SELECT
//     COUNT(*) AS message_count,
//     ssml_result,
//     ssml_network_id
// FROM
//     smpp_sms_message_log
// WHERE
//     (ssml_calling_number = 'UBA' OR ssml_called_number = 'UBA')
//     AND pk_ssml_log_time >= '2023-10-17'
// GROUP BY
//     ssml_network_id, ssml_result;
