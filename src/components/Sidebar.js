import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar = ({ logo, logout }) => {
	const menuItems = [
		{ to: "/dashboard", label: "Dashboard", icon: "fa-chart-line" },
		{ to: "/airtime", label: "Airtime", icon: "fa-mobile-alt" },
		{ to: "/data", label: "Data", icon: "fa-database" },
		{ to: "/transactions", label: "Local Messages", icon: "fa-envelope" },
		{ to: "/otp-page", label: "Local OTP Messages", icon: "fa-key" },
		{ to: "/nontrans", label: "Local Non Trans Messages", icon: "fa-inbox" },
		{ to: "/international", label: "International Messages", icon: "fa-globe" },
		{
			to: "/international-otp",
			label: "International OTP Messages",
			icon: "fa-paper-plane",
		},
		{
			to: "/international-table",
			label: "International Table",
			icon: "fa-table",
		},
		{
			to: "/international-otp-table",
			label: "International OTP Table",
			icon: "fa-table",
		},
		{ to: "/logs", label: "Logs", icon: "fa-file-alt" },
		{ to: "/old", label: "Old Message Logs", icon: "fa-archive" },
	];

	return (
		<div>
			{/* Desktop Sidebar */}
			<div className=' bg-red-700 text-white hidden h-full p-2 lg:flex flex-col items-center w-60'>
				<div className='flex items-center space-x-2 mb-8'>
					<img
						src={logo}
						alt='Logo'
						className='w-14 h-14 rounded-full border-2 border-white'
					/>
				</div>
				<ul className='space-y-2 w-full'>
					{menuItems.map(({ to, label, icon }) => (
						<li key={to}>
							<NavLink
								to={to}
								className={({ isActive }) =>
									`flex items-center px-2 py-2 rounded-md text-[12px] transition-colors duration-200
									${
										isActive
											? "bg-white text-[#8B1C0A] font-semibold"
											: "text-gray-200 hover:text-white"
									}`
								}
							>
								<i className={`fa-solid ${icon} text-sm mr-3 w-5 h-5`} />
								<span className='truncate'>{label}</span>
							</NavLink>
						</li>
					))}
				</ul>
				<ul className='mt-auto w-full'>
					<li
						className='cursor-pointer flex items-center px-2 py-2 text-[12px] rounded-md text-white hover:bg-white hover:text-[#8B1C0A] transition-colors duration-200'
						onClick={logout}
					>
						<i className='fa-solid fa-power-off text-sm mr-3 w-5 h-5'></i>
						<span className='truncate'>Logout</span>
					</li>
				</ul>
			</div>

			{/* Mobile Bottom Nav */}
			<div className='lg:hidden bg-[#8B1C0A] text-white w-full p-0 absolute bottom-0 pb-20 z-10'>
				<ul className='flex justify-between items-center p-0 m-0'>
					{menuItems.slice(0, 4).map(({ to, label, icon }) => (
						<li key={to} className='p-1 text-[10px] text-center mx-2'>
							<NavLink
								to={to}
								className={({ isActive }) =>
									`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200
									${isActive ? "bg-white text-[#8B1C0A]" : "text-gray-200 hover:text-white"}`
								}
							>
								<i className={`fa-solid ${icon} text-sm mb-1`} />
								{label}
							</NavLink>
						</li>
					))}
					<li
						className='p-1 text-[10px] text-center mx-2 cursor-pointer flex flex-col items-center'
						onClick={logout}
					>
						<i className='fa-solid fa-power-off text-sm mb-1'></i>
						Logout
					</li>
				</ul>
			</div>
		</div>
	);
};
