import { LayoutPanelLeft } from 'lucide-react';
export default function subscriptions() {
	return (
		<div className="subscriptions-main flex flex-col p-5">
			<header className="subscriptions-header flex flex-col items-center lg:items-start lg:pl-72">
				<h1 className="mb-2 text-3xl font-bold 2xl:text-5xl">Subscriptions</h1>
			</header>
			<main className="flex flex-col items-center">
				<div className="h-20 2xl:h-40">
					<LayoutPanelLeft className="h-full w-full text-gray-600" />
				</div>
				<div>
					<p className="text-xl text-gray-600 2xl:text-3xl">
						You have no subscriptions.
					</p>
				</div>
			</main>
		</div>
	);
}
