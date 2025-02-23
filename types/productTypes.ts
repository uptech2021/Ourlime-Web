import { Timestamp } from "firebase/firestore";

// types/productTypes.ts
export interface Product {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    thumbnailImage: string;
    category: string;
    createdAt: Timestamp;
    views?: string

}

export interface Colors {
    id: string;
    colorName: string;
}

export interface Sizes {
    id: string;
    sizeName: string;
}

export interface ColorVariants {
    id: string;
    colorVariantName: string;
    colorId: string;
    productId: string;
}

export interface SizeVariants {
    id: string;
    sizeVariantName: string;
    sizeId: string;
    productId: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    colorVariantId: string;
    sizeVariantId: string;
    price: number;
    quantity: number;
    status: 'active' | 'inactive';
}

export interface ProductFormData {
    title: string;
    category: string;
    shortDescription: string;
    longDescription: string;
    thumbnailImage?: File;
    media: File[];
    variants: ProductVariant[];
    colors: ColorVariants[];
    sizes: SizeVariants[];
    newColors: Colors[];
    newSizes: Sizes[];
    selectedBaseColor?: string;
    selectedBaseSize?: string;
}
