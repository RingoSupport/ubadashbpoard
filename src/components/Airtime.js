import React, { useCallback, useEffect, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import axios from "axios";
import { Graph } from "./Graph";
import { Image } from "./Image";

export const Airtime = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [values, setValues] = useState([]);
	const [transactions, setTransactions] = useState(
		new Date().toLocaleDateString()
	);
	const [date, setDate] = useState("");
	const [items, setItems] = useState([
		{ successful: 0, pending: 0, failed: 0 },
	]);
	const [fixTotal, setFixTotal] = useState([
		{
			totalCount: 0,
			percentageSuccessful: 0,
			percentagePending: 0,
			percentageFailed: 0,
		},
	]);

	const override = { display: "block", margin: "0 auto" };

	const calculatePercentages = (data) => {
		return data.map((item) => {
			const total = item.successful + item.pending + item.failed || 1;
			return {
				...item,
				successPercentage: ((item.successful / total) * 100).toFixed(2),
				failedPercentage: ((item.failed / total) * 100).toFixed(2),
				pendingPercentage: ((item.pending / total) * 100).toFixed(2),
			};
		});
	};

	const runCheck = (data) => {
		const aggregated = { successful: 0, pending: 0, failed: 0 };
		data.forEach((item) => {
			aggregated.successful += item.successful;
			aggregated.pending += item.pending;
			aggregated.failed += item.failed;
		});
		setItems([aggregated]);
	};

	const total = (data) => {
		let totalCount = 0,
			successfulCount = 0,
			pendingCount = 0,
			failedCount = 0;
		data.forEach((item) => {
			totalCount += item.successful + item.pending + item.failed;
			successfulCount += item.successful;
			pendingCount += item.pending;
			failedCount += item.failed;
		});
		setFixTotal([
			{
				totalCount,
				percentageSuccessful: ((successfulCount / totalCount) * 100).toFixed(2),
				percentagePending: ((pendingCount / totalCount) * 100).toFixed(2),
				percentageFailed: ((failedCount / totalCount) * 100).toFixed(2),
			},
		]);
	};

	const getData = useCallback(async () => {
		setIsLoading(true);
		try {
			const { data } = await axios.get(
				"https://ubasms.approot.ng/php/airtime.php"
			);
			setIsLoading(false);
			const percentages = calculatePercentages(data);
			setValues(percentages);
			total(data);
			runCheck(data);
			setTransactions(new Date().toLocaleDateString());
		} catch (error) {
			setIsLoading(false);
			console.error(error);
		}
	}, []);

	useEffect(() => {
		getData();
		const interval = setInterval(getData, 120000);
		return () => clearInterval(interval);
	}, [getData]);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (new Date(date) > new Date()) {
			alert("Please select a date less than today");
			return;
		}
		const from = `${date} 00:00:00`;
		const to = `${date} 23:59:59`;
		try {
			const { data } = await axios.post(
				`https://ubasms.approot.ng/php/airtimeSearch.php?from=${from}&to=${to}`
			);
			const percentages = calculatePercentages(data);
			setValues(percentages);
			total(data);
			runCheck(data);
			setTransactions(date);
		} catch (error) {
			alert("An error occurred, please retry");
		}
	};

	return (
		<>
			{isLoading ? (
				<div className='flex justify-center items-center flex-col h-screen'>
					<FadeLoader loading={isLoading} cssOverride={override} size={300} />
				</div>
			) : (
				<div className='container mx-auto p-4'>
					<header className='bg-red-900 text-white p-4 rounded-md mb-4 flex flex-col lg:flex-row justify-between items-center shadow-md'>
						<h2 className='text-2xl font-bold mb-2 lg:mb-0'>
							Filter Transactions
						</h2>
						<form onSubmit={onSubmit} className='flex items-center space-x-2'>
							<input
								type='date'
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className='px-3 py-2 rounded-md text-black'
								required
							/>
							<button className='bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md'>
								Submit
							</button>
						</form>
					</header>

					<h3 className='text-center font-semibold text-lg mb-4'>
						Transactions for {transactions}
					</h3>

					<div className='grid lg:grid-cols-4 md:grid-cols-2 gap-4 mb-6'>
						{values.length > 0 ? (
							values
								.sort((a, b) => {
									const order = ["MTN", "9MOBILE", "AIRTEL", "GLO"];
									return order.indexOf(a.network) - order.indexOf(b.network);
								})
								.map((item, idx) => (
									<div
										key={idx}
										className='bg-white rounded-xl shadow-lg p-4 hover:scale-105 transform transition duration-300'
									>
										<div className='flex justify-center mb-2'>
											<Image name={item.network} />
										</div>
										<h4 className='text-center font-semibold mb-3'>
											{item.network}
										</h4>

										<div className='space-y-3'>
											<div className='flex justify-between items-center'>
												<span className='font-medium text-sm text-green-700'>
													Successful
												</span>
												<span className='font-bold text-[11px] text-green-900'>
													{item.successful} ({item.successPercentage}%)
												</span>
											</div>
											<div className='w-full bg-green-200 rounded-full h-3'>
												<div
													className='bg-green-600 h-3 text-sm rounded-full'
													style={{ width: `${item.successPercentage}%` }}
												/>
											</div>

											<div className='flex justify-between items-center'>
												<span className='font-medium text-sm text-red-700'>
													Failed
												</span>
												<span className='font-bold text-sm text-red-900'>
													{item.failed} ({item.failedPercentage}%)
												</span>
											</div>
											<div className='w-full bg-red-200 rounded-full h-3'>
												<div
													className='bg-red-600 h-3  text-sm rounded-full'
													style={{ width: `${item.failedPercentage}%` }}
												/>
											</div>

											<div className='flex justify-between items-center'>
												<span className='font-medium text-sm text-yellow-700'>
													Pending
												</span>
												<span className='font-bold text-sm text-yellow-900'>
													{item.pending} ({item.pendingPercentage}%)
												</span>
											</div>
											<div className='w-full bg-yellow-200 rounded-full h-3'>
												<div
													className='bg-yellow-500 h-3  text-sm rounded-full'
													style={{ width: `${item.pendingPercentage}%` }}
												/>
											</div>
										</div>
									</div>
								))
						) : (
							<p className='col-span-full text-center text-red-600 font-semibold'>
								No data available
							</p>
						)}
					</div>

					<div className='lg:flex gap-4'>
						<div className='bg-white rounded-xl shadow-lg p-6 w-full lg:w-1/3 mb-4 lg:mb-0'>
							<h4 className='font-bold mb-4 text-center text-lg'>
								Airtime Summary
							</h4>
							<div className='space-y-2'>
								<p className='flex justify-between'>
									<span>Total Transactions:</span>
									<span>{fixTotal[0].totalCount}</span>
								</p>
								<p className='flex justify-between'>
									<span>Success Rate:</span>
									<span className='text-green-700 font-semibold'>
										{fixTotal[0].percentageSuccessful}%
									</span>
								</p>
								<p className='flex justify-between'>
									<span>Failure Rate:</span>
									<span className='text-red-700 font-semibold'>
										{fixTotal[0].percentageFailed}%
									</span>
								</p>
								<p className='flex justify-between'>
									<span>Pending Rate:</span>
									<span className='text-yellow-700 font-semibold'>
										{fixTotal[0].percentagePending}%
									</span>
								</p>
							</div>
						</div>

						<div className='bg-white rounded-xl shadow-lg p-6 flex-1'>
							<Graph
								pending={items[0].pending}
								success={items[0].successful}
								failed={items[0].failed}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
