// app/api/market/search/route.ts
import { db } from '@/lib/firebaseConfig';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductVariant, ColorVariant, SizeVariant } from '@/types/productTypes';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const searchQuery = searchParams.get('q');
        const sortBy = searchParams.get('sort');
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const colors = searchParams.getAll('colors');
        const sizes = searchParams.getAll('sizes');

        let productsQuery = query(collection(db, 'products'));
        let variantsQuery = query(collection(db, 'variants'));

        if (searchQuery) {
            productsQuery = query(
                collection(db, 'products'),
                where('searchTerms', 'array-contains', searchQuery.toLowerCase())
            );
        }

        if (category && category !== 'all') {
            productsQuery = query(
                collection(db, 'products'),
                where('category', '==', category)
            );
        }

        const productsSnapshot = await getDocs(productsQuery);
        let products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];

        const variantsSnapshot = await getDocs(variantsQuery);
        const variants = variantsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ProductVariant[];

        if (minPrice || maxPrice) {
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;

            const productIdsWithinPriceRange = variants
                .filter(variant => variant.price >= min && variant.price <= max)
                .map(variant => variant.productId);

            products = products.filter(product => 
                productIdsWithinPriceRange.includes(product.id)
            );
        }

        if (colors.length > 0) {
            const colorVariantsSnapshot = await getDocs(
                query(collection(db, 'colorVariants'))
            );
            const colorVariants = colorVariantsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ColorVariant[];

            const productIdsWithColors = colorVariants
                .filter(cv => colors.includes(cv.colorId))
                .map(cv => cv.productId);

            products = products.filter(product => 
                productIdsWithColors.includes(product.id)
            );
        }

        if (sizes.length > 0) {
            const sizeVariantsSnapshot = await getDocs(
                query(collection(db, 'sizeVariants'))
            );
            const sizeVariants = sizeVariantsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SizeVariant[];

            const productIdsWithSizes = sizeVariants
                .filter(sv => sizes.includes(sv.sizeId))
                .map(sv => sv.productId);

            products = products.filter(product => 
                productIdsWithSizes.includes(product.id)
            );
        }

        if (sortBy) {
            switch (sortBy) {
                case 'price-asc':
                    products.sort((a, b) => {
                        const aMinPrice = Math.min(...variants
                            .filter(v => v.productId === a.id)
                            .map(v => v.price));
                        const bMinPrice = Math.min(...variants
                            .filter(v => v.productId === b.id)
                            .map(v => v.price));
                        return aMinPrice - bMinPrice;
                    });
                    break;
                case 'price-desc':
                    products.sort((a, b) => {
                        const aMaxPrice = Math.max(...variants
                            .filter(v => v.productId === a.id)
                            .map(v => v.price));
                        const bMaxPrice = Math.max(...variants
                            .filter(v => v.productId === b.id)
                            .map(v => v.price));
                        return bMaxPrice - aMaxPrice;
                    });
                    break;
                case 'newest':
                    products.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                    break;
                case 'popular':
                    products.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
                    break;
            }
        }

        return NextResponse.json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to perform search'
        }, { status: 500 });
    }
}
