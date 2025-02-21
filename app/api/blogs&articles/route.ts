import { NextRequest, NextResponse } from 'next/server';
import { BlogsAndArticlesService } from '@/lib/blogs&articles/BlogsAndArticlesService';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const blogsService = BlogsAndArticlesService.getInstance();
        
        // Calculate read time
        const wordsPerMinute = 200;
        const wordCount = data.content.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);

        // Process sources if provided
        const sources = data.sources?.map(source => ({
            ...source,
            publishDate: new Date(source.publishDate)
        }));

        const result = await blogsService.createPost({
            userId: data.userId,
            title: data.title,
            type: data.type,
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage,
            categoryId: data.categoryId,
            readTime,
            sources,
            tags: data.tags
        });

        return NextResponse.json({
            status: 'success',
            data: {
                postId: result.id,
                readTime,
                message: 'Post created with all associated collections'
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to create post'
        }, { status: 500 });
    }
}
