'use client';
import React from 'react';
import { Button } from '@nextui-org/react';

export default function Authentication({ setStep, handleSubmit }) {
    const handleSkipAuthentication = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        console.log('Skipping authentication');
        handleSubmit(e); // Call the handleSubmit function to submit the form
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Ourlime Communities Network!</h1>
            <p className="text-center mb-6 font-bold">
                At Ourlime, your safety and experience are our top priorities. To ensure a secure and vibrant community, we require all users to authenticate their identity. Here’s why this step is important:
            </p>
            <ol className="list-decimal list-inside mb-6 text-left max-w-lg font-bold">
                <li><strong>For the Safety of All Users</strong><br /> Authenticating your identity helps create a safe environment where you can confidently interact with others, knowing everyone is genuine.</li>
                <li><strong>To Prevent Fake Accounts</strong><br /> By verifying accounts, we safeguard our community from bots and impersonators, ensuring authentic connections and meaningful interactions.</li>
                <li><strong>To Empower You to Create, Post, and Share Content</strong><br /> Authentication unlocks your ability to share your voice, ideas, and creativity with the community. Let your contributions shine!</li>
                <li><strong>To Access and Join Private Communities</strong><br /> Many exclusive communities within Ourlime are open only to verified members, providing you with a more personalized and secure experience.</li>
                <li><strong>To Strengthen Trust Across the Platform</strong><br /> Verified users build a culture of trust and accountability, encouraging healthy interactions and reducing misuse.</li>
                <li><strong>To Enhance Your Experience with Personalized Features</strong><br /> Authenticating allows us to provide tailored features and recommendations, making your journey on Ourlime more enjoyable and meaningful.</li>
            </ol>
            <p className="mb-6 text-center font-bold">
                Take a moment to authenticate your account today and join us in building a community rooted in trust, creativity, and collaboration. You can skip authentication for now and complete this process later from the settings on your profile page. Together, we can make Ourlime the vibrant and secure social platform we all deserve.
            </p>
            <div className="flex space-x-4">
                <Button onClick={handleSkipAuthentication} className="px-4 py-2 bg-greenTheme text-white rounded hover:bg-gray-500">
                    Skip Authentication
                </Button>
                <Button onClick={() => setStep(6)} className="px-4 py-2 bg-greenTheme text-white rounded hover:bg-green-600">
                    Proceed to Authentication
                </Button>
            </div>
        </div>
    );
}