import React, { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import HeaderForm from "./HeaderForm";
import { checkDlr } from "../utils/dlr";

export const Checked = () => {
	const [isTableVisible, setTableVisible] = useState(false);
	const [isMessageVisible, setMessageVisible] = useState(false);
	const [dlrData, setDlrData] = useState([]);

	const closeSidemenu = useCallback(() => {
		if (isTableVisible) {
			setTableVisible(false);
		} else if (isMessageVisible) {
			setMessageVisible(false);
		}
		return;
	}, [isMessageVisible, isTableVisible]);
	const toggleTable = () => {
		setTableVisible(!isTableVisible);
	};

	const toggleMessage = () => {
		setMessageVisible(!isMessageVisible);
	};

	useEffect(() => {
		document.body.addEventListener("click", closeSidemenu);

		return function cleanup() {
			document.body.removeEventListener("click", closeSidemenu);
		};
	}, [closeSidemenu]);
	return (
		<div>
			<header className='bg-white shadow'>
				<div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
					<HeaderForm
						setMessageVisible={setMessageVisible}
						setDlrData={setDlrData}
						setTableVisible={setTableVisible}
					/>
				</div>
			</header>
			{isTableVisible ? (
				<section className='absolute inset-0 flex justify-center items-center'>
					<div className='relative w-[80%] h-[70%] overflow-y-auto'>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th className='small-column'>#</th>
									<th className='small-column'>TimeStamp</th>
									<th className='small-column'>DLR</th>
									<th className='small-column'>Phone</th>
									<th className='small-column'>Message</th>
									<th className='small-column'>Unique ID</th>
								</tr>
							</thead>
							<tbody>
								{dlrData.map((item, index) => {
									return (
										<tr key={index}>
											<td>{index}</td>
											<td className='small-column'>{item.pk_ssml_log_time}</td>
											<td className='small-column'>
												{checkDlr(item.ssml_result)}
											</td>
											<td className='small-column'>
												{item.ssml_subscriber_number}
											</td>
											<td className='small-column'>{item.ssml_content}</td>
											<td className='small-column'>
												{item.ssml_smpp_message_id}
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</div>
					<button
						className=' mt-[-400px] bg-red-500 text-white px-4 py-2 rounded-md'
						onClick={toggleTable}
					>
						<i className='fa-solid fa-xmark'></i>
					</button>
				</section>
			) : (
				""
			)}
			{isMessageVisible && (
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md w-52'>
					<p className='text-center text-gray-700'>No records found.</p>
					<button
						className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md'
						onClick={toggleMessage}
					>
						Close
					</button>
				</div>
			)}
		</div>
	);
};
