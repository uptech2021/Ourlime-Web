import { StaticImageData } from "next/image";

export type Metadata = {
  metadataBase: string;
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    url: string;
    title: string;
    description: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string; 
    }[];
    site_name: string;
  }
}

export type RootLayoutProps = {
  children: ReactElement;
  hideButton?: boolean;
}

export type Data = {
  month: string;
  users: number;
  posts: number;
  pages: number;
  groups: number;
  [key: string]: string | number; // Allow dynamic property access
}

export type SocialPosts = {
  uid?: string;
  username: string;
  email: string;
  profileImage: StaticImageData | string;
  postImage?: StaticImageData | string;
  video?: string;
  content: string;
  likes?: string; //TODO change to number
  comments?: string;
  time:string 
  ; //TODO change to Date.now or something similar
}

export type Stories = {
  id: string;
  username: string;
  description?: string;
  file: string;
  profilePicture: string;
} 

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  type: string;
  category: string;
  stock: number;
  imageUrl: StaticImageData;
}

export type Job = {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: StaticImageData;
}

export type ProfileData = {
  firstName: string;
  lastName: string;
  profilePicture: StaticImageData | string;
  banner: string;
  email: string;
  country: string;
  phone: string;
  aboutMe: string;
}

export type UserData  = {
	userName: string;
}