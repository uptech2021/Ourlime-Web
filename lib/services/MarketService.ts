import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, Firestore } from 'firebase/firestore';
import {
    Product,
    Color,
    Size,
    ColorVariant,
    SizeVariant,
    ProductVariant,
} from '@/types/productTypes';

export class MarketService {
    private static instance: MarketService;
    private readonly db: Firestore;

    private constructor() {
        this.db = db;
    }

    public static getInstance(): MarketService {
        if (!MarketService.instance) {
            MarketService.instance = new MarketService();
        }
        return MarketService.instance;
    }

    public async getBaseData() {
        try {
            const [
                productsSnapshot,
                colorsSnapshot,
                sizesSnapshot,
                colorVariantsSnapshot,
                sizeVariantsSnapshot,
                variantsSnapshot,
                subImagesSnapshot,
            ] = await Promise.all([
                getDocs(collection(db, 'products')),
                getDocs(collection(db, 'colors')),
                getDocs(collection(db, 'sizes')),
                getDocs(collection(db, 'colorVariants')),
                getDocs(collection(db, 'sizeVariants')),
                getDocs(collection(db, 'variants')),
                getDocs(collection(db, 'subImages')),
            ]);

            const products = productsSnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                category: doc.data().category,
                shortDescription: doc.data().shortDescription,
                longDescription: doc.data().longDescription,
                thumbnailImage: doc.data().thumbnailImage,
                images: doc.data().images || [],
                status: doc.data().status || 'active',
                createdAt: doc.data().createdAt,
                updatedAt: doc.data().updatedAt,
            })) as Product[];

            const colors = colorsSnapshot.docs.map((doc) => ({
                id: doc.id,
                colorName: doc.data().colorName,
                colorCode: doc.data().colorCode,
            })) as Color[];

            const sizes = sizesSnapshot.docs.map((doc) => ({
                id: doc.id,
                sizeName: doc.data().sizeName,
                sizeCode: doc.data().sizeCode,
            })) as Size[];

            const colorVariants = colorVariantsSnapshot.docs.map((doc) => {
                const variantData = doc.data();
                return {
                    id: doc.id,
                    colorVariantName: variantData.colorVariantName,
                    productId: variantData.productId,
                    colorId: variantData.colorsId,
                    status: variantData.status || 'active',
                    createdAt: variantData.createdAt,
                    updatedAt: variantData.updatedAt,
                };
            }) as ColorVariant[];

            const sizeVariants = sizeVariantsSnapshot.docs.map((doc) => {
                const variantData = doc.data();
                return {
                    id: doc.id,
                    sizeVariantName: variantData.sizeVariantName,
                    productId: variantData.productId,
                    sizeId: variantData.sizeId,
                    status: variantData.status || 'active',
                    createdAt: variantData.createdAt,
                    updatedAt: variantData.updatedAt,
                };
            }) as SizeVariant[];

            const subImages = subImagesSnapshot.docs.map((doc) => ({
                id: doc.id,
                productId: doc.data().productId,
                imageName: doc.data().imageName,
            }));

            const variants = variantsSnapshot.docs.map((doc) => ({
                id: doc.id,
                productId: doc.data().productId,
                price: doc.data().price,
                quantity: doc.data().quantity || 0,
                colorVariantId: doc.data().colorVariantId,
                sizeVariantId: doc.data().sizeVariantId,
                status: doc.data().status || 'active',
                createdAt: doc.data().createdAt,
                updatedAt: doc.data().updatedAt,
            })) as ProductVariant[];

            const baseData = {
                products,
                categories: Array.from(
                    new Set(products.map((product) => product.category))
                ),
                colors,
                sizes,
                colorVariants,
                sizeVariants,
                variants,
                subImages,
            };

            return { success: true, data: baseData };
        } catch (error) {
            console.error('Market service error:', error);
            throw new Error('Failed to fetch market data');
        }
    }

    public async filterProducts(filters: {
        categories?: string[];
        colors?: string[];
        sizes?: string[];
        priceRange?: [number, number];
        searchTerm?: string;
    }) {
        try {
            const baseData = await this.getBaseData();
            let filteredProducts = [...baseData.data.products];

            // Category filtering
            if (filters.categories?.length) {
                filteredProducts = filteredProducts.filter((product) =>
                    filters.categories?.includes(product.category)
                );
            }

            // Color filtering
            if (filters.colors?.length) {
                const productIdsWithColor = baseData.data.colorVariants
                    .filter(cv => filters.colors?.includes(cv.colorId))
                    .map(cv => cv.productId);
                
                filteredProducts = filteredProducts.filter(product => 
                    productIdsWithColor.includes(product.id)
                );
            }

            // Size filtering
            if (filters.sizes?.length) {
                const productIdsWithSize = baseData.data.sizeVariants
                    .filter(sv => filters.sizes?.includes(sv.sizeId))
                    .map(sv => sv.productId);
                
                filteredProducts = filteredProducts.filter(product => 
                    productIdsWithSize.includes(product.id)
                );
            }

            // Price range filtering
            if (filters.priceRange) {
                const [minPrice, maxPrice] = filters.priceRange;
                filteredProducts = filteredProducts.filter((product) => {
                    const productVariants = baseData.data.variants.filter(
                        (v) => v.productId === product.id
                    );
                    return productVariants.some(
                        (v) => v.price >= minPrice && v.price <= maxPrice
                    );
                });
            }

            // Search term filtering
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                filteredProducts = filteredProducts.filter(
                    (product) =>
                        product.title.toLowerCase().includes(searchLower) ||
                        product.shortDescription.toLowerCase().includes(searchLower) ||
                        product.category.toLowerCase().includes(searchLower)
                );
            }

            return {
                success: true,
                data: {
                    ...baseData.data,
                    products: filteredProducts,
                },
            };
        } catch (error) {
            console.error('Filter service error:', error);
            throw new Error('Failed to filter products');
        }
    }
}
