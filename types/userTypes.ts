import { Timestamp } from "firebase/firestore";
import { CommunityVariantDetailsSummary } from "./communityTypes";

type UserData = {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    gender: string;
    birthday: string;
    country: string;
    isAdmin: boolean;
    last_loggedIn: Timestamp;
    userTier: number;
    createdAt: Timestamp;
    bio?: string;
    profileImages?: {
        [key: string]: string; 
    };
    friendsCount?: number;
    postsCount?: number;
};


type ProfileImage = {
    id: string;
    imageURL: string;
    userId: string;
    typeOfImage: string;
    createdAt: Date;
    updatedAt: Date;
};

type ProfileImageSetAs = {
    id: string;
    userId: string;
    profileImageId: string;
    setAs: 'profile' | 'coverProfile' | 'postProfile' | 'jobProfile';
};

type SearchUser = {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	profileImage?: string;
};


type Post = {
	id: string; 
	caption: string;
	description: string;
	visibility: string;
	createdAt: Date;
	userId: string;
	hashtags: Array<string>;
	media: string;
	userReferences: Array<string>;
	user: {
		firstName: string;
		lastName: string;
		userName: string;
		profileImage?: string;
	};
};

type BasePost = {
    id: string;
    title: string; // Add title
    caption: string; // Add caption
    content: string; // Add content
    visibility: string; // Add visibility
    createdAt: Date; // Add createdAt
    userId: string; // Add userId
    hashtags: Array<string>; // Add hashtags
    media: string; // Add media
    author: { // Add author object
        id: string;
        firstName: string;
		lastName: string;
        avatar: string;
        role: string;
		profileImage?: string;
    };
    timestamp: Date; // Add timestamp
	mediaDetails : CommunityVariantDetailsSummary[];
};

type PostData = {
	userId: string;
	caption: string;
	description: string;
	createdAt: Date;
	visibility: string;
};


type AppUser = {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
	profileImage?: string;
}; 

type Contact = {
    id: string;
    contactNumber: string;
    createdAt: Date;
    isVerified: boolean;
    updatedAt: Date;
    userId: string;
    settings: Array<{
        id: string;
        contactId: string;
        setAs: string;
    }>;
}

type ContactSectionProps = {
    userData: UserData;
}

type AddressSetAs = {
    id: string;
    addressId: string;
    setAs: string;
}

type Address = {
    id: string;
    address: string;
    city: string;
    postalCode: string;
    zipCode: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    userId: string;
    settings: AddressSetAs[];
}

type AddressSectionProps = {
    userData: UserData;
}

export type {
	UserData, 
	ProfileImage,
	ProfileImageSetAs,
	SearchUser,
	Post,
	BasePost,
	PostData,
	AppUser,
	Contact,
	ContactSectionProps,
	AddressSetAs,
	Address,
	AddressSectionProps
}