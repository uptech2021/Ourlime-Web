// types/businessTypes.ts
export interface BusinessProfile {
    userId: string;
    businessName: string;
    description: string;
    established: string;
    location: string;
    contact: {
        email: string;
        phone: string;
        website?: string;
    };
    categories: string[];
    status: 'active' | 'inactive' | 'pending';
    createdAt: Date;
    updatedAt: Date;
}

export interface BusinessMetrics {
    totalProducts: number;
    totalSales: number;
    avgRating: number;
    responseRate: string;
    reviews: {
        total: number;
        positive: number;
        negative: number;
    };
}
