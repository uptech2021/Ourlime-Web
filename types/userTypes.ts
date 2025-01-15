export type UserData = {
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
};

export type ProfileImage = {
	id: string;
	imageURL: string;
	userId: string;
	typeOfImage: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SearchUser = {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	profileImage?: string;
};

export type Post = {
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

export type PostData = {
	userId: string;
	caption: string;
	description: string;
	createdAt: Date;
	visibility: string;
};

export type AppUser = {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
	profileImage?: string;
}; 