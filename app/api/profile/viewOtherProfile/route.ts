import { NextResponse } from 'next/server';
import { ViewOtherProfileService } from '@/lib/profile/viewOtherProfile/ViewOtherProfileService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.replace('@', '');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const viewProfileService = ViewOtherProfileService.getInstance();
    const result = await viewProfileService.fetchUserProfile(username);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status as number });
    }

    return NextResponse.json(result);
}
