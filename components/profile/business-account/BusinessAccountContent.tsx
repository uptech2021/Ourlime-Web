'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Building2, MapPin, Calendar, Mail, Phone, Globe, Edit, Pencil } from 'lucide-react';
import { auth } from '@/lib/firebaseConfig';

interface BusinessData {
    profile: {
        name: string;
        established: string;
        description: string;
        location: string;
        contact: {
            email: string;
            phone: string;
            website: string;
        };
    };
    metrics: {
        totalProducts: number;
        totalSales: number;
        avgRating: number;
        responseRate: string;
    };
    feedback: {
        resolution: number;
        responseTime: number;
        satisfaction: number;
    };
    rating: {
        delivery: number;
        overall: number;
        product: number;
        service: number;
    };
    reviews: {
        negative: number;
        positive: number;
        total: number;
    };
    categories: string[];
}

export default function BusinessAccountContent() {
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState('');
    const [businessData, setBusinessData] = useState<BusinessData>({
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

    const startEditing = (field: string, currentValue: string) => {
        setEditingField(field);
        setTempValue(currentValue);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTempValue(e.target.value);
    };

    const handleSubmit = async (field: string) => {
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
                        [`profile.${field}`]: tempValue
                    }
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setBusinessData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        [field]: tempValue
                    }
                }));
            }
        } catch (error) {
            console.error('Error updating field:', error);
        }
        setEditingField(null);
    };

    const renderField = (field: string, value: string, title: string, icon?: React.ReactNode) => {
        const isEditing = editingField === field;
        
        if (!value && !isEditing) {
            return (
                <div className="flex items-center gap-2">
                    {icon}
                    <button
                        type="button"
                        onClick={() => startEditing(field, '')}
                        className="flex items-center gap-1 text-gray-500 hover:text-greenTheme"
                        title={`Add ${title}`}
                    >
                        <Pencil size={16} />
                        <span>Add {title}</span>
                    </button>
                </div>
            );
        }

        if (isEditing) {
            return (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(field);
                }}>
                    <label htmlFor={`input-${field}`} className="sr-only">{title}</label>
                    <input
                        id={`input-${field}`}
                        type="text"
                        value={tempValue}
                        onChange={handleInputChange}
                        onBlur={() => handleSubmit(field)}
                        autoFocus
                        placeholder={`Enter ${title}`}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-b border-greenTheme outline-none w-full"
                    />
                </form>
            );
        }

        return (
            <div className="flex items-center gap-2 group">
                {icon}
                <span>{value}</span>
                <button
                    type="button"
                    onClick={() => startEditing(field, value)}
                    className="opacity-0 group-hover:opacity-100 ml-2"
                    title={`Edit ${title}`}
                >
                    <Pencil size={16} className="text-gray-500" />
                </button>
            </div>
        );
    };    const renderContactField = (key: string, value: string) => {
        const isEditing = editingField === `contact.${key}`;
        const icons = {
            email: <Mail className="text-gray-500" size={20} />,
            phone: <Phone className="text-gray-500" size={20} />,
            website: <Globe className="text-gray-500" size={20} />
        };

        return (
            <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg relative group">
                {icons[key as keyof typeof icons]}
                <div className="w-full">
                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                    {isEditing ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(`contact.${key}`);
                        }}>
                            <label htmlFor={`input-${key}`} className="sr-only">{`Enter ${key}`}</label>
                            <input
                                id={`input-${key}`}
                                type="text"
                                value={tempValue}
                                onChange={handleInputChange}
                                onBlur={() => handleSubmit(`contact.${key}`)}
                                autoFocus
                                placeholder={`Enter ${key}`}
                                className="font-medium bg-transparent border-b border-greenTheme outline-none w-full"
                            />
                        </form>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{value || `Add ${key}`}</span>
                            <button
                                type="button"
                                onClick={() => startEditing(`contact.${key}`, value)}
                                className="opacity-0 group-hover:opacity-100"
                                aria-label={`Edit ${key}`}
                                title={`Edit ${key}`}
                            >
                                <Pencil size={14} className="text-gray-500" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
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
                    <div className="mb-4">
                        {renderField('name', businessData.profile.name, 'Business Name')}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                        {renderField('established', businessData.profile.established, 'Year Established', <Building2 size={16} />)}
                        {renderField('location', businessData.profile.location, 'Location', <MapPin size={16} />)}
                    </div>
                </div>
            </div>

            {/* Business Description */}
            <div className="bg-gray-50 p-4 rounded-lg relative group">
                {editingField === 'description' ? (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit('description');
                    }}>
                        <textarea
                            value={tempValue}
                            onChange={handleInputChange}
                            onBlur={() => handleSubmit('description')}
                            autoFocus
                            placeholder="Enter your business description"
                            className="w-full text-gray-700 bg-transparent border-none focus:ring-0 resize-none"
                            rows={3}
                        />
                    </form>
                ) : (
                    <div className="flex items-start gap-2">
                        <p className="text-gray-700">
                            {businessData.profile.description || 'Add business description'}
                        </p>
                        <button
                            type="button"
                            onClick={() => startEditing('description', businessData.profile.description)}
                            className="opacity-0 group-hover:opacity-100"
                            title="Edit description"
                        >
                            <Pencil size={16} className="text-gray-500" />
                        </button>
                    </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(businessData.profile.contact).map(([key, value]) => 
                    renderContactField(key, value)
                )}
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
                    {businessData.categories.length > 0 ? (
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
                        type="button"
                        onClick={() => startEditing('categories', '')}
                        className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-greenTheme hover:text-greenTheme"
                        title="Add Category"
                    >
                        + Add Category
                    </button>
                </div>
            </div>
        </div>
    );

}