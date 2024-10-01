export default function Blocked() {
	return (
		<>
			<main className="flex min-h-screen flex-col bg-gray-200 text-center">
				<h1 className="mx-auto mb-8 mt-10 text-left text-4xl font-bold text-gray-800">
					Blocked Users
				</h1>

				<section className="mx-auto h-[20rem] w-[70%] rounded-lg bg-white p-4 shadow-md">
					<button className="mt-[6rem] h-16 w-16 rounded-full bg-yellow-200 text-white"></button>
					<p className="text-ml mt-4 text-gray-800">No memebers to show.</p>
				</section>
			</main>
		</>
	);
}
