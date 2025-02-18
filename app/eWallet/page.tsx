'use client';

import { useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

import { ProfileImage, UserData } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';

import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, CreditCard, History, Repeat, Send, Wallet } from 'lucide-react';

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState('timeline');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { profileImage, userImages } = useProfileStore();
    const [activeSection, setActiveSection] = useState('balance');


    const renderBalance = () => (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Available Credit</p>
                            <h2 className="text-4xl font-bold mt-2">$350.00</h2>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <CreditCard className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderAddCredit = () => (
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Add Credit to Wallet</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your card number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN
                    </label>
                    <input
                        type="password"
                        placeholder="Enter card PIN"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                    Add Credit
                </button>
            </div>
        </div>
    );
    
    const renderHistory = () => (
        <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-xl">
                <h3 className="text-xl font-semibold">Transaction History</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div>
                            <p className="font-medium text-gray-800">Added Credit</p>
                            <p className="text-sm text-gray-500">Mar 1, 2024</p>
                        </div>
                        <div className="text-emerald-600 font-medium">+$50.00</div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderTransfer = () => (
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Transfer Credit</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Username
                    </label>
                    <input
                        type="text"
                        placeholder="Enter recipient's username"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input
                        type="number"
                        placeholder="Enter amount to transfer"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                    Transfer Credit
                </button>
            </div>
        </div>
    );
    

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <main className="pt-12 sm:pt-20 md:pt-28 lg:pt-36 w-full 2xl:w-9/12 2xl:mx-auto tvScreen:w-7/12 px-2 md:px-8">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="flex flex-col lg:flex-row gap-4 h-full relative">
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

                            {/* Navigation */}
                            <div className="border-b">
                                <div className="flex gap-x-4 md:gap-x-6 overflow-x-auto scrollbar-hide p-2">
                                    <button
                                        onClick={() => setActiveSection('balance')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === 'balance' ? 'bg-gray-100' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <Wallet className="w-5 h-5" />
                                        <span>Balance</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('add-credit')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === 'add-credit' ? 'bg-gray-100' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        <span>Add Credit</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('history')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === 'history' ? 'bg-gray-100' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <History className="w-5 h-5" />
                                        <span>Transaction History</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('transfer')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === 'transfer' ? 'bg-gray-100' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
                                        <span>Transfer</span>
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto min-h-0">
                                <div className="p-4 sm:p-6 lg:p-8 relative min-h-[600px] overflow-x-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeSection}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {activeSection === 'balance' && renderBalance()}
                                            {activeSection === 'add-credit' && renderAddCredit()}
                                            {activeSection === 'history' && renderHistory()}
                                            {activeSection === 'transfer' && renderTransfer()}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
