import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const OtpPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const username = location.state?.username || "";

	const [otpValue, setOtpValue] = useState("");
	const [error, setError] = useState("");

	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				"https://ubasms.approot.ng//php/otp.php",
				{ otp: otpValue, username }
			);

			if (data.status === "200") {
				const token = sessionStorage.getItem("token");
				localStorage.setItem("token", token);
				setError("");
				navigate("/dashboard"); // Redirect to dashboard
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<form
				className='bg-white shadow-lg rounded-lg px-10 py-8 w-full max-w-md'
				onSubmit={handleOtpSubmit}
			>
				<h2 className='text-2xl font-bold text-center text-white bg-[#D82418] py-3 rounded-t-lg mb-6'>
					Enter OTP
				</h2>

				<div className='mb-6'>
					<label
						className='block text-gray-700 font-semibold mb-2'
						htmlFor='otp'
					>
						OTP
					</label>
					<input
						id='otp'
						name='otp'
						type='number'
						placeholder='Enter OTP'
						value={otpValue}
						onChange={(e) => setOtpValue(e.target.value)}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D82418]'
						required
					/>
				</div>

				<button
					type='submit'
					className='w-full py-3 bg-[#D82418] hover:bg-red-700 text-white font-bold rounded-lg transition duration-200'
				>
					Proceed
				</button>

				{error && (
					<p className='text-center text-red-600 mt-4 font-medium'>{error}</p>
				)}
			</form>
		</div>
	);
};
