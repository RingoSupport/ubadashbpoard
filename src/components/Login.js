import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				"https://ubasms.approot.ng//php/login.php",
				formData
			);
			if (data.status === "200") {
				sessionStorage.setItem("token", data.token);
				setError("");
				// Redirect to OTP page
				navigate("/otp", { state: { username: formData.username } });
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
				onSubmit={handleSubmit}
			>
				<h2 className='text-2xl font-bold text-center text-white bg-[#D82418] py-3 rounded-t-lg mb-6'>
					Telco Alert Dashboard
				</h2>

				<div className='mb-4'>
					<label
						className='block text-gray-700 font-semibold mb-2'
						htmlFor='username'
					>
						Username
					</label>
					<input
						id='username'
						name='username'
						type='text'
						placeholder='Enter username'
						value={formData.username}
						onChange={handleChange}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D82418]'
						required
					/>
				</div>

				<div className='mb-6'>
					<label
						className='block text-gray-700 font-semibold mb-2'
						htmlFor='password'
					>
						Password
					</label>
					<input
						id='password'
						name='password'
						type='password'
						placeholder='Enter password'
						value={formData.password}
						onChange={handleChange}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D82418]'
						autoComplete='no-password'
						required
					/>
				</div>

				<button
					type='submit'
					className='w-full py-3 bg-[#D82418] hover:bg-red-700 text-white font-bold rounded-lg transition duration-200'
				>
					Login
				</button>

				{error && (
					<p className='text-center text-red-600 mt-4 font-medium'>{error}</p>
				)}
			</form>
		</div>
	);
};
