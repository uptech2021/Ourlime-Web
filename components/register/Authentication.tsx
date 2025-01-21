'use client';
import React from 'react';
import { Button } from '@nextui-org/react';
import transparentLogo from 'public/images/transparentLogo.png';
import Image from 'next/image';
import { Shield, UserCheck, Share2, Lock, Users, Sparkles } from 'lucide-react';
import { HeartHandshake, Rocket } from 'lucide-react';



export default function Authentication({ setStep, handleSubmit }) {
    const handleSkipAuthentication = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        console.log('Skipping authentication');
        handleSubmit(e); // Call the handleSubmit function to submit the form
    };


    const totalSteps = 5;
    const currentStep = 5;
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="step-5 mt-5 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
                <div
                    className="h-full bg-greenTheme transition-all duration-700 ease-in-out relative progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <Image
                        src={transparentLogo}
                        alt="Logo"
                        className="absolute -top-2 right-0 transform translate-x-1/2"
                        width={20}
                        height={20}
                    />
                </div>
            </div>

            <div className="mx-auto w-full border-none bg-black bg-opacity-[50%] px-5 py-4">
                <div className="w-3/4 mx-auto">
                    <h1 className="text-3xl font-bold text-white text-center mt-8">Welcome to Ourlime Communities Network!</h1>
                    <p className="text-center mb-6 text-white">
                        At Ourlime, your safety and experience are our top priorities. To ensure a secure and vibrant community, we require all users to authenticate their identity. Here&apos;s why this step is important:
                    </p>

                    <ol className="list-decimal space-y-6 mb-6 text-left max-w-lg text-white">
                        <li className="pl-2">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <Shield className="text-greenTheme" size={20} />
                                For the Safety of All Users
                            </span>
                            <span className="text-sm">Authenticating your identity helps create a safe environment where you can confidently interact with others, knowing everyone is genuine.</span>
                        </li>
                        <li className="pl-2">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <UserCheck className="text-greenTheme" size={20} />
                                To Prevent Fake Accounts
                            </span>
                            <span className="text-sm">By verifying accounts, we safeguard our community from bots and impersonators, ensuring authentic connections and meaningful interactions.</span>
                        </li>
                        <li className="pl-2">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <Share2 className="text-greenTheme" size={20} />
                                To Empower You to Create, Post, and Share Content
                            </span>
                            <span className="text-sm">Authentication unlocks your ability to share your voice, ideas, and creativity with the community. Let your contributions shine!</span>
                        </li>
                        <li className="pl-2">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <Lock className="text-greenTheme" size={20} />
                                To Access and Join Private Communities
                            </span>
                            <span className="text-sm">Many exclusive communities within Ourlime are open only to verified members, providing you with a more personalized and secure experience.</span>
                        </li>
                        <li className="pl-2">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <Users className="text-greenTheme" size={20} />
                                To Strengthen Trust Across the Platform
                            </span>
                            <span className="text-sm">Verified users build a culture of trust and accountability, encouraging healthy interactions and reducing misuse.</span>
                        </li>
                        <li className="pl-2">
                            <span className="font-bold block mb-1 flex items-center gap-2">
                                <Sparkles className="text-greenTheme" size={20} />
                                To Enhance Your Experience with Personalized Features
                            </span>
                            <span className="text-sm">Authenticating allows us to provide tailored features and recommendations, making your journey on Ourlime more enjoyable and meaningful.</span>
                        </li>
                    </ol>

                    <div className="mb-6 text-center text-white flex flex-col items-center gap-4">
                        <HeartHandshake className="text-greenTheme" size={32} />
                        <p className="text-lg font-medium">
                            Take a moment to authenticate your account today and join us in building a community rooted in
                            <span className="text-greenTheme font-bold"> trust</span>,
                            <span className="text-greenTheme font-bold"> creativity</span>, and
                            <span className="text-greenTheme font-bold"> collaboration</span>.
                        </p>
                        <p className="text-sm opacity-90">
                            You can skip authentication for now and complete this process later from the settings on your profile page.
                        </p>
                        <div className="flex items-center gap-2 font-bold">
                            <Rocket className="text-greenTheme" size={24} />
                            <span>Together, we can make Ourlime the vibrant and secure social platform we all deserve.</span>
                        </div>
                    </div>

                    <div className="flex w-full justify-center gap-8 mt-16">
                        <div className="flex flex-col items-center">
                            <Button
                                onClick={() => setStep(4)}
                                className="submit my-4 w-40 rounded-lg bg-white px-8 py-3 text-greenTheme hover:bg-gray-300 text-xs font-semibold"
                            >
                                Previous Step
                            </Button>
                            <p className="text-white text-sm text-center">Return to interests selection</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <Button
                                onClick={handleSkipAuthentication}
                                className="submit my-4 w-40 rounded-lg bg-white px-8 py-3 text-greenTheme hover:bg-gray-300 text-xs font-semibold"
                            >
                                Skip Authentication
                            </Button>
                            <p className="text-white text-sm text-center">Complete authentication later from settings</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <Button
                                onClick={() => setStep(6)}
                                className="submit my-4 w-40 rounded-lg bg-greenTheme px-8 py-3 text-white hover:bg-green-600 text-xs font-semibold shadow-lg shadow-greenTheme/50 animate-pulse hover:animate-none hover:scale-105 transition-transform"
                            >
                                Proceed to Authentication
                            </Button>
                            <p className="text-white text-sm text-center">Verify your identity now</p>
                        </div>

                    </div>



                </div>
            </div>
        </div>
    );

}