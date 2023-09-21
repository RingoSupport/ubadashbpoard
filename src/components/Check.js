import { useEffect, useState } from "react";
import "./App.css";
import Image from "./assets/download.png";
import { Telco } from "./components/Telco";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Login } from "./components/Login";

function App() {
	const [items, setItems] = useState([]);
	const [dlrData, setDlrData] = useState([]);
	const [isTableVisible, setTableVisible] = useState(false);
	const [isMessageVisible, setMessageVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [loginState, setLoginState] = useState(true);

	const toggleMessage = () => {
		setMessageVisible(!isMessageVisible);
	};

	const [phone, setPhone] = useState({ phone: "", from: "", to: "" });
	const toggleTable = () => {
		setTableVisible(!isTableVisible);
	};

	const checkDlr = (dlr) => {
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
					`http://34.118.77.154:9091/php/query.php?phone=${last10Characters}&to=${items.to}&from=${items.from}`
				);
				console.log(data);

				if (data.length > 0) {
					setTableVisible(true);
					setDlrData(data);
				} else {
					setDlrData([]);
					setTableVisible();
					setMessageVisible(true);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

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
				<Login loginState={loginState} setLoginState={setLoginState} />
			) : (
				<div className=''>
					<nav className='bg-blue-500 p-x-4 py-2 mb-4'>
						<div className='container mx-auto flex items-center justify-between'>
							{/* Logo on the left */}
							<div className='flex items-center space-x-2'>
								<img src={Image} alt='Logo' className='w-8 h-8' />
							</div>

							{/* Text with border in the middle */}
							<div className='border-b border-white text-white font-semibold text-lg'>
								Ringo Telco Alert Dashboard
							</div>

							{/* Form on the right */}
							<form className='flex items-center space-x-4' onSubmit={onSubmit}>
								<input
									type='search'
									placeholder='Phone'
									className='border rounded-lg px-2 py-1 focus:outline-none'
									value={phone.phone}
									onChange={(e) =>
										setPhone({ ...phone, phone: e.target.value })
									}
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
									className='bg-white focus:outline-none text-blue-500 font-semibold rounded-lg px-3 py-1'
								>
									Submit
								</button>
							</form>
						</div>
					</nav>
					<div className='App relative px-6'>
						{/* <div className='grid grid-cols-4 gap-3 px-8'>
					{details.map((item) => {
						return (
							<div key={item.id}>
								<Telco
									successCount={item.successCount}
									expiredCount={item.expiredCount}
									failureCount={item.failureCount}
									undeliveredCount={item.undeliveredCount}
									pendingCount={item.pendingCount}
									name={item.name}
									isLoading={isLoading}
								/>
							</div>
						);
					})}
				</div> */}
						<div className='grid grid-cols-4 gap-3 px-8'>
							{items.map((item) => {
								return (
									<div key={item.id}>
										<Telco
											successCount={item.delivered}
											expiredCount={item.expired}
											failureCount={item.rejected}
											undeliveredCount={item.undelivered}
											pendingCount={item.pending}
											name={item.name}
										/>
									</div>
								);
							})}
						</div>

						{isTableVisible ? (
							<section className='absolute inset-0 flex justify-center items-center'>
								<div className='relative w-1/2 h-80 overflow-y-auto'>
									<Table striped bordered hover>
										<thead>
											<tr>
												<th>#</th>
												<th>TimeStamp</th>
												<th>DLR</th>
												<th>Phone</th>
											</tr>
										</thead>
										<tbody>
											{dlrData.map((item, index) => {
												return (
													<tr>
														<td>{index}</td>
														<td>{item.pk_ssml_log_time}</td>
														<td>{checkDlr(item.ssml_result)}</td>
														<td>{item.ssml_subscriber_number}</td>
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
									Cancel
								</button>
							</section>
						) : (
							""
						)}
						{isMessageVisible && (
							<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md w-52'>
								<p className='text-center text-gray-700'>No records found.</p>
								<button
									className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md'
									onClick={toggleMessage}
								>
									Close
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default App;
