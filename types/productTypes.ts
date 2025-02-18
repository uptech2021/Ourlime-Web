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

export interface Color {
    id: string;
    colorName: string;
}

export interface Size {
    id: string;
    sizeName: string;
}

export interface ColorVariant {
    id: string;
    colorVariantName: string;
    colorId: string;
    productId: string;
}

export interface SizeVariant {
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
    colors: ColorVariant[];
    sizes: SizeVariant[];
    newColors: Color[];
    newSizes: Size[];
    selectedBaseColor?: string;
    selectedBaseSize?: string;
}
