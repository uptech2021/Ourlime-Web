// app/verify-email/failure/page.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function VerificationFailure() {
    return (
        <div className="fixed inset-0 bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 backdrop-blur-sm" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col items-center justify-center min-h-screen p-4"
            >
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full text-center border border-white/20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-6"
                    >
                        <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mb-4">
                        Verification Failed
                    </h1>
                    
                    <p className="text-white/80 mb-8">
                        The verification link has expired or is invalid. Please request a new verification email or contact support if you continue to experience issues.
                    </p>

                    <div className="space-y-4">
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-greenTheme text-white py-3 px-6 rounded-xl 
                                         hover:bg-green-600 transition-colors duration-300"
                            >
                                Try Registering Again
                            </motion.button>
                        </Link>

                        <Link href="/support">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white/10 text-white py-3 px-6 rounded-xl 
                                         hover:bg-white/20 transition-colors duration-300"
                            >
                                Contact Support
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
