import { Timestamp } from "firebase/firestore";

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
	last_loggedIn: Date;
	userTier: number;
	createdAt: Date;
    profileImage?: string;
	bio?:string;
};

type ProfileImage = {
	id: string;
	imageURL: string;
	userId: string;
	typeOfImage: string;
	createdAt: Date;
	updatedAt: Date;

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
	SearchUser,
	Post,
	PostData,
	AppUser,
	Contact,
	ContactSectionProps,
	AddressSetAs,
	Address,
	AddressSectionProps
}