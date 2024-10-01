import { Product } from '@/types/global';
import AllProducts from './filteredProducts/AllProducts';
import AutoProducts from './filteredProducts/AutoProducts';
import BabyProducts from './filteredProducts/BabyProducts';

export default function Products({
	selectedProduct,
	products,
}: {
	selectedProduct: string;
	products: Product[];
}) {
	return (
		<div className="products">
			{selectedProduct === 'Autos & Vehicles' && (
				<AutoProducts products={products} />
			)}
			{selectedProduct === "Baby & Children's Products" && (
				<BabyProducts products={products} />
			)}
			{selectedProduct === 'Beauty Products & Services' && (
				<p className="text-center">
					There are no {selectedProduct} products available
				</p>
			)}
			{selectedProduct === 'Computers & Peripherals' && (
				<p className="text-center">
					There are no {selectedProduct} products available
				</p>
			)}
			{selectedProduct === 'Consumer Electronics' && (
				<p className="text-center">
					There are no {selectedProduct} products available
				</p>
			)}
			{selectedProduct === 'Other' && (
				<p className="text-center">
					There are no {selectedProduct} products available
				</p>
			)}
			{selectedProduct === 'All Products' && (
				<AllProducts allProducts={products} />
			)}
		</div>
	);
}
