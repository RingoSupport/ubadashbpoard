import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Image from "./assets/download.png";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./components/Login";
import { Transactions } from "./components/Transactions";
import { Airtime } from "./components/Airtime";
import { Design } from "./components/Design";
import { International } from "./components/International";
import { Data } from "./components/Data";
import { Logs } from "./components/Logs";
import { Otp } from "./components/Otp";
import { NonTrans } from "./components/NonTrans";
import { InternationalTable } from "./components/InternationalTable";
import { InternationalOTP } from "./components/InternationalOTP";
import { InternationalOTPMessages } from "./components/InternationalOTPMessages";
import { OledLogs } from "./components/OledLogs";
import { OtpPage } from "./components/OtpPage";
import { useAuth } from "./hooks/useAuth";
import { useFetch } from "./hooks/useFetch";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { ProtectedLayout } from "./components/ProtectedLayout";

function App() {
	const { loggedIn, logout } = useAuth();
	const [showSidebar, setShowSidebar] = useState(true);

	// Fetch APIs
	const { data: items, refetch: refetchItems } = useFetch(
		"https://ubasms.approot.ng/php/normal.php"
	);
	const { data: otpItems, refetch: refetchOtp } = useFetch(
		"https://ubasms.approot.ng/php/otpnormal.php"
	);
	const { data: internationalData, refetch: refetchIntl } = useFetch(
		"https://messaging.approot.ng/dashboard.php"
	);
	const { data: internationalOtpData, refetch: refetchIntlOtp } = useFetch(
		"https://messaging.approot.ng/otpdashboard.php"
	);

	// Periodic refresh
	useEffect(() => {
		const interval = setInterval(() => {
			refetchItems();
			refetchOtp();
			refetchIntl();
			refetchIntlOtp();
		}, 60000);
		return () => clearInterval(interval);
	}, [refetchItems, refetchOtp, refetchIntl, refetchIntlOtp]);

	const toggleSidebar = () => setShowSidebar(!showSidebar);
	console.log(showSidebar);

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			{loggedIn && showSidebar && <Sidebar logo={Image} logout={logout} />}

			<main className='flex-1 flex relative z-0 flex-col overflow-auto p-4'>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/otp' element={<OtpPage />} />

					<Route
						path='/dashboard'
						element={
							<ProtectedRoute>
								<ProtectedLayout
									data={{
										items,
										otpItems,
										internationalData,
										internationalOtpData,
									}}
								>
									<Design
										items={items}
										otpItems={otpItems}
										datum={internationalData}
										datumOtp={internationalOtpData}
										showSideBarFunc={toggleSidebar}
										sidebar={showSidebar}
									/>
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/transactions'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<Transactions />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/otp-page'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<Otp />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/nontrans'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<NonTrans />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/airtime'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<Airtime />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/data'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<Data />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/international'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<International />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/international-otp'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<InternationalOTPMessages />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/international-table'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<InternationalTable />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/international-otp-table'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<InternationalOTP />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/logs'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<Logs />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/old'
						element={
							<ProtectedRoute>
								<ProtectedLayout>
									<OledLogs />
								</ProtectedLayout>
							</ProtectedRoute>
						}
					/>

					{/* Fallback */}
					<Route path='*' element={<Navigate to='/dashboard' replace />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
