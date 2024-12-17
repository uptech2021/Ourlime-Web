'use client';
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import Image from 'next/image';
import termsImage from "@/public/images/register/termsImage.svg";
import logo from "@/public/images/transparentLogo.png";

type TermsModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    return (
        <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalContent>
                <ModalBody>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 md:border-b md:border-b-0 md:border-r border-black pr-0 md:pr-4 mb-4 md:mb-0">
                            <header className="text-center mb-6 md:border-b border-black">
                                <Image src={logo} alt="Our Lime Logo" className="w-40 mx-auto" />
                            </header>
                            <div className="hidden md:block">
                                <Image src={termsImage} alt="Terms Illustration" className="w-full" />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 pl-0 md:pl-4">
                            <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
                            <p className="text-gray-600 mb-4">Effective Date: 7<sup>th</sup> December 2024</p>
                            
                            <p className="mb-4 text-gray-700">
                                Welcome to the Ourlime Communities Network (OCN)! These Terms and Conditions ("Terms") govern your access to and use of OCN, including our website, mobile application, and any related services. By accessing or using OCN, you agree to comply with these Terms. If you do not agree, please do not use our services.
                            </p>
                            
                            <div className="hidden md:block border-t border-b border-gray-200 my-4"></div>
                            
                            <section className="mb-4 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold">1. Eligibility</h2>
                                <p className="mb-4">
                                    You must be <strong>13 years or older</strong> to create an account or use OCN. By using the platform, you affirm that you meet this age requirement.
                                </p>
                                <p className="mb-4">
                                    If you are between 13 and 18 years old, you confirm that you have obtained parental or guardian consent to use our services.
                                </p>
                                <p className="mb-4">
                                    OCN reserves the right to terminate accounts if users are found to be under the minimum age requirement.
                                </p>
                            </section>
                            <section className="mb-4 border-b border-black">
                                <h2 className="text-2xl font-semibold">2. Account Creation and Security</h2>
                                <ul className="list-disc list-inside mb-4">
                                    <li>You are responsible for maintaining the confidentiality of your account information, including your username and password.</li>
                                    <li>You agree to provide accurate, current, and complete information during registration.</li>
                                    <li>You are solely responsible for activities that occur under your account. Notify us immediately if you suspect unauthorized access.</li>
                                </ul>
                            </section>
                            <section className="mb-4 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold">3. Community Guidelines</h2>
                                <p className="mb-2">By using OCN, you agree to adhere to the following guidelines:</p>
                                <ul className="list-disc list-inside mb-2">
                                    <li>Be respectful: No hate speech, bullying, harassment, or abusive language.</li>
                                    <li>Do not post or share illegal, obscene, or harmful content.</li>
                                    <li>Protect privacy: Do not share personal information of yourself or others without consent.</li>
                                    <li>Avoid spamming or promoting unauthorized commercial content.</li>
                                </ul>
                                <p className="mb-4">Violation of these guidelines may result in account suspension or termination.</p>
                            </section>
                            <section className="mb-4 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold">4. Prohibited Activities</h2>
                                <p className="mb-2">You agree not to:</p>
                                <ul className="list-disc list-inside mb-4">
                                    <li>Use OCN for any illegal purposes.</li>
                                    <li>Attempt to hack, disrupt, or gain unauthorized access to the platform.</li>
                                    <li>Post content that infringes intellectual property rights.</li>
                                    <li>Use automated systems (e.g., bots) to interact with the platform without prior authorization.</li>
                                </ul>
                            </section>
                            <section className="mb-4">
                                <h2 className="text-2xl font-semibold">5. Privacy and Data Use</h2>
                                <p className="mb-4">OCN collects and processes personal data in accordance with our Privacy Policy. By using OCN, you consent to such processing.</p>
                            </section>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
} 