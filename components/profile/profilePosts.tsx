import { SocialPosts, UserData, ProfileData } from '@/types/global';
import TimelinePosts from './filters/TimelinePosts';
import PhotosPosts from './filters/PhotosPosts';
import VideosPosts from './filters/VideosPosts';
import About from './filters/About';

interface ProfilePostsProps {
	selectedPost: string;
	socialPosts: SocialPosts[];
	user: UserData | null;
	onProfileUpdate: (updatedData: Partial<ProfileData>) => void;
	onUserDataUpdate: (updatedData: Partial<UserData>) => void;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
	selectedPost,
	socialPosts,
	user,
	onProfileUpdate,
	onUserDataUpdate,
}) => {
	return (
		<div className="posts">
			{selectedPost === 'all' && <TimelinePosts timelinePosts={socialPosts} />}
			{selectedPost === 'photos' && <PhotosPosts socialPosts={socialPosts} />}
			{selectedPost === 'videos' && <VideosPosts socialPosts={socialPosts} />}
			{selectedPost === 'likes' && (
				<p className="text-center">Posts you have liked are not available.</p>
			)}
			{selectedPost === 'about' && (
				<About 
					onProfileUpdate={onProfileUpdate}
					onUserDataUpdate={onUserDataUpdate}
				/>
			)}
			{/* Other filters like sounds, files, etc. */}
		</div>
	);
};

export default ProfilePosts;
