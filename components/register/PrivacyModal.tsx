'use client';
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import Image from 'next/image';
import privacyImage from "@/public/images/register/privacyGroup.svg";
import logo from "@/public/images/transparentLogo.png";

type PrivacyModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
    return (
        <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalContent>
                <ModalBody>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-black pr-0 md:pr-4 mb-4 md:mb-0">
                            <header className="text-center mb-6 border-b border-black">
                                <Image src={logo} alt="Our Lime Logo" className="w-40 mx-auto" />
                            </header>
                            <div className="hidden md:block">
                                <Image src={privacyImage} alt="Privacy Illustration" className="w-full" />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 pl-0 md:pl-4">
                            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                            <p className="text-gray-600 mb-4">Effective Date: 7<sup>th</sup> December 2024</p>
                            
                            <p className="mb-4 text-gray-700">
                                At Ourlime Communities Network (OCN), your privacy and trust are our top priorities. This Privacy Policy explains how we collect, use, protect, and share your information when you use our platform. By accessing or using OCN, you consent to the practices described in this policy.
                            </p>
                            
                            <div className="hidden md:block border-t border-b border-gray-200 my-4"></div>
                            
                            <section className="mb-4 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold">1. Our Commitment to Your Privacy</h2>
                                <p className='mb-4'>
                                    We are committed to providing you with as much control and privacy as possible while ensuring a secure and enjoyable experience. All personal information you provide, including for verification purposes, will remain confidential and protected.
                                </p>
                            </section>
                            <section className="mb-4">
                                <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                                <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
                                <ul className="list-disc list-inside mb-2">
                                    <li>Name, email address, phone number, and date of birth.</li>
                                    <li>Photos, government-issued ID, or other verification documents (used solely for identity verification).</li>
                                </ul>
                                <h3 className="text-xl font-semibold">2.2 User-Generated Content</h3>
                                <ul className="list-disc list-inside mb-2">
                                    <li>Posts, comments, and other content you share on OCN.</li>
                                    <li>Usage data, including pages visited and interactions with features.</li>
                                </ul>
                            </section>
                            <section className="mb-4">
                                <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                                <ul className="list-disc list-inside mb-2">
                                    <li>To create and manage your account.</li>
                                    <li>To verify your identity and ensure the security of the platform.</li>
                                    <li>To improve and personalize your experience on OCN.</li>
                                    <li>To communicate updates, features, or issues related to the platform.</li>
                                    <li>To comply with legal requirements or protect the safety of our users.</li>
                                </ul>
                            </section>
                            <section className="mb-4">
                                <h2 className="text-2xl font-semibold">4. Data Protection and Confidentiality</h2>
                                <ul className="list-disc list-inside mb-2">
                                    <li>All personal information, including verification documents, is stored securely and treated with the highest confidentiality standards.</li>
                                    <li>Raw data collected from users will never be sold to third parties.</li>
                                    <li>Only authorized personnel with a legitimate need will have access to sensitive data.</li>
                                    <li>We use industry-standard encryption and security measures to protect your information from unauthorized access.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
} 