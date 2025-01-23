import { useState } from 'react';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { Smile, X, ImageIcon, Video, Upload, Hash, AtSign, Music, FileText, Link2, Calendar, BarChart, BookOpen, Users, Newspaper, TrendingUp, Star, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

type CreatePostProp = {
    setTogglePostForm: React.Dispatch<React.SetStateAction<boolean>>;
    profilePicture: string;
};

type MediaType = 'none' | 'image' | 'video' | 'document' | 'audio' | 'link';

export default function CreatePost({ setTogglePostForm, profilePicture }: CreatePostProp) {
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [hashtagInput, setHashtagInput] = useState('');
	const [selectedMediaTypes, setSelectedMediaTypes] = useState<Set<MediaType>>(new Set(['none' as MediaType]));
    const [mentions, setMentions] = useState<string[]>([]);
    const [mentionInput, setMentionInput] = useState('');

	const mediaTypes = [
		{ type: 'none', icon: X, accept: '' },
		{ type: 'image', icon: ImageIcon, accept: 'image/*' },
		{ type: 'video', icon: Video, accept: 'video/*' },
		{ type: 'audio', icon: Music, accept: 'audio/*' },
		{ type: 'document', icon: FileText, accept: '.pdf,.doc,.docx' },
		{ type: 'link', icon: Link2, accept: '' },
		{ type: 'events', icon: Calendar, accept: '' },
		{ type: 'polls', icon: BarChart, accept: '' },
		{ type: 'stories', icon: BookOpen, accept: '' },
		{ type: 'groups', icon: Users, accept: '' },
		{ type: 'blogs', icon: FileText, accept: '.md,.txt' },
		{ type: 'news', icon: Newspaper, accept: '' },
		{ type: 'trending', icon: TrendingUp, accept: '' },
		{ type: 'favorites', icon: Star, accept: '' },
		{ type: 'saved', icon: Bookmark, accept: '' }
	];
	

	const toggleMediaType = (type: MediaType) => {
		const newSelectedTypes = new Set(selectedMediaTypes) as Set<MediaType>;
		if (type === 'none') {
			setSelectedMediaTypes(new Set(['none' as MediaType]));
			setSelectedFiles([]);
			setPreviews([]);
		} else {
			newSelectedTypes.delete('none');
			if (newSelectedTypes.has(type)) {
				newSelectedTypes.delete(type);
				if (newSelectedTypes.size === 0) {
					newSelectedTypes.add('none');
				}
			} else {
				newSelectedTypes.add(type);
			}
			setSelectedMediaTypes(newSelectedTypes);
		}
	};
	

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(file => {
                const fileType = file.type.split('/')[0];
                return Array.from(selectedMediaTypes).some(type => 
                    type === fileType || 
                    (type === 'document' && file.type.includes('pdf'))
                );
            });

            setSelectedFiles(prev => [...prev, ...validFiles]);

            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleHashtagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const tag = hashtagInput.trim().replace(/^#/, '');
            if (tag && !hashtags.includes(tag)) {
                setHashtags([...hashtags, tag]);
                setHashtagInput('');
            }
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeHashtag = (tag: string) => {
        setHashtags(hashtags.filter(t => t !== tag));
    };

    const handlePost = async () => {
        if (!auth.currentUser) return;

        try {
            const postData = {
                caption,
                description,
                visibility,
                createdAt: new Date(),
                userId: auth.currentUser.uid,
                hashtags,
                userReferences: mentions,
                mediaTypes: Array.from(selectedMediaTypes)
            };

            const postRef = collection(db, 'feedPosts');
            const docRef = await addDoc(postRef, postData);

			if (selectedFiles.length > 0) {
				const uploadPromises = selectedFiles.map(async (file, index) => {
					const storageRef = ref(storage, `posts/${docRef.id}/${file.name}`);
					const uploadResult = await uploadBytes(storageRef, file);
					const downloadURL = await getDownloadURL(uploadResult.ref);
			
					return addDoc(collection(db, 'feedsPostSummary'), {
						type: file.type.split('/')[0],
						typeUrl: downloadURL,
						feedsPostId: docRef.id,
						fileType: file.type,
						createdAt: new Date(),
						displayOrder: index // Add this field
					});
				});
			
				await Promise.all(uploadPromises);
			}
			

            setCaption('');
            setDescription('');
            setSelectedFiles([]);
            setPreviews([]);
            setHashtags([]);
            setMentions([]);
            setVisibility('public');
			setSelectedMediaTypes(new Set(['none' as MediaType]));
            setTogglePostForm(false);

        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

	return (
		<div 
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
			onClick={() => setTogglePostForm(false)}
		>
			<div 
				className="bg-white rounded-xl w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl lg:max-w-3xl h-[90vh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="p-4 border-b flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar
							src={profilePicture}
							alt="Profile"
							className="h-10 w-10"
							showFallback
							fallback={<Skeleton className="h-10 w-10 rounded-full" />}
						/>
						<div>
							<h3 className="font-semibold">Create Post</h3>
							<select
								value={visibility}
								onChange={(e) => setVisibility(e.target.value)}
								className="text-sm text-gray-600 bg-transparent focus:outline-none"
								title='Visibility'
							>
								<option value="public">🌎 Public</option>
								<option value="friends">👥 Friends</option>
								<option value="private">🔒 Private</option>
							</select>
						</div>
					</div>
					<button
						onClick={() => setTogglePostForm(false)}
						className="p-1.5 hover:bg-gray-100 rounded-full"
						title='Close'
					>
						<X size={18} />
					</button>
				</div>
	
				{/* Content */}
				<div className="flex-1 overflow-y-auto p-4">
					<div className="space-y-4">
						{/* Text Inputs */}
						<input
							type="text"
							placeholder="Add a caption..."
							className="w-full text-xl font-medium placeholder:text-gray-400 focus:outline-none"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
						/>
						<textarea
							placeholder="Write a detailed description..."
							className="w-full h-32 resize-none focus:outline-none text-gray-600"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
	
						{/* Media Type Selection */}
						<div className="flex flex-wrap gap-2">
							{mediaTypes.map(({ type, icon: Icon }) => (
								<button
									key={type}
									onClick={() => toggleMediaType(type as MediaType)}
									className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
										selectedMediaTypes.has(type as MediaType)
										? 'bg-greenTheme text-white' 
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									<Icon size={18} />
									<span className="capitalize">{type}</span>
								</button>
							))}
						</div>
	
						{/* Upload Area */}
						{!selectedMediaTypes.has('none') && (
							<div className="border-2 border-dashed rounded-lg p-6 text-center">
								<input
									type="file"
									multiple
									accept={Array.from(selectedMediaTypes)
										.map(type => mediaTypes.find(m => m.type === type)?.accept || '')
										.filter(Boolean)
										.join(',')}
									onChange={handleFileSelect}
									className="hidden"
									id="file-upload"
								/>
								<label htmlFor="file-upload" className="cursor-pointer">
									<Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
									<p className="text-gray-600">Drag and drop or click to upload</p>
									<span className="text-greenTheme text-sm">
										Selected types: {Array.from(selectedMediaTypes).join(', ')}
									</span>
								</label>
							</div>
						)}
	
						{/* Media Previews */}
						{previews.length > 0 && (
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
								{previews.map((preview, index) => (
									<div key={index} className="relative group aspect-square">
										<Image
											src={preview}
											alt={`Preview ${index + 1}`}
											fill
											className="rounded-lg object-cover"
										/>
										<button
											onClick={() => removeFile(index)}
											className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
											title='Remove'
										>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						)}
	
						{/* Hashtags */}
						<div>
							<div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
								<Hash className="text-greenTheme" />
								<input
									type="text"
									value={hashtagInput}
									onChange={(e) => setHashtagInput(e.target.value)}
									onKeyDown={handleHashtagInput}
									placeholder="Add hashtags (press Enter)"
									className="bg-transparent focus:outline-none flex-1"
								/>
							</div>
							{hashtags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{hashtags.map(tag => (
										<span
											key={tag}
											className="px-3 py-1 bg-green-50 text-greenTheme rounded-full text-sm flex items-center gap-2"
										>
											#{tag}
											<button 
												onClick={() => removeHashtag(tag)}
												className="hover:text-red-500 transition-colors"
												title="Remove hashtag"
											>
												<X size={12} />
											</button>
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
	
				{/* Footer */}
				<div className="border-t p-4 flex items-center justify-between">
					<button className="text-gray-600 hover:text-greenTheme transition-colors"
					title='smile'
					>
						<Smile size={24} />
					</button>
					<Button
						onClick={handlePost}
						className="px-6 py-2 bg-greenTheme text-white rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
						disabled={!caption.trim()}
					>
						Create Post
					</Button>
				</div>
			</div>
		</div>
	);
}
	
