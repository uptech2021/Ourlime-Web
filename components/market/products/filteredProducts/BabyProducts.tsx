import { Product } from '@/types/global';
import Link from 'next/link';
import Image from 'next/image';

export default function BabyProducts({ products }: { products: Product[] }) {
	const babyProducts = products.filter(
		(product) => product.category === "Baby & Children's Products"
	);

	return (
		<div>
			{babyProducts.length > 0 ? (
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{babyProducts.map((product) => (
						<div
							key={product.id}
							className="product-card flex flex-col items-center rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg"
						>
							<Link
								href={`/market/${product.id}`}
								className="product-link w-full"
							>
								<div className="image-container relative mb-4 h-80 w-full">
									<Image
										src={product.imageUrl}
										alt={product.name}
										className="h-full w-full rounded-md object-cover"
									/>
								</div>
								<h3 className="product-name mb-2 text-xl font-semibold">
									{product.name}
								</h3>
								<p className="product-price text-lg text-gray-700">
									{product.price}
								</p>
							</Link>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-xl text-gray-500">
					There are no products
				</p>
			)}
		</div>
	);
}
