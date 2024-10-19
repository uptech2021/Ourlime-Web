import { SocialPosts, UserData } from '@/types/global';
import TimelinePosts from './filters/TimelinePosts';
import PhotosPosts from './filters/PhotosPosts';
import VideosPosts from './filters/VideosPosts';
import About from './filters/About';

export default function ProfilePosts({
	selectedPost,
	socialPosts,
	user,
}: {
	selectedPost: string;
	socialPosts: SocialPosts[];
	user: UserData | null;
}) {
	return (
		<div className="posts">
			{selectedPost === 'all' && <TimelinePosts timelinePosts={socialPosts} />}
			{selectedPost === 'photos' && <PhotosPosts socialPosts={socialPosts} />}
			{selectedPost === 'videos' && <VideosPosts socialPosts={socialPosts} />}
			{selectedPost === 'likes' && (
				<p className="text-center">Posts you have liked are not available.</p>
			)}
			{selectedPost === 'about' && <About />}
			{/* Other filters like sounds, files, etc. */}
		</div>
	);
}
