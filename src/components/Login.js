import axios from "axios";
import React, { useEffect, useState } from "react";

export const Login = ({ loginState, setLoginState }) => {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Handle form submission here
		// const url = "http://localhost:3000/test.php";
		//const liveUrl = "http://34.118.77.154:9091/php/login.php";
		try {
			const { data } = await axios.post(
				"http://34.118.77.154:9091/php/login.php",
				{
					...formData,
				}
			);

			if (data.status === "200") {
				console.log(data);
				console.log("first");
				localStorage.setItem("token", data.token);
				setError("");
				setLoginState(false);

				// Login successful, redirect to the dashboard or set authentication state
			} else {
				setError(data.error);
			}
		} catch (error) {
			console.log(error.response);
			console.log(error);
			setError("An error occurred. Please try again.");
			setLoginState(true);
		}
	};

	useEffect(() => {
		const checkLocalstorage = localStorage.getItem("token");
		if (checkLocalstorage) {
		} else {
			console.log("first");
		}
	}, []);

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-400'>
			<form
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3'
				onSubmit={handleSubmit}
			>
				<h2 className='text-white text-2xl font-bold mb-4 text-center bg-blue-500 py-2 rounded-t-lg'>
					Telco Alert Dashboard
				</h2>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='username'
					>
						Username
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='username'
						type='text'
						name='username'
						placeholder='Username'
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</div>
				<div className='mb-6'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='password'
					>
						Password
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='password'
						type='password'
						name='password'
						placeholder='Password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<div className='flex items-center justify-between'>
					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline'
						type='submit'
					>
						Login
					</button>
				</div>
				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mt-2 text-center'>
						{error}
					</div>
				)}
			</form>
		</div>
	);
};
