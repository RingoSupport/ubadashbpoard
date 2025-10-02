import React from "react";
import { motion } from "framer-motion";
import { FadeLoader } from "react-spinners";

const Design = ({ data, totalSms, totalValue, loading }) => {
	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<FadeLoader color='#3b82f6' />
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6'
		>
			{/* Header */}
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h2 className='text-xl font-semibold'>Delivery Ratio</h2>
					<p className='text-sm text-gray-500'>Total SMS Sent – {totalSms}</p>
				</div>
				<div className='text-right'>
					<p className='font-medium'>Traffic Volume</p>
					<span className='text-sm text-gray-500'>
						Pending DLR – {Math.abs(totalSms - totalValue)}
					</span>
				</div>
			</div>

			{/* Animated Progress Bar */}
			<div className='w-full h-5 flex overflow-hidden rounded-lg mb-6'>
				{data.map((categoryData) => {
					const category = Object.keys(categoryData)[0];
					const value = categoryData[category];

					const colors = {
						delivered: "bg-emerald-500",
						undelivered: "bg-rose-500",
						expired: "bg-yellow-400",
						unknown: "bg-gray-500",
						enroute: "bg-blue-500",
					};

					return (
						<motion.div
							key={category}
							className={`${colors[category] || "bg-gray-400"}`}
							initial={{ width: 0 }}
							animate={{
								width: `$${
									value === 0 && totalValue === 0
										? 25
										: (value / totalValue) * 100
								}%`,
							}}
							transition={{ duration: 0.8 }}
						/>
					);
				})}
			</div>

			{/* Legend */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
				{data.map((item, index) => {
					const label = Object.keys(item)[0];

					const colors = {
						delivered: "bg-emerald-500",
						undelivered: "bg-rose-500",
						expired: "bg-yellow-400",
						unknown: "bg-gray-500",
						enroute: "bg-blue-500",
					};

					return (
						<motion.div
							key={index}
							className='flex items-center gap-2'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<span
								className={`inline-block h-4 w-4 rounded ${
									colors[label] || "bg-gray-400"
								}`}
							/>
							<span className='capitalize'>
								{label === "enroute" ? "Pending" : label} –{" "}
								{item[label + "Percentage"]} ({item[label]})
							</span>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
};

export default Design;
