import { db } from '@/lib/firebaseConfig';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    getDoc, 
    doc,
    addDoc, 
    updateDoc, 
    deleteDoc, 
    orderBy,
    Firestore,
    limit,
    Timestamp
} from 'firebase/firestore';

export class JobsService {
    private static instance: JobsService;
    private readonly db: Firestore;

    private constructor() {
        this.db = db;
    }

    public static getInstance(): JobsService {
        if (!JobsService.instance) {
            JobsService.instance = new JobsService();
        }
        return JobsService.instance;
    }

    public async createJob(jobData: any) {
        try {
            // Create main job document
            const jobRef = await addDoc(collection(this.db, 'jobs'), {
                basic_info: {
                    title: jobData.jobTitle,
                    description: jobData.jobDescription,
                    type: jobData.jobCategory,
                    status: 'active',
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    userId: jobData.userId,
                    priceRange: {
                        from: jobData.priceRange.from,
                        to: jobData.priceRange.to
                    },
                    location: jobData.location
                },
                details: {
                    skills: jobData.skills || [],
                    requirements: jobData.requirements || [],
                    qualifications: jobData.qualifications || []
                },
                category_specific: {
                    ...(jobData.jobCategory === 'professional' && {
                        name: jobData.companyDetails.name,
                        size: jobData.companyDetails.size,
                        industry: jobData.companyDetails.industry,
                        benefits: jobData.companyDetails.benefits || []
                    }),
                    ...(jobData.jobCategory === 'freelancer' && jobData.projectDetails),
                    ...(jobData.jobCategory === 'quickTask' && jobData.taskDetails)
                }
            });
    
            // Create questions subcollection
            if (jobData.questions && jobData.questions.length > 0) {
                const questionsCollection = collection(jobRef, 'questions');
                await Promise.all(jobData.questions.map(async (question: any) => {
                    await addDoc(questionsCollection, {
                        question: question.question,
                        type: question.answerType,
                        options: question.answerType !== 'input' ? question.options : []
                    });
                }));
            }
    
            return jobRef.id;
        } catch (error) {
            throw new Error('Failed to create job');
        }
    }

    public async fetchJobs() {
        try {
            const jobsQuery = query(
                collection(this.db, 'jobs'),
                orderBy('basic_info.createdAt', 'desc')
            );
    
            const jobsSnapshot = await getDocs(jobsQuery);
            const jobs = await Promise.all(jobsSnapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                const userRef = doc(this.db, 'users', data.basic_info.userId);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
    
                // Fetch questions from subcollection
                const questionsSnapshot = await getDocs(collection(docSnapshot.ref, 'questions'));
                const questions = questionsSnapshot.docs.map(qDoc => ({
                    id: qDoc.id,
                    ...qDoc.data()
                }));
    
                // Fetch profile images
                const profileImagesQuery = query(
                    collection(this.db, 'profileImages'),
                    where('userId', '==', data.basic_info.userId)
                );
                const profileSetAsQuery = query(
                    collection(this.db, 'profileImageSetAs'),
                    where('userId', '==', data.basic_info.userId)
                );
    
                const [profileImagesSnapshot, setAsSnapshot] = await Promise.all([
                    getDocs(profileImagesQuery),
                    getDocs(profileSetAsQuery)
                ]);
    
                // Get profile image URL with priority
                let profileImageUrl = '/default-avatar.png';
                const jobProfileSetAs = setAsSnapshot.docs.find(doc => doc.data().setAs === 'jobProfile');
                const regularProfileSetAs = setAsSnapshot.docs.find(doc => doc.data().setAs === 'profile');
    
                if (jobProfileSetAs) {
                    const matchingImage = profileImagesSnapshot.docs.find(img => img.id === jobProfileSetAs.data().profileImageId);
                    profileImageUrl = matchingImage?.data()?.imageURL || profileImageUrl;
                } else if (regularProfileSetAs) {
                    const matchingImage = profileImagesSnapshot.docs.find(img => img.id === regularProfileSetAs.data().profileImageId);
                    profileImageUrl = matchingImage?.data()?.imageURL || profileImageUrl;
                }
    
                return {
                    id: docSnapshot.id,
                    basic_info: data.basic_info,
                    details: data.details,
                    category_specific: data.category_specific,
                    questions,
                    creator: {
                        name: userData ? `${userData.firstName} ${userData.lastName}` : 'Anonymous',
                        username: userData?.userName || 'anonymous',
                        profileImage: profileImageUrl,
                        email: userData?.email
                    }
                };
            }));
    
            return jobs;
        } catch (error) {
            console.error('Error in fetchJobs:', error);
            throw new Error('Failed to fetch jobs');
        }
    }
    

    public async updateJob(jobId: string, jobData: any) {
        try {
            const jobRef = doc(this.db, 'jobs', jobId);
            
            await updateDoc(jobRef, {
                'basic_info.title': jobData.title,
                'basic_info.description': jobData.description,
                'basic_info.type': jobData.type,
                'basic_info.updatedAt': Timestamp.now(),
                'basic_info.priceRange': jobData.priceRange,
                'basic_info.location': jobData.location,
                'details.skills': jobData.skills,
                'details.requirements': jobData.requirements,
                'details.qualifications': jobData.qualifications,
                'category_specific': jobData.category_specific
            });

            // Update questions
            const questionsCollection = collection(jobRef, 'questions');
            const existingQuestions = await getDocs(questionsCollection);
            
            // Delete existing questions
            await Promise.all(existingQuestions.docs.map(doc => deleteDoc(doc.ref)));
            
            // Add updated questions
            await Promise.all(jobData.questions.map(async (question: any) => {
                await addDoc(questionsCollection, {
                    question: question.question,
                    type: question.answerType,
                    options: question.answerType !== 'input' ? question.options : []
                });
            }));

            return true;
        } catch (error) {
            console.error('Error in updateJob:', error);
            throw new Error('Failed to update job');
        }
    }

    public async deleteJob(jobId: string) {
        try {
            const jobRef = doc(this.db, 'jobs', jobId);
            
            // Delete questions subcollection
            const questionsCollection = collection(jobRef, 'questions');
            const questionsSnapshot = await getDocs(questionsCollection);
            await Promise.all(questionsSnapshot.docs.map(doc => deleteDoc(doc.ref)));
            
            // Delete main job document
            await deleteDoc(jobRef);
            
            return true;
        } catch (error) {
            console.error('Error in deleteJob:', error);
            throw new Error('Failed to delete job');
        }
    }
}
