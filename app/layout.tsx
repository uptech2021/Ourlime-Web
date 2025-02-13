// app/layout.tsx
import Header from '@/components/Header';
import './globals.css';
import Providers from './providers';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { metadata } from './metadata';
import { SessionHandler } from './SessionProvider';
import { ChatButton } from '@/components/chat/ChatButton/ChatButton';
import { GlobalReminders } from '@/components/reminder/GlobalReminders';

export { metadata }

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-backgroundColorTheme overflow-x-hidden">
                <Providers>
                    <SessionHandler />
                    <SpeedInsights />
                    <Header />
                    <GlobalReminders />
                    {children}
                    <ChatButton />
                    <Analytics />
                    <Script
                        src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"
                        strategy="afterInteractive"
                    />
                </Providers>
            </body>
        </html>
    );
}

