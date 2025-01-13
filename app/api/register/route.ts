// app/api/register/route.ts

import { auth, db } from '@/config/firebase';
import { deleteUserRelatedData } from '@/helpers/dataDeletion';
import { uploadFile } from '@/helpers/firebaseStorage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

/**
 * Handles the registration of a new user
 * @returns {Promise<NextResponse>} - The response to the request
 */
export async function POST(request: Request) {
    const {
        email,
        password,
        firstName,
        lastName,
        userName,
        gender,
        birthday,
        country,
        phone,
        Address,
        city,
        postalCode,
        zipCode,
        profilePicture,
        selectedInterests,
        idFace,
        idFront,
        idBack,
    } = await request.json();

    let userId;

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        userId = user.uid;

        // Create user document
        await setDoc(doc(db, 'users', userId), {
            firstName,
            lastName,
            userName,
            email: user.email,
            gender,
            birthday,
            country,
            isAdmin: false,
            userTier: 1,
            isActive: true,
            last_loggedIn: new Date(),
            createdAt: new Date(),
        });

        // Create address document
        const addressRef = doc(collection(db, 'addresses'));
        await setDoc(addressRef, {
            userId,
            Address,
            city,
            postalCode,
            zipCode,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create profile image document
        const profileImageRef = doc(collection(db, 'profileImages'));
        console.log("Getting profile picture:", profilePicture)
        const imageURL = await uploadFile(
            new File(
                [await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/images/register/${profilePicture}`).then(res => res.blob())],
                profilePicture,
                { type: 'image/svg+xml' }
            ),
            `profiles/${userId}/${profilePicture}`
        );
        console.log(imageURL, 'IS IMAGE URL');

        await setDoc(profileImageRef, {
            imageURL,
            typeOfImage: 'image',
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create contact document
        const contactRef = doc(collection(db, 'contact'));
        await setDoc(contactRef, {
            userId,
            contactNumber: phone,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create interests documents
        const interestPromises = selectedInterests.map(interest =>
            setDoc(doc(collection(db, 'interests')), {
                interest,
                links: [],
                userId,
            })
        );
        await Promise.all(interestPromises);

        // Create authentication document
        const faceImageURL = await uploadFile(idFace, `authentication/${userId}/faceID`);
        const frontImageURL = await uploadFile(idFront, `authentication/${userId}/frontID`);
        const backImageURL = await uploadFile(idBack, `authentication/${userId}/backID`);

        await setDoc(doc(db, 'authentication', userId), {
            userId,
            proofOfId: faceImageURL,
            idFront: frontImageURL,
            idBack: backImageURL,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);

        // Rollback: Delete all documents associated with the userId
        if (userId) {
           deleteUserRelatedData(userId)
        }

        return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }
}