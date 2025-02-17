export interface Community {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    imageUrl: string;
    isPrivate: boolean;
    userId: string;
    createdAt: string;
    membershipCount: number;
    membershipLikes: number;
}

export interface CommunityMember {
    userId: string;
    communityVariantId: string;
    status: 'active' | 'pending' | 'blocked';
    role: 'admin' | 'moderator' | 'member';
    joinedAt: string;
}

export interface CommunityCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface CommunityPost {
    id: string;
    communityVariantId: string;
    userId: string;
    content: string;
    media?: string[];
    createdAt: string;
    updatedAt: string;
}
