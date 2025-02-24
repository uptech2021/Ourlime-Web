'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, Calendar, Mail, Phone, Globe, Edit, Pencil } from 'lucide-react';
import { auth } from '@/lib/firebaseConfig';

export default function BusinessAccountContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [businessData, setBusinessData] = useState({
        profile: {
            name: "",
            established: "",
            description: "",
            location: "",
            contact: {
                email: "",
                phone: "",
                website: ""
            }
        },
        metrics: {
            totalProducts: 0,
            totalSales: 0,
            avgRating: 0,
            responseRate: "0%"
        },
        feedback: {
            resolution: 0,
            responseTime: 0,
            satisfaction: 0
        },
        rating: {
            delivery: 0,
            overall: 0,
            product: 0,
            service: 0
        },
        reviews: {
            negative: 0,
            positive: 0,
            total: 0
        },
        categories: []
    });

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const response = await fetch('/api/business-account', {
                        headers: {
                            'userId': user.uid
                        }
                    });
                    const data = await response.json();
                    if (data.status === 'success' && data.data) {
                        setBusinessData(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching business data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinessData();
    }, []);

    const handleEdit = async (field: string, value: string) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const response = await fetch('/api/business-account', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.uid,
                    updates: {
                        [`profile.${field}`]: value
                    }
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setBusinessData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        [field]: value
                    }
                }));
            }
        } catch (error) {
            console.error('Error updating field:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenTheme"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Business Overview */}
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={businessData.profile.name}
                            onChange={(e) => handleEdit('name', e.target.value)}
                            placeholder="Enter Business Name"
                            className="text-2xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-greenTheme outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center gap-1">
                            <Building2 size={16} />
                            <input
                                type="text"
                                value={businessData.profile.established}
                                onChange={(e) => handleEdit('established', e.target.value)}
                                placeholder="Year Established"
                                className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-greenTheme outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <input
                                type="text"
                                value={businessData.profile.location}
                                onChange={(e) => handleEdit('location', e.target.value)}
                                placeholder="Location"
                                className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-greenTheme outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Description */}
            <div className="bg-gray-50 p-4 rounded-lg relative group">
                <textarea
                    value={businessData.profile.description}
                    onChange={(e) => handleEdit('description', e.target.value)}
                    placeholder="Enter your business description"
                    className="w-full text-gray-700 bg-transparent border-none focus:ring-0 resize-none"
                    rows={3}
                />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {businessData.profile.contact && Object.entries(businessData.profile.contact).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg relative group">
                        {key === 'email' && <Mail className="text-gray-500" size={20} />}
                        {key === 'phone' && <Phone className="text-gray-500" size={20} />}
                        {key === 'website' && <Globe className="text-gray-500" size={20} />}
                        <div className="w-full">
                            <p className="text-sm text-gray-500 capitalize">{key}</p>
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => handleEdit(`contact.${key}`, e.target.value)}
                                placeholder={`Enter ${key}`}
                                className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-greenTheme outline-none w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Business Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-500 text-sm">Total Products</p>
                    <p className="text-2xl font-bold">{businessData.metrics.totalProducts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-500 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold">{businessData.metrics.totalSales}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-500 text-sm">Average Rating</p>
                    <p className="text-2xl font-bold">{businessData.metrics.avgRating}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-500 text-sm">Response Rate</p>
                    <p className="text-2xl font-bold">{businessData.metrics.responseRate}</p>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Business Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {businessData.categories && businessData.categories.length > 0 ? (
                        businessData.categories.map((category, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {category}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500">No categories added yet</span>
                    )}
                    <button
                        onClick={() => handleEdit('categories', '')}
                        className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-greenTheme hover:text-greenTheme"
                    >
                        + Add Category
                    </button>
                </div>
            </div>

        </div>
    );
}
