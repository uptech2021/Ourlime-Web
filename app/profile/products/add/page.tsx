'use client';

import { useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { UserData, ProfileImage } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';
import BasicInfo from '@/components/profile/products/add/steps/BasicInfo';
import MediaUpload from '@/components/profile/products/add/steps/MediaUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductFormData } from '@/types/productTypes';
import PricingDetails from '@/components/profile/products/add/steps/PricingDetails';
import SaveProduct from '@/components/profile/products/add/steps/SaveProduct';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { Toaster, toast } from 'react-hot-toast';


export default function AddProduct() {
    const [activeTab, setActiveTab] = useState('timeline');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userImages, setUserImages] = useState<ProfileImage[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        category: '',
        shortDescription: '',
        longDescription: '',
        thumbnailImage: undefined,
        media: [],
        variants: [],
        colors: [],
        sizes: [],
        newColors: [],
        newSizes: []
    });
    
    const steps = ['Basic Info', 'Media', 'Pricing'];

    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const handleSubmit = () => {
        toast.promise(
            new Promise((resolve) => {
                setTimeout(resolve, 2000);
            }),
            {
                loading: 'Creating your product...',
                success: 'Product created successfully! 🎉',
                error: 'Failed to create product'
            },
            {
                style: {
                    minWidth: '250px',
                },
                success: {
                    duration: 5000,
                    icon: '🎉',
                },
            }
        );
        
        // Reset form and steps
        setFormData({
            title: '',
            category: '',
            shortDescription: '',
            longDescription: '',
            thumbnailImage: undefined,
            media: [],
            variants: [],
            colors: [],
            sizes: [],
            newColors: [],
            newSizes: []
        });
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <Toaster position="top-center" />
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
                            <ProfileHeader
                                onCustomizationSelect={(selectedImage: ProfileImage) => {
                                    setActiveTab('customize');
                                }}
                                userImages={userImages}
                            />

                            {/* ADD PRODUCT CONTENT */}
                            <div className="p-6 lg:p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                                    <p className="text-gray-600 mt-2">Fill in the details for your new product listing</p>
                                </div>

                                {/* Progress Steps */}
                                <div className="px-8 pt-6">
                                    <div className="flex items-center justify-between mb-8">
                                        {steps.map((step, index) => (
                                            <div key={step} className="flex items-center">
                                                <div className="flex flex-col items-center">
                                                    <div className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center
                                                    ${index + 1 <= currentStep ? 'bg-greenTheme text-white' : 'bg-gray-100 text-gray-400'}
                                                `}>
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm mt-2">{step}</span>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div className="w-full mx-4 h-1 bg-gray-100">
                                                        <motion.div
                                                            className="h-full bg-greenTheme"
                                                            initial={{ width: "0%" }}
                                                            animate={{
                                                                width: currentStep > index + 1 ? "100%" : "0%"
                                                            }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Steps */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        variants={pageVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentStep === 1 && (
                                            <BasicInfo
                                                formData={formData}
                                                setFormData={setFormData}
                                                onNext={() => setCurrentStep(2)}
                                            />
                                        )}
                                        {currentStep === 2 && (
                                            <MediaUpload
                                                formData={formData}
                                                setFormData={setFormData}
                                                onNext={() => setCurrentStep(3)}
                                                onPrevious={() => setCurrentStep(1)}
                                            />
                                        )}
                                        {currentStep === 3 && (
                                            <PricingDetails
                                                formData={formData}
                                                setFormData={setFormData}
                                                onPrevious={() => setCurrentStep(2)}
                                                onNext={() => setCurrentStep(4)}
                                            />
                                        )}
                                        {currentStep === 4 && (
                                            
                                        <SaveProduct
                                            formData={formData}
                                            setFormData={setFormData}
                                            onPrevious={() => setCurrentStep(3)}
                                            onSubmit={handleSubmit}
                                        />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}