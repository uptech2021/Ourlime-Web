// app/market/[id]/page.tsx
import Navbar from '@/comm/Navbar';
import blackWoman from '@/public/images/home/blackWoman.jpg'; // Example image
import { Product } from '@/types/global';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

type ProductPageProps = {
	params: {
		id: string | undefined;
	};
};

// Mocked product data
const products: Product[] = [
	{
		id: 1,
		name: 'Sample Product',
		description: 'This is a sample product description.',
		price: '$10.00',
		type: 'New',
		category: '',
		stock: 1,
		imageUrl: blackWoman,
	},
	{
		id: 2,
		name: 'Another Product',
		description: 'Another sample product description.',
		price: '$20.00',
		type: 'Used',
		category: '',
		stock: 2,
		imageUrl: blackWoman,
	},
	// Add more products or fetch from an API/database
];

export default function ProductPage({ params }: ProductPageProps) {
	if (!params?.id) {
		// If id is missing, render a not found page or handle accordingly
		return (
			<div className="product-not-found p-5 text-center">
				<h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
				<p className="text-lg text-gray-700">
					No product ID provided. Please check the URL or go back to the market.
				</p>
				<Link href="/market" className="text-blue-500 underline">
					Back to Market
				</Link>
			</div>
		);
	}

	// Extract and parse the product id from the URL
	const { id } = params;
	const productId = parseInt(id, 10);

	// Find the product by ID
	const product = products.find((p) => p.id === productId);

	// Handle the case where the product is not found
	if (!product) {
		return (
			<div className="product-not-found p-5 text-center">
				<h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
				<p className="text-lg text-gray-700">
					We couldn&apos;t find the product you&apos;re looking for. Please check the URL
					or go back to the market.
				</p>
				<Link href="/market" className="text-blue-500 underline">
					Back to Market
				</Link>
			</div>
		);
	}

	return (
		<Navbar>
			<div className="product-detail-page flex flex-col p-5 lg:flex-row">
			{/* Image Gallery */}
			<div className="product-gallery flex-1 p-4">
				<div className="main-image relative mb-4 h-80 w-full overflow-hidden rounded-md border border-gray-300">
					<Image
						src={product.imageUrl}
						alt={product.name}
						layout="fill"
						objectFit="cover"
						className="rounded-md"
					/>
				</div>
				<div className="thumbnail-images flex space-x-2">
					{/* Display additional images if available */}
					<div className="thumbnail relative h-20 w-20 overflow-hidden rounded-md border border-gray-300">
						<Image
							src={product.imageUrl}
							alt={`${product.name} thumbnail`}
							layout="fill"
							objectFit="cover"
							className="rounded-md"
						/>
					</div>
					<div className="thumbnail relative h-20 w-20 overflow-hidden rounded-md border border-gray-300">
						<Image
							src={blackWoman}
							alt={`${product.name} thumbnail`}
							layout="fill"
							objectFit="cover"
							className="rounded-md"
						/>
					</div>
				</div>
			</div>

			{/* Product Details */}
			<div className="product-info flex-1 p-4">
				<h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
				<p className="mb-4 text-xl text-red-600">{product.price} (USD)</p>
				<p className="mb-2 text-lg text-gray-700">
					Published By <span className="font-bold">root</span>
				</p>
				<div className="product-status mb-4 flex items-center">
					<span className="mr-2 font-bold">Status:</span>
					<span className="text-gray-700">
						{product.stock > 0 ? 'In stock' : 'Out of stock'}
					</span>
				</div>
				<div className="product-type mb-4 flex items-center">
					<span className="mr-2 font-bold">Type:</span>
					<span className="text-gray-700">{product.type}</span>
				</div>
				<Button className="edit-product-btn mb-4 rounded-md bg-gray-200 p-2 text-gray-800">
					Edit product
				</Button>
				<div className="product-description">
					<h2 className="mb-2 text-xl font-bold">Details</h2>
					<p className="text-gray-700">{product.description}</p>
				</div>
			</div>
		</div>
		</Navbar>
	);
}

// Generate static params for all products
export async function generateStaticParams() {
	// Replace this with your actual product fetching logic
	const paths = products.map((product) => ({
		id: product.id.toString(), // Convert id to string for routing
	}));

	return paths;
}
