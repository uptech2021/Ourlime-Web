'use client';

import { useEffect, useState } from 'react';
import {
	Search, Filter, Grid, List,
	Star, Heart, ShoppingBag,
	DollarSign, Laptop, Shirt,
	Home, Dumbbell, Gamepad,
	Car, ChefHat, BookOpen,
	Camera, Menu, ArrowRight, X
} from 'lucide-react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import ProductDetailsSidebar from '@/components/market/products/ProductDetailsSidebar';

export default function MarketPage() {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isSidebarProductOpen, setIsSidebarProductOpen] = useState(false);

	const categories = [
		{
			id: '1',
			name: "Electronics",
			count: 156,
			image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop",
			description: "Latest gadgets and tech innovations"
		},
		{
			id: '2',
			name: "Fashion",
			count: 243,
			image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop",
			description: "Trending styles and accessories"
		},
		{
			id: '3',
			name: "Gaming",
			count: 89,
			image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop",
			description: "Games, consoles and accessories"
		},
		{
			id: '4',
			name: "Home & Living",
			count: 178,
			image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1000&auto=format&fit=crop",
			description: "Modern furniture and decor"
		},
		{
			id: '5',
			name: "Sports",
			count: 132,
			image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop",
			description: "Sports gear and equipment"
		}
	];

	const CategorySlider = () => (
		<div className="hidden lg:block mb-8">
			<Swiper
				slidesPerView={1}
				spaceBetween={20}
				pagination={{
					clickable: true,
					bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
					bulletActiveClass: 'swiper-pagination-bullet-active !bg-greenTheme'
				}}
				breakpoints={{
					640: { slidesPerView: 2 },
					1024: { slidesPerView: 4 }
				}}
				modules={[Pagination]}
				className="!pb-12"
			>
				{categories.map((category) => (
					<SwiperSlide key={category.id}>
						<button
							onClick={() => setSelectedCategory(category.id)}
							className="group relative w-full h-64 rounded-2xl overflow-hidden"
							title={`View ${category.name}`}
						>
							{/* Background Image */}
							<Image
								src={category.image}
								alt={category.name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>

							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

							{/* Content */}
							<div className="absolute bottom-0 left-0 right-0 p-6 text-left">
								<div className="flex items-center gap-2 mb-2">
									<span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
										{category.count} items
									</span>
								</div>
								<h3 className="text-xl font-bold text-white mb-1">
									{category.name}
								</h3>
								<p className="text-gray-200 text-sm line-clamp-2">
									{category.description}
								</p>

								{/* Hover State Button */}
								<div className="absolute right-6 bottom-6 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
									<div className="bg-white rounded-full p-2">
										<ArrowRight size={20} className="text-gray-900" />
									</div>
								</div>
							</div>
						</button>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);

	const MobileSidebar = () => (
		<div className={`
			fixed inset-0 z-50 lg:hidden
			transform transition-transform duration-300
			${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
		`}>
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />

			{/* Sidebar Content */}
			<div className="absolute inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold">Filters</h2>
					<button
						onClick={() => setIsSidebarOpen(false)}
						title="Close sidebar"
						className="p-2 hover:bg-gray-100 rounded-lg"
					>
						<X size={20} />
					</button>
				</div>

				{/* Filter Sections */}
				<div className="space-y-6">
					{/* Categories */}
					<div className="border-b pb-4">
						<h3 className="font-semibold mb-3">Categories</h3>
						<div className="space-y-2">
							{categories.map((category) => (
								<label key={category.id} className="flex items-center gap-2">
									<input
										type="checkbox"
										className="rounded text-greenTheme"
										onChange={() => setSelectedCategory(category.id)}
										checked={selectedCategory === category.id}
									/>
									<span>{category.name}</span>
								</label>
							))}
						</div>
					</div>

					{/* Price Range */}
					<div className="border-b pb-4">
						<h3 className="font-semibold mb-3">Price Range</h3>
						<div className="flex items-center gap-2">
							<input
								type="number"
								placeholder="Min"
								className="w-full px-3 py-1.5 rounded border"
								value={priceRange[0]}
								onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
							/>
							<span>-</span>
							<input
								type="number"
								placeholder="Max"
								className="w-full px-3 py-1.5 rounded border"
								value={priceRange[1]}
								onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
							/>
						</div>
					</div>

					{/* Colors */}
					<div className="border-b pb-4">
						<h3 className="font-semibold mb-3">Colors</h3>
						<div className="grid grid-cols-2 gap-2">
							{['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].map((color) => (
								<label key={color} className="flex items-center gap-2">
									<input type="checkbox" className="rounded text-greenTheme" />
									<span>{color}</span>
								</label>
							))}
						</div>
					</div>

					{/* Sizes */}
					<div className="border-b pb-4">
						<h3 className="font-semibold mb-3">Sizes</h3>
						<div className="grid grid-cols-3 gap-2">
							{['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
								<label key={size} className="flex items-center gap-2">
									<input type="checkbox" className="rounded text-greenTheme" />
									<span>{size}</span>
								</label>
							))}
						</div>
					</div>

					{/* Apply Filters Button */}
					<button
						onClick={() => setIsSidebarOpen(false)}
						className="w-full py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
					>
						Apply Filters
					</button>
				</div>
			</div>
		</div>
	);

	// State and fetch function
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const productsSnapshot = await getDocs(collection(db, 'products'));
				const productsData = await Promise.all(
					productsSnapshot.docs.map(async (doc) => {
						const product = doc.data();

						// Fetch color variants
						const colorVariantsSnapshot = await getDocs(
							query(collection(db, 'colorVariants'),
								where('productId', '==', doc.id))
						);
						const colorVariants = colorVariantsSnapshot.docs.map(cv => cv.data().colorVariantName);

						// Fetch size variants
						const sizeVariantsSnapshot = await getDocs(
							query(collection(db, 'sizeVariants'),
								where('productId', '==', doc.id))
						);
						const sizeVariants = sizeVariantsSnapshot.docs.map(sv => sv.data().sizeVariantName);

						// Fetch variants for prices
						const variantsSnapshot = await getDocs(
							query(collection(db, 'variants'),
								where('productId', '==', doc.id))
						);
						const prices = variantsSnapshot.docs.map(v => v.data().price);
						const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
						const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;


						const productData = {
							id: doc.id,
							name: product.title,
							description: product.shortDescription,
							priceRange: {
								lowest: lowestPrice,
								highest: highestPrice
							},
							image: product.thumbnailImage,
							category: product.category,
							colors: colorVariants,
							sizes: sizeVariants
						};
						return productData;
					})
				);
				setProducts(productsData);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching products:', error);
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);


	// disable scrolling
	useEffect(() => {
		if (isSidebarProductOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isSidebarProductOpen]);

	// Add this useEffect for cleanup
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsSidebarProductOpen(false);
				setSelectedProduct(null);
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, []);

	// Modify the onClose handler to clear both states
	const handleSidebarClose = () => {
		setIsSidebarProductOpen(false);
		setSelectedProduct(null);
	};


	return (
		<div className={`min-h-screen w-full bg-gray-100 ${isSidebarProductOpen ? 'overflow-hidden' : ''}`}>
			<main className="pt-36 w-full px-2 md:px-8">
				<div className="max-w-[2000px] mx-auto">
					{/* Mobile Sidebar */}
					<MobileSidebar />

					{/* Desktop Category Slider */}
					<CategorySlider />

					{/* Search and Filters */}
					<div className="flex flex-col lg:flex-row gap-6">
						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsSidebarOpen(true)}
							className="lg:hidden flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm mb-4"
							title="Open filters"
						>
							<Filter size={20} />
							<span>Filters</span>
						</button>

						{/* Desktop Filters Sidebar */}
						<div className="hidden lg:block w-64 flex-shrink-0">
							<div className="bg-white rounded-xl p-4 shadow-sm sticky top-36 max-h-[calc(100vh-144px)] overflow-y-auto">
								<h3 className="font-semibold mb-6">Filters</h3>
								<div className="space-y-6">
									{/* Categories */}
									<div className="border-b pb-4">
										<h4 className="font-medium mb-3">Categories</h4>
										<div className="space-y-2">
											{categories.map((category) => (
												<label key={category.id} className="flex items-center gap-2">
													<input
														type="checkbox"
														className="rounded text-greenTheme"
														onChange={() => setSelectedCategory(category.id)}
														checked={selectedCategory === category.id}
													/>
													<span>{category.name}</span>
												</label>
											))}
										</div>
									</div>

									{/* Price Range */}
									<div className="border-b pb-4">
										<h4 className="font-medium mb-3">Price Range</h4>
										<div className="flex items-center gap-2">
											<input
												type="number"
												placeholder="Min"
												className="w-full px-3 py-1.5 rounded border"
												value={priceRange[0]}
												onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
											/>
											<span>-</span>
											<input
												type="number"
												placeholder="Max"
												className="w-full px-3 py-1.5 rounded border"
												value={priceRange[1]}
												onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
											/>
										</div>
									</div>

									{/* Colors */}
									<div className="border-b pb-4">
										<h4 className="font-medium mb-3">Colors</h4>
										<div className="grid grid-cols-2 gap-2">
											{['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'].map((color) => (
												<label key={color} className="flex items-center gap-2">
													<input type="checkbox" className="rounded text-greenTheme" />
													<span>{color}</span>
												</label>
											))}
										</div>
									</div>

									{/* Sizes */}
									<div className="pb-4">
										<h4 className="font-medium mb-3">Sizes</h4>
										<div className="grid grid-cols-3 gap-2">
											{['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
												<label key={size} className="flex items-center gap-2">
													<input type="checkbox" className="rounded text-greenTheme" />
													<span>{size}</span>
												</label>
											))}
										</div>
									</div>

									{/* Apply Filters Button */}
									<button
										className="w-full py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
									>
										Apply Filters
									</button>
								</div>
							</div>
						</div>


						{/* Main Content - Scrollable Area */}
						<div className="flex-1 overflow-y-auto mb-10">
							{/* Search Bar */}
							<div className="bg-white rounded-xl p-4 shadow-sm mb-6">
								<div className="flex items-center gap-4">
									<div className="relative flex-1">
										<input
											type="text"
											placeholder="Search products..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-greenTheme focus:border-transparent"
										/>
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => setViewMode('grid')}
											title="Grid view"
											className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid'
												? 'bg-greenTheme text-white shadow-lg'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
												}`}
										>
											<Grid size={20} />
										</button>
										<button
											onClick={() => setViewMode('list')}
											title="List view"
											className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list'
												? 'bg-greenTheme text-white shadow-lg'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
												}`}
										>
											<List size={20} />
										</button>
									</div>
								</div>
							</div>

							{/* Products Grid/List */}
							<div className={`
										grid gap-3 md:gap-6
										${viewMode === 'grid'
									? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
									: 'grid-cols-1'
								}
    `									}>
								{products.map((product) => (
									<div
										key={product.id}
										className={`
												bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300
												${viewMode === 'list' ? 'flex' : ''}
											`}
									>
										<div className={`
												relative
												${viewMode === 'list'
												? 'w-36 h-36 flex-shrink-0'
												: 'h-32 sm:h-40 md:h-48'
											}
               															`}>
											<Image
												src={product.image}
												alt={product.name}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
											<button
												className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-greenTheme hover:text-white"
												title="Add to favorites"
											>
												<Heart size={16} />
											</button>
										</div>

										<div className={`
													p-3 sm:p-4 flex flex-col flex-1
													${viewMode === 'list' ? 'flex-1' : ''}
												`}>
											<div className="flex items-center justify-between mb-2">
												<span className="px-2 py-0.5 bg-green-50 text-greenTheme text-xs sm:text-sm font-medium rounded-full">
													{product.category}
												</span>
											</div>

											<h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-900">
												{product.name}
											</h3>

											<p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
												{product.description.length > 20
													? `${product.description.substring(0, 60)}...`
													: product.description
												}
											</p>


											<div className="flex flex-col gap-2 mb-2">
												{/* Color variants */}
												<div className="flex items-center gap-1">
													{product.colors.map((color, index) => (
														<div
															key={index}
															className="w-4 h-4 rounded-full border border-gray-200"
															style={{ backgroundColor: color }}
															title={`Color variant ${index + 1}`}
														/>
													))}
												</div>

												{/* Size variants */}
												<div className="flex flex-wrap gap-1">
													{product.sizes.map((size, index) => (
														<span
															key={index}
															className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
														>
															{size}
														</span>
													))}
												</div>
											</div>


											<div className="mt-auto flex flex-col items-end gap-2">
												<span className="text-sm sm:text-base text-gray-900 whitespace-nowrap">
													{product.priceRange.lowest === product.priceRange.highest
														? `$${product.priceRange.lowest.toFixed(2)}`
														: `$${product.priceRange.lowest.toFixed(2)} - $${product.priceRange.highest.toFixed(2)}`
													}
												</span>

												<button
													onClick={() => {
														setSelectedProduct(product);
														setIsSidebarProductOpen(true);
													}}
													className="w-auto px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
													title={`View details for ${product.name}`}
												>
													View Details
												</button>

												{selectedProduct && (
													<ProductDetailsSidebar
														isOpen={isSidebarProductOpen}
														onClose={() => {
															setIsSidebarProductOpen(false);
															setSelectedProduct(null);
														}}
														product={selectedProduct}
													/>
												)}

											</div>

										</div>
									</div>
								))}
							</div>

						</div>

					</div>
				</div>
			</main>
		</div>
	);


}