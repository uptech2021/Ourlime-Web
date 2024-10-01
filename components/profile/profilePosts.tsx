import { SocialPosts } from '@/types/global';
import TimelinePosts from './filteredPosts/TimelinePosts';
import PhotosPosts from './filteredPosts/PhotosPosts';
import VideosPosts from './filteredPosts/VideosPosts';

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
		{/* Other filters like sounds, files, etc. */}
	  </div>
	);
  }
  