import { NextRequest, NextResponse } from 'next/server';
import { AddProductService } from '@/lib/profile/products/addProduct/AddProductService';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const userId = formData.get('userId') as string;
        const thumbnailImage = formData.get('thumbnailImage') as File;
        const productDataString = formData.get('productData') as string;
        const productData = JSON.parse(productDataString);
        const mediaFiles = formData.getAll('media') as File[];

        const productService = AddProductService.getInstance();
        const result = await productService.createProduct({
            userId,
            thumbnailImage,
            media: mediaFiles,
            ...productData
        });
        

        return NextResponse.json({
            status: 'success',
            data: {
                productId: result.productId,
                message: 'Product created successfully'
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to create product'
        }, { status: 500 });
    }
}
