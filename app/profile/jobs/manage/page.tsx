'use client';

import { useEffect, useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import {
    Bookmark, Calendar, Camera, CircleUser, ImageIcon,
    Info, Users, UsersRound, Video, Pencil, Palette, ArrowRight, FileText, Link
} from 'lucide-react';
import Image from 'next/image';
import { UserData, ProfileImage } from '@/types/userTypes';
import ChangeProfileImageModal from '@/components/profile/ChangeProfileImageModal';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useProfileStore } from 'src/store/useProfileStore';
import ChangeCoverImageModal from '@/components/profile/ChangeCoverImageModal';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@nextui-org/react';
import { FreelanceProject, ProfessionalJob, QuickTask } from '@/types/jobTypes';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';

interface JobApplicantsProps {
    job: ProfessionalJob | QuickTask | FreelanceProject;
}


export default function JobApplicants({ job }: JobApplicantsProps) {
    const [activeTab, setActiveTab] = useState('timeline');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userImages, setUserImages] = useState<ProfileImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newBio, setNewBio] = useState(userData?.bio || '');
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileImagesQuery = query(
                    collection(db, 'profileImages'),
                    where('userId', '==', user.uid)
                );

                const profileImagesSnapshot = await getDocs(profileImagesQuery);
                const images = profileImagesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as ProfileImage[];

                setUserImages(images);

                // Fetch current cover image
                const coverSetAsQuery = query(
                    collection(db, 'profileImageSetAs'),
                    where('userId', '==', user.uid),
                    where('setAs', '==', 'coverProfile')
                );
                const coverSnapshot = await getDocs(coverSetAsQuery);

                if (!coverSnapshot.empty) {
                    const setAsDoc = coverSnapshot.docs[0].data();
                    const matchingCoverImage = images.find(img => img.id === setAsDoc.profileImageId);
                    if (matchingCoverImage) {
                        useProfileStore.getState().setCoverImage(matchingCoverImage);
                    }
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleBio = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setNewBio(userData.bio || '');
                    setUserData(prev => prev ? { ...prev, bio: userData.bio } : null);
                }
            }
        });

        return () => handleBio();
    }, []);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthChecked(true);
            if (user) {
                fetchApplicants();
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchApplicants = async () => {

        if (!auth.currentUser) {
            return;
        }

        try {
            const currentUser = auth.currentUser;

            const jobsQuery = query(
                collection(db, 'jobsVariant'),
                where('userId', '==', currentUser?.uid)
            );

            const jobsSnapshot = await getDocs(jobsQuery);
            const allApplicants = await Promise.all(
                jobsSnapshot.docs.map(async (jobDoc) => {
                    const jobData = jobDoc.data();
                    console.log(`Processing job: ${jobDoc.id}`, jobData);

                    const resumesSnapshot = await getDocs(
                        query(collection(db, 'jobResumes'),
                            where('jobsVariantId', '==', jobDoc.id))
                    );

                    const applicantsForJob = await Promise.all(
                        resumesSnapshot.docs.map(async (resumeDoc) => {
                            const resumeData = resumeDoc.data();
                            console.log('Resume data:', resumeData);

                            const userDoc = await getDoc(doc(db, 'users', resumeData.userId));
                            const userData = userDoc.data();

                            // Get job profile image first
                            let profileSetAsRef = query(
                                collection(db, 'profileImageSetAs'),
                                where('userId', '==', resumeData.userId),
                                where('setAs', '==', 'jobProfile')
                            );
                            let profileSetAsSnapshot = await getDocs(profileSetAsRef);

                            // If no job profile image, try getting regular profile image
                            if (profileSetAsSnapshot.empty) {
                                profileSetAsRef = query(
                                    collection(db, 'profileImageSetAs'),
                                    where('userId', '==', resumeData.userId),
                                    where('setAs', '==', 'profile')
                                );
                                profileSetAsSnapshot = await getDocs(profileSetAsRef);
                            }

                            // Get the image URL from profileImages collection
                            let profileImageUrl = null;
                            if (!profileSetAsSnapshot.empty) {
                                const imageId = profileSetAsSnapshot.docs[0].data().profileImageId;
                                const imageRef = doc(db, 'profileImages', imageId);
                                const imageDoc = await getDoc(imageRef);
                                profileImageUrl = imageDoc.data()?.imageURL;
                            }

                            const answersSnapshot = await getDocs(
                                query(collection(db, 'jobAnswers'),
                                    where('userId', '==', resumeData.userId))
                            );

                            const answers = await Promise.all(
                                answersSnapshot.docs.map(async (answerDoc) => {
                                    const answerData = answerDoc.data();
                                    const questionDoc = await getDoc(doc(db, 'jobQuestions', answerData.jobQuestionsId));
                                    const questionData = questionDoc.data();

                                    return {
                                        question: questionData?.question,
                                        response: answerData.answer,
                                        type: questionData?.answerType
                                    };
                                })
                            );

                            return {
                                id: resumeData.userId,
                                jobId: jobDoc.id,
                                jobTitle: jobData.jobTitle,
                                name: `${userData?.firstName} ${userData?.lastName}`,
                                email: userData?.email,
                                profileImage: profileImageUrl,
                                resumeUrl: resumeData.resumeFile,
                                portfolioLink: resumeData.portfolioLink,
                                appliedAt: resumeData.createdAt?.toDate?.() || resumeData.createdAt,
                                answers
                            };
                        })
                    );

                    return applicantsForJob;
                })
            );

            const flattenedApplicants = allApplicants.flat();
            setApplicants(flattenedApplicants);
            setIsLoading(false);

        } catch (error) {
            toast.error('Failed to load applicants');
            setIsLoading(false);
        }
    };


    const handleAcceptApplication = async (applicantId) => {
        try {
            // Implement acceptance logic
            toast.success('Application accepted');
        } catch (error) {
            console.error('Error accepting application:', error);
            toast.error('Failed to accept application');
        }
    };

    const handleRejectApplication = async (applicantId) => {
        try {
            // Implement rejection logic
            toast.success('Application rejected');
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('Failed to reject application');
        }
    };


    return (
        <div className="min-h-screen w-full bg-gray-50">
            <main className="h-[calc(100vh-10px)] pt-24 md:pt-24 lg:pt-32 w-full px-2 md:px-8">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="flex flex-col lg:flex-row gap-4 h-full relative">
                        {/* Fixed Left Sidebar */}
                        <div className="lg:sticky lg:top-32">
                            <ProfileSidebar
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setIsSidebarOpen={setIsSidebarOpen}
                                isSidebarOpen={isSidebarOpen}
                                setUserData={setUserData}
                                setProfileImage={useProfileStore.getState().setProfileImage}
                            />
                        </div>

                        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto">

                            <ProfileHeader />

                            {/* JOBS SECTION CONTENT */}
                            <div className="p-4 sm:p-6 lg:p-8 max-w-[2000px] mx-auto">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                    {/* Left Column - Applicants List */}
                                    <div className="bg-white rounded-xl shadow-sm">
                                        <div className="p-4 sm:p-6 border-b">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg sm:text-xl font-semibold">Applicants</h3>
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                    {applicants.length} total
                                                </span>
                                            </div>
                                        </div>

                                        <div className="divide-y max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                            {applicants.map((applicant) => (
                                                <div
                                                    key={applicant.id}
                                                    className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors
                                                    ${selectedApplicant?.id === applicant.id ? 'bg-gray-50' : ''}`}
                                                    onClick={() => setSelectedApplicant(
                                                        selectedApplicant?.id === applicant.id ? null : applicant
                                                    )}

                                                >
                                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={applicant.profileImage || "/default-avatar.png"}
                                                            alt={applicant.name}
                                                            fill
                                                            className="object-cover"
                                                            loader={({ src }) => src}
                                                            unoptimized={true}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">{applicant.name}</h4>
                                                        <p className="text-sm text-gray-500">Applied for: {applicant.jobTitle}</p>
                                                        <p className="text-sm text-gray-400">
                                                            {formatDistanceToNow(new Date(applicant.appliedAt))} ago
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hidden sm:block">
                                                        New
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column - Application Details */}
                                    <div className="bg-white rounded-xl shadow-sm">
                                        {selectedApplicant ? (
                                            <div className="h-full flex flex-col">
                                                <div className="p-4 sm:p-6 border-b">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={selectedApplicant.profileImage || "/default-avatar.png"}
                                                                alt={selectedApplicant.name}
                                                                fill
                                                                className="object-cover"
                                                                loader={({ src }) => src}
                                                                unoptimized={true}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl sm:text-2xl font-semibold truncate">
                                                                {selectedApplicant.name}
                                                            </h3>
                                                            <p className="text-gray-600 truncate">{selectedApplicant.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                                                    {/* Resume Section */}
                                                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                                        <h4 className="font-medium mb-3">Resume</h4>
                                                        <div className="flex flex-wrap gap-3">
                                                            <a
                                                                href={selectedApplicant.resumeUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                                                            >
                                                                <FileText size={18} />
                                                                View Resume
                                                            </a>
                                                            {selectedApplicant.portfolioLink && (
                                                                <a
                                                                    href={selectedApplicant.portfolioLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <Link size={18} />
                                                                    Portfolio
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Questions & Answers */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Application Responses</h4>
                                                        <div className="space-y-4">
                                                            {selectedApplicant.answers.map((answer, index) => (
                                                                <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                                                    <p className="font-medium text-gray-700 mb-2">{answer.question}</p>
                                                                    <p className="text-gray-600">{answer.response}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons - Fixed at Bottom */}
                                                <div className="border-t p-4 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <Button className="flex-1 bg-greenTheme text-white h-11">
                                                            Accept Application
                                                        </Button>
                                                        <Button className="flex-1 bg-red-50 text-red-600 border-red-100 h-11">
                                                            Reject Application
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center p-4 sm:p-6">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Users size={24} className="text-gray-400" />
                                                    </div>
                                                    <h3 className="text-gray-500 font-medium">
                                                        Select an applicant to view their details
                                                    </h3>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

