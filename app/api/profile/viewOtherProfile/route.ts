import { NextResponse } from 'next/server';
import { ViewOtherProfileService } from '@/lib/profile/viewOtherProfile/ViewOtherProfileService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.replace('@', '');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const viewProfileService = ViewOtherProfileService.getInstance();
    
    try {
        const result = await viewProfileService.fetchUserProfile(username);

        if ('error' in result) {
            return NextResponse.redirect(new URL('/404', request.url));
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.redirect(new URL('/404', request.url));
    }
}
