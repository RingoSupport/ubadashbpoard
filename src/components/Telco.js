import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import { DoughNut } from "./DoughNut";
import { Image } from "./Image";

export const Telco = ({
	name,
	successCount,
	failureCount,
	undeliveredCount,
	expiredCount,
	pendingCount,
	isLoading,
}) => {
	const override = {
		display: "block",
		margin: "0 auto",
	};

	return (
		<div className='flex flex-col justify-center '>
			<div className='flex flex-col justify-center items-center'>
				<Image name={name} />
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
			</div>
		</div>
	);
};
