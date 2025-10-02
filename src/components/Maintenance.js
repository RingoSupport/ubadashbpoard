import React from "react";

const MaintenanceMode = () => {
	return (
		<div className='flex items-center justify-center h-screen bg-red-600'>
			<div className='bg-gray-300 p-8 rounded-lg shadow-md text-center animate-bounce'>
				<h1 className='text-4xl text-black'>Under Maintenance</h1>
				<p className='text-lg text-black mt-4'>
					We are performing scheduled maintenance. Please check back soon.
				</p>
			</div>
		</div>
	);
};

export default MaintenanceMode;
