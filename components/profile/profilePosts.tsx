import { SocialPosts } from '@/types/global';
import TimelinePosts from './filters/TimelinePosts';
import PhotosPosts from './filters/PhotosPosts';
import VideosPosts from './filters/VideosPosts';
import About from './filters/About';

export default function ProfilePosts({
	selectedPost,
	socialPosts,
  }: {
	selectedPost: string;
	socialPosts: SocialPosts[];
  }) {
	return (
	  <div className="posts">
		{selectedPost === 'all' && <TimelinePosts timelinePosts={socialPosts} />}
		{selectedPost === 'photos' && <PhotosPosts socialPosts={socialPosts} />}
		{selectedPost === 'videos' && <VideosPosts socialPosts={socialPosts} />}
		{selectedPost === 'likes' && (
		  <p className="text-center">Posts you have liked are not available.</p>
		)}
		{selectedPost === 'about' && <About user={undefined} />}
		{/* Other filters like sounds, files, etc. */}
	  </div>
	);
  }
  