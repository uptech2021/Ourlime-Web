// app/api/market/search_and_filter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MarketService } from '@/lib/services/MarketService';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        
        const minPrice = parseInt(searchParams.get('minPrice') || '0');
        const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
        
        const filters = {
            categories: searchParams.getAll('categories'),
            colors: searchParams.getAll('colors'),
            sizes: searchParams.getAll('sizes'),
            priceRange: [minPrice, maxPrice] as [number, number],
            searchTerm: searchParams.get('q') || '',
            sortBy: searchParams.get('sortBy') || 'default'
        };

        const marketService = MarketService.getInstance();
        const data = await marketService.filterProducts(filters);
        
        return NextResponse.json({
            status: 'success',
            data: data,
            appliedFilters: filters
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to filter products'
        }, { status: 500 });
    }
}
