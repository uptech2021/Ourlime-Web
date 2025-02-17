'use client';

import { Github, Globe, Linkedin, Twitter } from 'lucide-react';
import { UserData } from '@/types/userTypes';

interface WorkExperienceSectionProps {
    userData: UserData;
}

export default function SocialLinksSection({ userData }: WorkExperienceSectionProps) {

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                <Globe className="text-greenTheme" />
                Social Links
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { icon: Twitter, name: 'Twitter', username: '@username' },
                    { icon: Linkedin, name: 'LinkedIn', username: 'linkedin/username' },
                    { icon: Github, name: 'GitHub', username: 'github/username' }
                ].map((social, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all cursor-pointer">
                        <social.icon className="w-5 h-5 text-greenTheme" />
                        <div>
                            <p className="text-gray-900 font-medium">{social.name}</p>
                            <p className="text-sm text-gray-500">{social.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
