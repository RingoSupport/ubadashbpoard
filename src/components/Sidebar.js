import React from "react";

export const Sidebar = ({ setElement, logo }) => {
	return (
		<div className='bg-gray-900 text-white h-full w-1/5 p-4 flex flex-col items-center'>
			<div className='flex items-center space-x-2 mb-8'>
				<img src={logo} alt='Logo' className='w-20 h-20 rounded-full' />
			</div>
			<ul className='space-y-2'>
				<li
					className='hover:text-blue-500 cursor-pointer'
					onClick={() => setElement("Dashboard")}
				>
					Dashboard
				</li>
				<li
					className='hover:text-blue-500 cursor-wait'
					onClick={() => setElement("Transactions")}
				>
					Transactions
				</li>
				<li className='hover:text-blue-500 cursor-pointer'>Roles</li>
			</ul>
		</div>
	);
};
