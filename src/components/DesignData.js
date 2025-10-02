import React, { useEffect, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import { DeliveryData } from "./DeliveryData";
// import { DateTime } from "luxon";

export const DesignData = ({ items, loading }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	// State to hold the data and percentages
	const [totalValue, setTotalValue] = useState();
	const [data, setData] = useState([
		{ delivered: 0, deliveredPercentage: "0%" },
		{ undelivered: 0, undeliveredPercentage: "0%" },
		{ enroute: 0, enroutePercentage: "0%" },
		{ expired: 0, expiredPercentage: "0%" },
		{ unknown: 0, unknownPercentage: "0%" },
	]);

	const [totalSms, setTotalSms] = useState(0);

	const paragraphs = ["All Messages", "Transactional", "Non Transactional"];

	const handleParagraphClick = (index) => {
		setActiveIndex(index);
	};
	const override = {
		display: "block",
		margin: "0 auto",
	};

	useEffect(() => {
		const total = {
			delivered: 0,
			undelivered: 0,
			pending: 0,
			expired: 0,
			unknown: 0,
		};
		if (items.length === 8) {
			const filteredArray = items.filter((item, index) => index % 2 === 0);
			filteredArray.forEach((networkData) => {
				total.delivered += Number(networkData.delivered);
				total.undelivered += Number(networkData.undelivered);
				total.pending += Number(networkData.pending);
				total.expired += Number(networkData.expired);
				total.unknown += Number(networkData.issues);
			});
			let sms = 0;

			filteredArray.forEach((item) => {
				sms += Number(item.ack);
				sms += Number(item.issues);
				sms += Number(item.pending);
				sms += Number(item.expired);
			});
			setTotalSms(sms);
			setTotalValue(Object.values(total).reduce((acc, val) => acc + val, 0));
			const updatedData = [
				{
					delivered: total.delivered,
					deliveredPercentage: `${(
						(total.delivered /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					undelivered: total.undelivered,
					undeliveredPercentage: `${(
						(total.undelivered /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					enroute: total.pending,
					enroutePercentage: `${(
						(total.pending /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(4)}%`,
				},
				{
					expired: total.expired,
					expiredPercentage: `${(
						(total.expired /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					unknown: total.unknown,
					unknownPercentage: `${(
						(total.unknown /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(4)}%`,
				},
			];

			setData(updatedData);
		} else if (items.length === 6) {
			// Define the indices to filter out (1, 2, 4, and 5)
			const indicesToFilter = [1, 2, 4, 5];

			// Use the filter method to filter out items at specific indices
			const filteredArray = items.filter(
				(item, index) => !indicesToFilter.includes(index)
			);
			filteredArray.forEach((networkData) => {
				total.delivered += Number(networkData.delivered);
				total.undelivered += Number(networkData.undelivered);
				total.pending += Number(networkData.pending);
				total.expired += Number(networkData.expired);
				total.unknown += Number(networkData.issues);
			});
			let sms = 0;

			filteredArray.forEach((item) => {
				sms += Number(item.ack);
				sms += Number(item.issues);
				sms += Number(item.pending);
				sms += Number(item.expired);
			});
			setTotalSms(sms);
			setTotalValue(Object.values(total).reduce((acc, val) => acc + val, 0));
			const updatedData = [
				{
					delivered: total.delivered,
					deliveredPercentage: `${(
						(total.delivered /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					undelivered: total.undelivered,
					undeliveredPercentage: `${(
						(total.undelivered /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					enroute: total.pending,
					enroutePercentage: `${(
						(total.pending /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(4)}%`,
				},
				{
					expired: total.expired,
					expiredPercentage: `${(
						(total.expired /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					unknown: total.unknown,
					unknownPercentage: `${(
						(total.unknown /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(4)}%`,
				},
			];

			setData(updatedData);
		} else {
			items.forEach((networkData) => {
				total.delivered += Number(networkData.delivered);
				total.undelivered += Number(networkData.undelivered);
				total.pending += Number(networkData.pending);
				total.expired += Number(networkData.expired);
				total.unknown += Number(networkData.issues);
			});
			let sms = 0;

			items.forEach((item) => {
				sms += Number(item.ack);
				sms += Number(item.issues);
				sms += Number(item.pending);
				sms += Number(item.expired);
			});
			setTotalSms(sms);
			setTotalValue(Object.values(total).reduce((acc, val) => acc + val, 0));
			const updatedData = [
				{
					delivered: total.delivered,
					deliveredPercentage: `${(
						(total.delivered /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					undelivered: total.undelivered,
					undeliveredPercentage: `${(
						(total.undelivered /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					enroute: total.pending,
					enroutePercentage: `${(
						(total.pending /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(4)}%`,
				},
				{
					expired: total.expired,
					expiredPercentage: `${(
						(total.expired /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(2)}%`,
				},
				{
					unknown: total.unknown,
					unknownPercentage: `${(
						(total.unknown /
							(total.delivered +
								total.undelivered +
								total.pending +
								total.expired +
								total.unknown)) *
						100
					).toFixed(4)}%`,
				},
			];

			setData(updatedData);
		}
	}, [items]);
	return (
		<div className=''>
			{loading ? (
				<>
					<div className='flex justify-center items-center flex-col h-screen'>
						<FadeLoader
							loading={loading}
							cssOverride={override}
							size={300}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					</div>
				</>
			) : (
				<main>
					<section className='mb-6 '>
						<div className='lg:flex hidden  border-b border-solid border-gray-300 justify-normal h-8'>
							{paragraphs.map((paragraph, index) => (
								<p
									key={index}
									className={`cursor-pointer pb-[30.2px] mx-2 ${
										index === activeIndex
											? "border-green-500 border-b-4 border-solid rounded-sm"
											: ""
									}`}
									onClick={() => handleParagraphClick(index)}
								>
									{paragraph}
								</p>
							))}
						</div>
						<div className='flex lg:hidden  border-b border-solid border-gray-300 justify-normal h-8'>
							{paragraphs.map((paragraph, index) => (
								<p
									key={index}
									className={`cursor-pointer pb-[30.2px] lg:text-md text-xs mx-2 ${
										index === activeIndex
											? "border-green-500 border-b-4 border-solid rounded-sm"
											: ""
									}`}
									onClick={() => handleParagraphClick(index)}
								>
									{paragraph}
								</p>
							))}
						</div>
					</section>
					<section className='border mb-6 border-solid border-gray-400 rounded-sm p-4'>
						<div className='flex justify-between items-center'>
							<div>
								<p className='font-bold'>Delivery Ratio</p>
								<p className='text-gray-400'>Total SMS Sent - {totalSms} </p>
							</div>
							<div>
								<p>Traffic Volume</p>
								<span className='text-gray-400'>
									PendingDLR - {Math.abs(Number(totalSms) - Number(totalValue))}
								</span>
							</div>
						</div>
						<div className='w-full h-6 flex'>
							{data.map((categoryData) => {
								const category = Object.keys(categoryData)[0]; // Get the category name (e.g., "delivered")
								const value = categoryData[category]; // Get the category value (e.g., total delivered)

								return (
									<div
										key={category}
										className={`flex-grow ${
											category === "delivered"
												? "bg-green-800"
												: category === "undelivered"
												? "bg-blue-500"
												: category === "expired"
												? "bg-yellow-500"
												: category === "unknown"
												? "bg-[#654321CC]"
												: "bg-red-500"
										} rounded-sm mx-[1.5px]`}
										style={{
											width: `${
												(value === 0 && totalValue === 0
													? `25`
													: value / totalValue) * 100
											}%`,
										}}
									></div>
								);
							})}
						</div>
						<div className='lg:flex grid grid-cols-2 justify-between items-center my-4'>
							{data.map((item, index) => {
								return (
									<div key={index}>
										<p className='uppercase my-0 lg:text-sm text-xs'>
											{Object.keys(item)[0].toLowerCase() === "pending"
												? "ENROUTE"
												: Object.keys(item)[0]}{" "}
											: {item[Object.keys(item)[0] + "Percentage"]}{" "}
										</p>
										<p className='flex  items-center'>
											<span
												className={`inline-block h-4 w-4 rounded-sm ${
													Object.keys(item)[0] === "delivered"
														? "bg-green-700"
														: Object.keys(item)[0] === "undelivered"
														? "bg-blue-500"
														: Object.keys(item)[0] === "expired"
														? "bg-yellow-500"
														: Object.keys(item)[0] === "unknown"
														? "bg-[#654321CC]"
														: "bg-red-500"
												}`}
											></span>
											<span className='inline-block justify-center text-center ml-2 text-sm'>
												{item[Object.keys(item)[0]]}
												{/* {item[Object.keys(item)[0] + "Percentage"]} */}
											</span>
										</p>
									</div>
								);
							})}
						</div>
					</section>

					<section className='my-6'>
						<div className='flex justify-between my-4 items-center'>
							<p className='my-0'>Delivery Rate By Networks</p>
							<p className='my-0'>Chart View</p>
						</div>
						<DeliveryData data={items} />
					</section>
				</main>
			)}
		</div>
	);
};
