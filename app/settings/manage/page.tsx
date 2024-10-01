export default function Manage() {
	return (
		<>
			<main className="flex min-h-screen flex-col bg-gray-200">
				<h1 className="text-ml lg:text-4xl mx-auto mb-8 mt-10 text-left font-bold text-gray-800">
					Manage Sessions
				</h1>
				<div className="mx-auto h-[22rem] w-[95%] lg:w-[65%] rounded-lg bg-white p-4 shadow-md">
					<button className="mb-2 lg:mb-8 h-8 lg:h-10 w-[9rem] lg:w-[14rem] rounded  px-2 py-2 text-[0.6rem] lg:text-[1rem] text-white ">
						Logout From All Sessions
					</button>
					<section className="mx-auto lg:ml-[0.1rem] mt-4 h-[11rem] lg:h-[14rem] w-full lg:w-[13.9rem] rounded-lg border-2 border-gray-200 p-4">
						<button className="h-10 w-10 rounded-full bg-gray-200" />
						<p className="text-ml lg:text-xl mt-4 font-bold text-gray-800">Windows</p>
						<p className="mt-2 text-sm lg:text-ml text-gray-800">Google Chrome</p>
						<p className="text-sm lg:text-ml text-gray-800">now</p>
						<p className="text-sm lg:text-ml text-gray-800">IP Address: ::1</p>
					</section>
				</div>
			</main>
		</>
	);
}
