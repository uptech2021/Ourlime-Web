import { NextResponse } from 'next/server';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Handles user login
 * @returns {Promise<NextResponse>} - The response to the request
 */
export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the user is verified
        if (!user.emailVerified) {
            return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
        }

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });

    } catch (error: any) {
        console.error('Login error:', error);

        switch (error.code) {
            case 'auth/user-not-found':
                return NextResponse.json({ error: 'No user found with this email.' }, { status: 404 });
            case 'auth/wrong-password':
                return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
            case 'auth/invalid-email':
                return NextResponse.json({ error: 'The email address is not valid.' }, { status: 400 });
            case 'auth/user-disabled':
                return NextResponse.json({ error: 'This user account has been disabled.' }, { status: 403 });
            case 'auth/too-many-requests':
                return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
            default:
                return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
        }
    }
}