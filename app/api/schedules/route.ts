// app/api/schedules/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const scheduleDoc = await getDoc(doc(db, 'schedules', userId));
        return NextResponse.json({
            schedules: scheduleDoc.exists() ? scheduleDoc.data().schedules : []
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId, schedules } = await request.json();

    if (!userId || !schedules) {
        return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    try {
        const docRef = doc(db, 'schedules', userId);
        const existingDoc = await getDoc(docRef);
        const existingSchedules = existingDoc.exists() ? existingDoc.data().schedules : [];

        await setDoc(docRef, {
            schedules: [...existingSchedules, ...schedules],
            updatedAt: serverTimestamp()
        }, { merge: true });

        return NextResponse.json({ 
            success: true,
            message: 'Schedules added successfully'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save schedules' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { userId, scheduleId, updatedSchedule } = await request.json();

    if (!userId || !scheduleId || !updatedSchedule) {
        return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    try {
        const docRef = doc(db, 'schedules', userId);
        const scheduleDoc = await getDoc(docRef);

        if (!scheduleDoc.exists()) {
            return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        }

        const schedules = scheduleDoc.data().schedules;
        const updatedSchedules = schedules.map((schedule: any) => 
            schedule.id === scheduleId ? { ...schedule, ...updatedSchedule } : schedule
        );

        await updateDoc(docRef, {
            schedules: updatedSchedules,
            updatedAt: serverTimestamp()
        });

        return NextResponse.json({ 
            success: true,
            message: 'Schedule updated successfully'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const scheduleId = searchParams.get('scheduleId');

    if (!userId || !scheduleId) {
        return NextResponse.json({ error: 'User ID and Schedule ID are required' }, { status: 400 });
    }

    try {
        const docRef = doc(db, 'schedules', userId);
        const scheduleDoc = await getDoc(docRef);

        if (!scheduleDoc.exists()) {
            return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        }

        const schedules = scheduleDoc.data().schedules;
        const updatedSchedules = schedules.filter((schedule: any) => schedule.id !== scheduleId);

        await updateDoc(docRef, {
            schedules: updatedSchedules,
            updatedAt: serverTimestamp()
        });

        return NextResponse.json({ 
            success: true,
            message: 'Schedule deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
    }
}
