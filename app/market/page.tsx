'use client';
import Navbar from '@/comm/Navbar';
import Products from '@/components/market/products/Product';
import blackwoman from '@/public/images/home/blackWoman.jpg'; // Example image
import anime from '@/public/images/profile/lucky star.jpg';
import type { Product } from '@/types/global';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react'; // Import useState if not already imported
import styles from './market.module.css';

export default function Market() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selected, setSelected] = useState<string>('All Products');

	const handleClick = (value: string) => {
		setSelected(value);
	};

	const [products] = useState<Product[]>([
		{
			id: 1,
			name: 'Sample Product',
			description: '',
			price: '$10.00',
			type: '',
			category: 'Autos & Vehicles',
			stock: 1,
			imageUrl: blackwoman,
		},
		{
			id: 2,
			name: 'Another Product',
			description: 'Another sample product description.',
			price: '$20.00',
			type: 'Used',
			category: "Baby & Children's Products",
			stock: 2,
			imageUrl: blackwoman,
		},
		{
			id: 3,
			name: 'A 3rd Product',
			description: 'A 3rd product description.',
			price: '$20.00',
			type: 'Used',
			category: 'Autos & Vehicles',
			stock: 3,
			imageUrl: anime,
		},
		{
			id: 4,
			name: 'Another Product',
			description: 'Another sample product description.',
			price: '$20.00',
			type: 'Used',
			category: "Baby & Children's Products",
			stock: 2,
			imageUrl: blackwoman,
		},
		// { id: 5, name: 'Fifth Product', description: 'Fifth product description.', price: '$25.00', type: 'New', category: '', stock: 5, imageUrl: blackwoman }
	]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	// Filter products based on selected category and search query
	const filteredProducts = products.filter(
		(product) =>
			(selected === 'All Products' || product.category === selected) &&
			(product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	return (
		<Navbar>
			<div className="market-main p-5">
			<header className="flex flex-col items-center p-2 lg:flex-row lg:items-start">
				<h1 className="market-header mb-2 text-center text-2xl lg:mb-0 lg:mr-auto lg:text-left lg:text-4xl">
					Market
				</h1>
				<div className="search mb-5 w-full lg:mb-0 lg:ml-auto lg:w-1/2">
					<Input
						type="text"
						radius="sm"
						label="Search for products"
						labelPlacement="inside"
						className="w-full"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>
			</header>

			<div className="nearby-shops relative mb-5 rounded-lg bg-green-200 p-4">
				<h2 className="mb-2 text-2xl lg:text-4xl">Nearby Shops</h2>
				<p className="mb-5">
					Find shops near to you based on your location and connect with them
					directly.
				</p>
				<Button
					radius="sm"
					className="explore-btn rounded-md bg-black p-2 text-white"
				>
					Explore
				</Button>
			</div>

			<div className="types mb-5 pb-4  flex gap-2 overflow-x-auto whitespace-nowrap">
				<Button
					radius="sm"
					className={`${styles.typeBtn} ${
						selected === 'All Products' ? styles.active : ''
					}`}
					onClick={() => handleClick('All Products')}
				>
					All Products
				</Button>
				<Button
					radius="sm"
					className={`${styles.typeBtn} ${
						selected === 'Autos & Vehicles' ? styles.active : ''
					}`}
					onClick={() => handleClick('Autos & Vehicles')}
				>
					Autos 
				</Button>
				<Button
					radius="sm"
					className={`${styles.typeBtn} ${
						selected === "Baby & Children's Products" ? styles.active : ''
					} `}
					onClick={() => handleClick("Baby & Children's Products")}
				>
					Children
				</Button>
				<Button
					radius="sm"
					className={`${styles.typeBtn} ${
						selected === 'Beauty Products & Services' ? styles.active : ''
					}`}
					onClick={() => handleClick('Beauty Products & Services')}
				>
					Beauty
				</Button>
				<Button
					radius="sm"
					className={`${styles.typeBtn} ${
						selected === 'Computers & Peripherals' ? styles.active : ''
					}`}
					onClick={() => handleClick('Computers & Peripherals')}
				>
					Computers
				</Button>
				<Button
					radius="sm"
					className={`${styles.typeBtn} ${
						selected === 'Consumer Electronics' ? styles.active : ''
					}`}
					onClick={() => handleClick('Consumer Electronics')}
				>
					Electronics
				</Button>
			</div>

			<main className="main-content flex flex-col items-center overflow-auto rounded-lg p-5">
				{products.length > 0 ? (
					<Products selectedProduct={selected} products={filteredProducts} />
				) : (
					<p className="text-center text-xl text-gray-500">
						There are no products
					</p>
				)}
			</main>
		</div>
		</Navbar>
	);
}
