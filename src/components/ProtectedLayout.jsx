import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout = ({ children, data }) => {
	const { logout } = useAuth();
	const [showSidebar, setShowSidebar] = useState(true);

	// Toggle sidebar
	const toggleSidebar = () => setShowSidebar(!showSidebar);

	return (
		<div className='flex h-screen'>
			{/* {showSidebar && <Sidebar logo={Image} logout={logout} />} */}

			<main className='flex-1 flex flex-col overflow-auto'>
				{/* Pass toggleSidebar to children */}
				{React.cloneElement(children, {
					...data,
					showSideBarFunc: toggleSidebar,
					sidebar: showSidebar,
				})}
			</main>
		</div>
	);
};
