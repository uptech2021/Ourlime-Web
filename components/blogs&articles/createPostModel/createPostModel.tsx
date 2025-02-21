'use client';

import { useState } from 'react';
import { BookOpen, FileText, Image, Save, Send, Upload, X, Plus, Trash2 } from 'lucide-react';
import { Modal, ModalContent, Button, Input } from "@nextui-org/react";
import { auth, storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Source {
    title: string;
    url: string;
    author: string;
    publishDate: string;
    type: string;
    citation: string;
    isVerified: boolean;
}

interface CreatePostForm {
    title: string;
    type: 'blog' | 'article';
    excerpt: string;
    content: string;
    categoryId: string;
    coverImage: File | null;
    sources: Source[];
    tags: string[];
}

const categories = [
    { id: 'tech', name: 'Technology' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'development', name: 'Development' }
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreatePostForm>({
        title: '',
        type: 'blog',
        excerpt: '',
        content: '',
        categoryId: '',
        coverImage: null,
        sources: [],
        tags: []
    });
    const [currentTag, setCurrentTag] = useState('');
    const [currentSource, setCurrentSource] = useState<Source>({
        title: '',
        url: '',
        author: '',
        publishDate: '',
        type: '',
        citation: '',
        isVerified: false
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setFormData({ ...formData, coverImage: file });
        }
    };

    const handleAddTag = () => {
        if (currentTag && !formData.tags.includes(currentTag)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, currentTag]
            });
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleAddSource = () => {
        if (currentSource.title && currentSource.url) {
            setFormData({
                ...formData,
                sources: [...formData.sources, currentSource]
            });
            setCurrentSource({
                title: '',
                url: '',
                author: '',
                publishDate: '',
                type: '',
                citation: '',
                isVerified: false
            });
        }
    };

    const handleRemoveSource = (index: number) => {
        setFormData({
            ...formData,
            sources: formData.sources.filter((_, i) => i !== index)
        });
    };

    const handleCreatePost = async () => {
        try {
            setIsSubmitting(true);
            const userId = auth.currentUser?.uid;
            if (!userId || !formData.coverImage) {
                toast.error('Please fill in all required fields');
                return;
            }

            const imageRef = ref(storage, `blogsAndArticles/${Date.now()}_${formData.coverImage.name}`);
            const uploadResult = await uploadBytes(imageRef, formData.coverImage);
            const imageUrl = await getDownloadURL(uploadResult.ref);

            const response = await fetch('/api/blogs&articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    title: formData.title,
                    type: formData.type,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    coverImage: imageUrl,
                    categoryId: formData.categoryId,
                    sources: formData.sources,
                    tags: formData.tags
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                toast.success('Post created successfully!');
                onClose();
                resetForm();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            type: 'blog',
            excerpt: '',
            content: '',
            categoryId: '',
            coverImage: null,
            sources: [],
            tags: []
        });
        setCurrentTag('');
        setCurrentSource({
            title: '',
            url: '',
            author: '',
            publishDate: '',
            type: '',
            citation: '',
            isVerified: false
        });
    };

    const validateForm = () => {
        return formData.title &&
            formData.excerpt &&
            formData.content &&
            formData.categoryId &&
            formData.coverImage;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            scrollBehavior="inside"
            aria-labelledby="create-post-modal"
        >
            <ModalContent>
                <div className="bg-white rounded-xl shadow-xl">
                    {/* Header */}
                    <div className="relative border-b">
                        <div className="px-6 py-4">
                            <h2 id="create-post-modal" className="text-xl font-semibold text-gray-900">Create New Post</h2>
                            <p className="mt-1 text-sm text-gray-500">Share your insights with the community</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                            title="Close modal"
                        >
                            <X size={20} />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 space-y-6">
                        {/* Type Selection */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, type: 'blog' })}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all ${formData.type === 'blog'
                                        ? 'border-greenTheme bg-greenTheme/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                title="Select blog post type"
                            >
                                <BookOpen className="mx-auto mb-2" />
                                <p className="text-center font-medium">Blog Post</p>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, type: 'article' })}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all ${formData.type === 'article'
                                        ? 'border-greenTheme bg-greenTheme/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                title="Select article type"
                            >
                                <FileText className="mx-auto mb-2" />
                                <p className="text-center font-medium">Article</p>
                            </button>
                        </div>

                        {/* Main Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                        placeholder="Enter your post title"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        id="category"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                        title="Select post category"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags Section */}
                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                                    <div className="mt-1 flex gap-2">
                                        <input
                                            id="tags"
                                            type="text"
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                            placeholder="Add tags"
                                        />
                                        <Button
                                            onClick={handleAddTag}
                                            title="Add tag"
                                            className="bg-greenTheme text-white"
                                        >
                                            <Plus size={20} />
                                            <span className="sr-only">Add tag</span>
                                        </Button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                    title={`Remove ${tag} tag`}
                                                >
                                                    <X size={14} />
                                                    <span className="sr-only">Remove {tag}</span>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Sources Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-700">Sources</h3>
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <label htmlFor="source-title" className="block text-sm font-medium text-gray-700">Source Title</label>
                                            <input
                                                id="source-title"
                                                type="text"
                                                value={currentSource.title}
                                                onChange={(e) => setCurrentSource({ ...currentSource, title: e.target.value })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                                placeholder="Enter source title"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="source-url" className="block text-sm font-medium text-gray-700">URL</label>
                                            <input
                                                id="source-url"
                                                type="url"
                                                value={currentSource.url}
                                                onChange={(e) => setCurrentSource({ ...currentSource, url: e.target.value })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="source-author" className="block text-sm font-medium text-gray-700">Author</label>
                                            <input
                                                id="source-author"
                                                type="text"
                                                value={currentSource.author}
                                                onChange={(e) => setCurrentSource({ ...currentSource, author: e.target.value })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                                placeholder="Author name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="source-date" className="block text-sm font-medium text-gray-700">Publish Date</label>
                                            <input
                                                id="source-date"
                                                type="date"
                                                value={currentSource.publishDate}
                                                onChange={(e) => setCurrentSource({ ...currentSource, publishDate: e.target.value })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="source-citation" className="block text-sm font-medium text-gray-700">Citation</label>
                                            <textarea
                                                id="source-citation"
                                                value={currentSource.citation}
                                                onChange={(e) => setCurrentSource({ ...currentSource, citation: e.target.value })}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                                rows={2}
                                                placeholder="Enter citation details"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                id="source-verified"
                                                type="checkbox"
                                                checked={currentSource.isVerified}
                                                onChange={(e) => setCurrentSource({ ...currentSource, isVerified: e.target.checked })}
                                                className="rounded border-gray-300 text-greenTheme focus:ring-greenTheme"
                                            />
                                            <label htmlFor="source-verified" className="text-sm text-gray-700">Verified Source</label>
                                        </div>

                                        <Button
                                            onClick={handleAddSource}
                                            className="w-full bg-greenTheme text-white"
                                            title="Add source"
                                        >
                                            <Plus size={20} />
                                            <span>Add Source</span>
                                        </Button>
                                    </div>

                                    {/* Sources List */}
                                    <div className="space-y-2">
                                        {formData.sources.map((source, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-white border rounded-lg flex justify-between items-center hover:border-greenTheme transition-colors"
                                            >
                                                <div>
                                                    <p className="font-medium">{source.title}</p>
                                                    <p className="text-sm text-gray-600">by {source.author}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveSource(index)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title={`Remove ${source.title}`}
                                                >
                                                    <Trash2 size={18} />
                                                    <span className="sr-only">Remove {source.title}</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-6">
                                {/* Cover Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                        <div className="space-y-1 text-center">
                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="cover-image"
                                                    className="relative cursor-pointer rounded-md font-medium text-greenTheme hover:text-green-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="cover-image"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        title="Upload cover image"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Fields */}
                                <div>
                                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
                                    <textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                        rows={3}
                                        placeholder="Write a brief excerpt..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                                    <textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greenTheme focus:ring-greenTheme"
                                        rows={8}
                                        placeholder="Write your post content..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                        <Button
                            color="danger"
                            variant="light"
                            onClick={onClose}
                            disabled={isSubmitting}
                            title="Cancel post creation"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreatePost}
                            disabled={!validateForm() || isSubmitting}
                            className="bg-greenTheme text-white"
                            title="Create post"
                        >
                            {isSubmitting ? (
                                <>
                                    <Save className="animate-spin" size={20} />
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Publish Post</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    );

}
