import Header from '@/components/Header';
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
//TODO aaron statistics on dashboard, communities, posts, jobs, blogs, events, users
//TODO aaron Manage features wont be created, but a statistics page would be to display everything
//TODO SEO aaron metadata customized for "ourlime.com" (hypothetical content)

export const metadata: Metadata = {
	metadataBase: new URL('https://ourlime.com'),
	title:
		'Ourlime Communities Network | Connect with Like-Minded People | Social Groups & Interests',
	description:
		'Join Ourlime Communities Network to connect with like-minded people. Explore social groups, share interests, recipes, tips, and more. Discover your community today!',
    keywords: 
		'communities, social network, interests, hobbies, groups, connect, recipes, tips, like-minded people, social groups, community network, online communities, social media, networking, community engagement, interest groups, hobby groups, online networking, social connections, community building, group activities, shared interests, community events, online forums, discussion groups, community support, social interaction, community platform, online groups, social engagement, community interaction, group discussions, community sharing, social collaboration, online interaction, community involvement, social networking site, community website, online social network, community connections, social community, group networking, community interests, social platform, online socializing, community participation, social groups online, community forums, social network platform, community activities, online social groups, community interests, social network site, community sharing platform, online community network, social network community, community engagement platform, social network interaction, community interaction platform, social network engagement, community building platform, social network connections, community platform online, social network groups, community network online, social network interests, community network platform, social network hobbies, community network engagement, social network activities, community network interaction, social network participation, community network sharing, social network collaboration, community network involvement, social network forums, community network discussions, social network support, community network socializing, social network events, community network platform online, social network community platform, community network social engagement, social network community interaction, community network social collaboration, social network community involvement, community network social participation, social network community sharing, community network social support, social network community events, community network social forums, social network community discussions, community network social activities, social network community interests, community network social hobbies, social network community groups, community network social connections, social network community building, community network social networking, social network community engagement',
	openGraph: {
		title: 'Ourlime Communities Network | Connect with Like-Minded People',
		description:
			'Join Ourlime Communities Network to connect with like-minded people. Explore social groups, share interests, recipes, tips, and more. Discover your community today!',
		url: 'https://ourlime.com',
		type: 'website',
		images: [
			{
				url: 'https://ourlime.com/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Ourlime Communities Network',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@ourlime',
		title: 'Ourlime Communities Network | Connect with Like-Minded People',
		description:
			'Join Ourlime Communities Network to connect with like-minded people. Explore social groups, share interests, recipes, tips, and more. Discover your community today!',
		images: 'https://ourlime.com/favicon.ico',
	},
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-backgroundColorTheme overflow-x-hidden">
				<Providers>
					<SpeedInsights />
						<Header />
						{children}
					<Analytics />
				</Providers>
				{/* <script src="../path/to/flowbite/dist/flowbite.min.js"></script> */}
				<script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
			</body>
		</html>
	);
}
