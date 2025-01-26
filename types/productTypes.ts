export interface Product {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    thumbnailImage: string;
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
    name: string;
    hexCode: string;
}

export interface SizeVariant {
    id: string;
    name: string;
    measurement: string;
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


