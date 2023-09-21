import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Image from "./assets/download.png";
import { Telco } from "./components/Telco";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import HeaderForm from "./components/HeaderForm";
import { Transactions } from "./components/Transactions";
import { checkDlr } from "./utils/dlr";

function App() {
	const [items, setItems] = useState([]);
	const [dlrData, setDlrData] = useState([]);
	const [isTableVisible, setTableVisible] = useState(false);
	const [isMessageVisible, setMessageVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [loginState, setLoginState] = useState(true);
	const [element, setElement] = useState("Dashboard");
	const [count, setCount] = useState({ total: 0, failure: "", success: "" });

	const toggleMessage = () => {
		setMessageVisible(!isMessageVisible);
	};

	const toggleTable = () => {
		setTableVisible(!isTableVisible);
	};

	const countData = (array) => {
		let totalSuccessCount = 0;
		let totalFailureCount = 0;
		let totalUndeliveredCount = 0;
		let totalExpiredCount = 0;
		let totalPendingCount = 0;

		// Iterate through the details array and calculate the totals
		array.forEach((item) => {
			totalSuccessCount += item.delivered;
			totalFailureCount += item.rejected;
			totalUndeliveredCount += item.undelivered;
			totalExpiredCount += item.expired;
			totalPendingCount += item.pending;
		});

		// Calculate the total count of all statuses
		totalSuccessCount =
			totalSuccessCount === 0 ? (totalSuccessCount = 1000) : totalSuccessCount;
		totalFailureCount =
			totalFailureCount === 0 ? (totalFailureCount = 1000) : totalFailureCount;
		const totalCount =
			totalSuccessCount +
			totalFailureCount +
			totalUndeliveredCount +
			totalExpiredCount +
			totalPendingCount;

		// Calculate the percentage of success and failure
		const successPercentage = (totalSuccessCount / totalCount) * 100;
		const failurePercentage = (totalFailureCount / totalCount) * 100;

		setCount({
			total: totalCount,
			success: successPercentage,
			failure: failurePercentage,
		});
	};
	const closeSidemenu = useCallback(() => {
		if (isTableVisible) {
			setTableVisible(false);
			console.log("first");
			console.log(isTableVisible);
		} else if (isMessageVisible) {
			setMessageVisible(false);
			console.log("first waiting");
		}
		return;
	}, [isMessageVisible, isTableVisible]);

	useEffect(() => {
		document.body.addEventListener("click", closeSidemenu);

		return function cleanup() {
			document.body.removeEventListener("click", closeSidemenu);
		};
	}, [closeSidemenu]);

	const getItems = async () => {
		const checkLocalstorage = localStorage.getItem("token");
		if (!checkLocalstorage) {
			setLoginState(true);
		} else {
			// navigation("/login");
			try {
				setIsLoading(true); // Set loading to true while fetching data
				const { data } = await axios.get(
					"http://34.118.77.154:9091/php/check.php"
				);
				countData(data);
				// console.log(data);
				setItems(data);
				setIsLoading(false); // Set loading back to false after data is fetched
			} catch (error) {
				console.log(error);
				setIsLoading(false); // Set loading to false in case of an error
			}
		}
	};

	useEffect(() => {
		// Call getItems initially when the component mounts
		getItems();

		// Set up an interval to call getItems every five seconds
		const interval = setInterval(() => {
			getItems();
		}, 5000);

		// Clean up the interval when the component unmounts
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<>
			{loginState ? (
				<Login setLoginState={setLoginState} />
			) : (
				<div className='flex h-screen bg-gray-100'>
					<Sidebar setElement={setElement} logo={Image} />
					<main className='flex-1 flex relative flex-col overflow-auto'>
						{/* Header */}

						{/* Content */}
						{element === "Dashboard" && (
							<>
								<header className='bg-white shadow'>
									<div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
										<HeaderForm
											setMessageVisible={setMessageVisible}
											setDlrData={setDlrData}
											setTableVisible={setTableVisible}
										/>
									</div>
								</header>
								<div className='flex-1 bg-white overflow-x-hidden overflow-y-auto p-4'>
									{/* Add your main content here */}
									<div className='flex items-center justify-center'>
										<h5 className='mx-4'> Total Count {count.total}</h5>
										<h5 className='mx-4'>
											Success Percentage {Number(count.success).toFixed(2)}%
										</h5>
										<h5 className='mx-4'>
											Failure Percentage {Number(count.failure).toFixed(2)}%{" "}
										</h5>
									</div>
									<div className='grid grid-cols-4 gap-3 px-8'>
										{items.map((item, index) => {
											return (
												<div key={index}>
													<Telco
														successCount={
															item.delivered > 0
																? item.delivered
																: item.delivered + 1000
														}
														expiredCount={
															item.expired > 0
																? item.expired
																: item.expired + 1000
														}
														failureCount={
															item.rejected > 0
																? item.rejected
																: item.rejected + 1000
														}
														undeliveredCount={
															item.undelivered > 0
																? item.undelivered
																: item.undelivered + 1000
														}
														pendingCount={
															item.pending > 0
																? item.pending
																: item.pending + 1000
														}
														name={item.name}
													/>
												</div>
											);
										})}
									</div>
								</div>
								{isTableVisible ? (
									<section className='absolute inset-0 flex justify-center items-center'>
										<div className='relative w-[80%] h-[70%] overflow-y-auto'>
											<Table striped bordered hover>
												<thead>
													<tr>
														<th className='small-column'>#</th>
														<th className='small-column'>TimeStamp</th>
														<th className='small-column'>DLR</th>
														<th className='small-column'>Phone</th>
														<th className='small-column'>Message</th>
														<th className='small-column'>Unique ID</th>
													</tr>
												</thead>
												<tbody>
													{dlrData.map((item, index) => {
														return (
															<tr key={index}>
																<td>{index}</td>
																<td className='small-column'>
																	{item.pk_ssml_log_time}
																</td>
																<td className='small-column'>
																	{checkDlr(item.ssml_result)}
																</td>
																<td className='small-column'>
																	{item.ssml_subscriber_number}
																</td>
																<td className='small-column'>
																	{item.ssml_content}
																</td>
																<td className='small-column'>
																	{item.ssml_smpp_message_id}
																</td>
															</tr>
														);
													})}
												</tbody>
											</Table>
										</div>
										<button
											className=' mt-[-400px] bg-red-500 text-white px-4 py-2 rounded-md'
											onClick={toggleTable}
										>
											<i className='fa-solid fa-xmark'></i>
										</button>
									</section>
								) : (
									""
								)}
								{isMessageVisible && (
									<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md w-52'>
										<p className='text-center text-gray-700'>
											No records found.
										</p>
										<button
											className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md'
											onClick={toggleMessage}
										>
											Close
										</button>
									</div>
								)}
							</>
						)}
						{element === "Transactions" && (
							<>
								{" "}
								<Transactions />
							</>
						)}
					</main>
				</div>
			)}
		</>
	);
}

export default App;
