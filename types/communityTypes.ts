export type CommunityVariantDetailsSummary = {
    id: string; // Document ID
    type: string; // Type of the media (e.g., 'image', 'video')
    typeUrl: string; // URL of the media
    communityVariantDetailsId: string; // Reference to the associated post
};

export type Community = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isPrivate: boolean;
    userId: string;
    categoryId: string;
    bannerImageUrl: string;
    membershipCount: number;
    membershipLikes: number;
    topMembers: string[];
    creatorProfileImage?: string | null;
    creatorName: string;
    isMember: boolean;
    requestStatus: string;
    createdAt: Date;
  }