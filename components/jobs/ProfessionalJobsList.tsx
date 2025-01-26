import { Button } from "@nextui-org/react";
import { Bookmark, Clock, DollarSign, MapPin, Users } from "lucide-react";
import Image from "next/image";
import JobApplicationModal from "./applyJobs/JobApplicationModal";
import { useState } from "react";


export const ProfessionalJobsList = ({ jobs }) => {

    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setIsApplicationModalOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                {jobs.map((job) => (

                    <div
                        key={job.id}
                        className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="flex flex-col lg:flex-row">
                            <div className="w-full lg:w-64 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                                <div className="w-20 h-20 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                                    <Image
                                        src={job.userImage || '/default-avatar.png'}
                                        alt={job.userName}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                        unoptimized={true}
                                    />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 text-center">{job.userName}</h4>
                                <span className="text-sm text-gray-500">View profile</span>
                            </div>

                            <div className="flex-1 p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-greenTheme transition-colors">
                                                {job.jobTitle}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                            ${job.type === 'Full-time' ? 'bg-green-100 text-green-700' :
                                                    job.type === 'Part-time' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-purple-100 text-purple-700'}`}>
                                                {job.type}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={16} className="text-gray-400" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={16} className="text-gray-400" />
                                                {job.priceRange?.from} - {job.priceRange?.to}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="bookmark">
                                            <Bookmark size={20} className="text-gray-400 hover:text-greenTheme" />
                                        </button>
                                        <Button
                                            onClick={() => handleApplyClick(job)}
                                            className="flex-1 sm:flex-none bg-greenTheme text-white rounded-full px-6 py-2 hover:bg-greenTheme/90 transition-colors">
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.skillsNeeded.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-1.5 bg-gray-50 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={16} />
                                                Posted {new Date(job.createdAt).toLocaleDateString()}

                                            </span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="flex items-center gap-1">
                                                <Users size={16} />
                                                23 applicants
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Job matching score:</span>
                                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-greenTheme w-3/4 rounded-full"></div>
                                            </div>
                                            <span className="text-sm font-medium text-greenTheme">75%</span>
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
