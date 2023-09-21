import React from "react";
import mtn from "../assets/mtn.png";
import glo from "../assets/glo.png";
import etisalat from "../assets/etisalat.jpeg";
import airtel from "../assets/airtel.png";
import FadeLoader from "react-spinners/FadeLoader";
import { DoughNut } from "./DoughNut";

export const Telco = ({
	name,
	successCount,
	failureCount,
	undeliveredCount,
	expiredCount,
	pendingCount,
	isLoading,
}) => {
	const imageToDisplay = (name) => {
		if (name.toLowerCase() === "mtn") {
			return (
				<div className='w-12 h-12'>
					<img src={mtn} alt='mtn' className=' rounded-full   ' />
				</div>
			);
		} else if (name.toLowerCase() === "airtel") {
			return (
				<div className='w-12 h-12'>
					<img
						alt='airtel'
						src={airtel}
						className=' rounded-full w-full h-full  '
					></img>
				</div>
			);
		} else if (name.toLowerCase() === "glo") {
			return (
				<div className='w-12 h-12'>
					<img
						alt='glo'
						src={glo}
						className='rounded-full w-full h-full '
					></img>
				</div>
			);
		}
		return (
			<div className='w-12 h-12'>
				<img src={etisalat} alt='9mobile' className='rounded-full   ' />
			</div>
		);
	};

	const override = {
		display: "block",
		margin: "0 auto",
	};

	return (
		<div className='flex flex-col justify-center '>
			<div className='flex flex-col justify-center items-center'>
				{imageToDisplay(name)}
			</div>
			<div>
				<section>
					{isLoading ? (
						<FadeLoader
							loading={isLoading}
							cssOverride={override}
							size={150}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<>
							<DoughNut
								successCount={successCount}
								failureCount={failureCount}
								undeliveredCount={undeliveredCount}
								expiredCount={expiredCount}
							/>
						</>
					)}
				</section>
				{/* <section className='bg-green-600 p-2 text-center mb-2'>
					{isLoading ? (
						<FadeLoader
							loading={isLoading}
							cssOverride={override}
							size={150}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<>
							<h1 className='text-white uppercase text-sm mb-1'>
								successful count
							</h1>
							<h1 className='font-bold text-xl'>{successCount}</h1>
						</>
					)}
				</section>
				<section className='bg-orange-400 p-2 text-center mb-2'>
					{isLoading ? (
						<FadeLoader
							loading={isLoading}
							cssOverride={override}
							size={150}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<>
							<h1 className='text-white uppercase text-sm mb-1'>
								failure count
							</h1>
							<h1 className='font-bold text-xl'>{failureCount}</h1>
						</>
					)}
				</section>
				<section className='bg-yellow-600 text-center mb-2'>
					{isLoading ? (
						<FadeLoader
							loading={isLoading}
							cssOverride={override}
							size={150}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<>
							<h1 className='text-white uppercase text-sm mb-1'>
								expired count
							</h1>
							<h1 className='font-bold text-xl'>{expiredCount}</h1>
						</>
					)}
				</section>
				<section className='bg-red-700 p-2 text-center mb-2'>
					{isLoading ? (
						<FadeLoader
							loading={isLoading}
							cssOverride={override}
							size={150}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<>
							<h1 className='text-white uppercase text-sm mb-1'>
								undelivered count
							</h1>
							<h1 className='font-bold text-xl'>{undeliveredCount}</h1>
						</>
					)}
				</section> */}
				{/* <section className='bg-sky-400 p-2 text-center mb-2'>
					{isLoading ? (
						<FadeLoader
							loading={isLoading}
							cssOverride={override}
							size={150}
							aria-label='Loading Spinner'
							data-testid='loader'
						/>
					) : (
						<>
							<h1 className='text-white uppercase text-sm mb-1'>
								pending count
							</h1>
							<h1 className='font-bold text-xl'>{pendingCount}</h1>
						</>
					)}
				</section> */}
			</div>
		</div>
	);
};
