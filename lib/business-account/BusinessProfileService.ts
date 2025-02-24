// lib/business-account/BusinessProfileService.ts
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, where, query, getDocs } from 'firebase/firestore';
import { BusinessProfile } from '@/types/businessTypes';
import { db } from '../firebaseConfig';

export class BusinessProfileService {
    private static instance: BusinessProfileService;
    private readonly db;

    private constructor() {
        this.db = db;
    }

    public static getInstance(): BusinessProfileService {
        if (!BusinessProfileService.instance) {
            BusinessProfileService.instance = new BusinessProfileService();
        }
        return BusinessProfileService.instance;
    }

    public async getProfile(userId: string): Promise<BusinessProfile | null> {
        try {
            // Check if document exists in businesses collection with this userId field
            const businessQuery = query(
                collection(this.db, 'businesses'),
                where('userId', '==', userId)
            );
            const querySnapshot = await getDocs(businessQuery);
            
            return !querySnapshot.empty ? querySnapshot.docs[0].data() as BusinessProfile : null;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    public async createProfile(profile: Omit<BusinessProfile, 'createdAt' | 'updatedAt' | 'status'>): Promise<void> {
        try {
            await setDoc(doc(this.db, 'businesses', profile.userId), {
                ...profile,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'active'
            });
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    }

    public async updateProfile(userId: string, updates: Partial<BusinessProfile>): Promise<void> {
        try {
            await updateDoc(doc(this.db, 'businesses', userId), {
                ...updates,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    public async deleteProfile(userId: string): Promise<void> {
        try {
            await deleteDoc(doc(this.db, 'businesses', userId));
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }
}