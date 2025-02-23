import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, Firestore, getDoc, doc } from 'firebase/firestore';
import {
    Product,
    Colors,
    Sizes,
    ColorVariants,
    SizeVariants,
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

            const productOwnership = await this.getProductOwnership(
                products.map(p => p.id)
            );

            const colors = colorsSnapshot.docs.map((doc) => ({
                id: doc.id,
                colorName: doc.data().colorName,
                colorCode: doc.data().colorCode,
            })) as Colors[];

            const sizes = sizesSnapshot.docs.map((doc) => ({
                id: doc.id,
                sizeName: doc.data().sizeName,
                sizeCode: doc.data().sizeCode,
            })) as Sizes[];

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
            }) as ColorVariants[];

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
            }) as SizeVariants[];

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
                ownership: productOwnership,
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

    private async getProductOwnership(productIds: string[]) {
        const ownershipQuery = query(
            collection(this.db, 'ownership'),
            where('productId', 'in', productIds)
        );
        const ownershipSnapshot = await getDocs(ownershipQuery);
        
        const ownershipData = await Promise.all(
            ownershipSnapshot.docs.map(async (ownershipDoc) => {
                const ownership = ownershipDoc.data();
                console.log('Processing ownership:', ownership);
                
                if (ownership.sellerType === 'business') {
                    const businessDoc = await getDoc(doc(this.db, 'businesses', ownership.userId));
                    const businessData = businessDoc.data();
    
                    let profileImage = null;
                    
                    // Get profileImageSetAs first to determine which image to use
                    const companyProfileQuery = query(
                        collection(this.db, 'profileImageSetAs'),
                        where('userId', '==', ownership.userId),
                        where('setAs', '==', 'companyProfile')
                    );
                    
                    let profileSetAsSnapshot = await getDocs(companyProfileQuery);
                    
                    // If no company profile, try regular profile
                    if (profileSetAsSnapshot.empty) {
                        const regularProfileQuery = query(
                            collection(this.db, 'profileImageSetAs'),
                            where('userId', '==', ownership.userId),
                            where('setAs', '==', 'profile')
                        );
                        profileSetAsSnapshot = await getDocs(regularProfileQuery);
                    }
    
                    if (!profileSetAsSnapshot.empty) {
                        const setAsData = profileSetAsSnapshot.docs[0].data();
                        const imageDoc = await getDoc(doc(this.db, 'profileImages', setAsData.profileImageId));
                        if (imageDoc.exists()) {
                            profileImage = imageDoc.data().imageURL; // Note: using imageURL instead of imageUrl
                        }
                    }
    
                    const userDoc = await getDoc(doc(this.db, 'users', ownership.userId));
                    const userData = userDoc.data();
    
                    return {
                        id: ownershipDoc.id,
                        ...ownership,
                        businessDetails: businessData,
                        profileImage,
                        businessOwner: {
                            // name: `${userData?.firstName} ${userData?.lastName}`,
                            // email: userData?.email

                            name: "buisness owner name",
                            email: "buisness owner email"
                        }
                    };
                }
    
                return {
                    id: ownershipDoc.id,
                    ...ownership
                };
            })
        );
    
        return ownershipData;
    }
    
    
}
