import { Button } from "@nextui-org/react";
import { Bookmark, Clock, DollarSign, MapPin, Users, Building2 } from "lucide-react";
import Image from "next/image";
import JobApplicationModal from "./applyJobs/JobApplicationModal";
import { useState } from "react";

export const ProfessionalJobsList = ({ jobs }) => {
    const professionalJobs = jobs.filter(job => job.basic_info.type === "professional");
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setIsApplicationModalOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                {professionalJobs.map((job) => (
                    <div
                        key={job.id}
                        className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="flex flex-col lg:flex-row">
                            <div className="w-full lg:w-64 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                                <div className="w-20 h-20 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                                    <Image
                                        src={job.creator?.profileImage || '/default-avatar.png'}
                                        alt={job.category_specific.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                        unoptimized={true}
                                    />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 text-center">
                                    {job.category_specific.name}
                                </h4>
                                <span className="text-sm text-gray-500">{job.category_specific.industry}</span>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 size={16} />
                                    <span>{job.category_specific.size} employees</span>
                                </div>
                            </div>

                            <div className="flex-1 p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-greenTheme transition-colors">
                                                {job.basic_info.title}
                                            </h3>
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                                {job.basic_info.type}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={16} className="text-gray-400" />
                                                {job.basic_info.location.type === 'remote' 
                                                    ? 'Remote' 
                                                    : `${job.basic_info.location.city}, ${job.basic_info.location.country}`
                                                }
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={16} className="text-gray-400" />
                                                ${job.basic_info.priceRange.from} - ${job.basic_info.priceRange.to}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Save Job">
                                            <Bookmark size={20} className="text-gray-400 hover:text-greenTheme" />
                                        </button>
                                        <Button
                                            onClick={() => handleApplyClick(job)}
                                            className="flex-1 sm:flex-none bg-greenTheme text-white rounded-full px-6 py-2 hover:bg-greenTheme/90 transition-colors"
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {job.details.skills?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-1.5 bg-gray-50 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {job.category_specific.benefits && job.category_specific.benefits.length > 0 && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Company Benefits</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.category_specific.benefits.map((benefit, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                                    >
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={16} />
                                                Posted {new Date(job.basic_info.createdAt.seconds * 1000).toLocaleDateString()}
                                            </span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="flex items-center gap-1">
                                                <Users size={16} />
                                                0 applicants
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <JobApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => {
                    setIsApplicationModalOpen(false);
                    setSelectedJob(null);
                }}
                job={selectedJob}
                jobType="professional"
            />
        </>
    );
};
