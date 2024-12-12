import { SocialPosts } from '@/types/global';
import AllPosts from './filteredPosts/AllPosts';
import PhotosPosts from './filteredPosts/PhotosPosts';
import VideosPosts from './filteredPosts/VideosPosts';
export default function Posts({
	selectedPost,
	socialPosts,
}: {
	selectedPost: string;
	socialPosts: SocialPosts[];
}) {
	return (
		<div className="posts">
			{selectedPost === 'all' && <AllPosts allPosts={socialPosts} />}

			{/* This has been removed because it doesn't make sense having filtering by text since text is mandatory */}
			{selectedPost === 'photos' && <PhotosPosts socialPosts={socialPosts} />}
			{selectedPost === 'videos' && <VideosPosts socialPosts={socialPosts} />}
			{selectedPost === 'sounds' && (
				<p className="text-center">There are no {selectedPost} available</p>
			)}
			{selectedPost === 'files' && (
				<p className="text-center">There are no {selectedPost} available</p>
			)}
			{selectedPost === 'locations' && (
				<p className="text-center">There are no {selectedPost} available</p>
			)}
		</div>
	);
}
