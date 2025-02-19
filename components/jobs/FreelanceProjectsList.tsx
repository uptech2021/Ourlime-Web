import { Button } from "@nextui-org/react";
import { Clock, DollarSign, Star, Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import JobApplicationModal from "./applyJobs/JobApplicationModal";

export const FreelanceProjectsList = ({ jobs }) => {
    const freelanceProjects = jobs.filter(job => job.basic_info.type === "freelancer");

    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleApplyClick = (project) => {
        setSelectedProject(project);
        setIsApplicationModalOpen(true);
    };

    if (freelanceProjects.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-600">No freelance projects available at the moment.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {freelanceProjects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-gradient-to-r from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Column - Client Info */}
                            <div className="w-full lg:w-72 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                                        <Image
                                            src={project.creator?.profileImage || '/default-avatar.png'}
                                            alt={project.creator?.name || 'Project Creator'}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                            unoptimized={true}
                                        />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900">{project.creator?.name}</h4>
                                    <span className="text-sm text-gray-500 mt-1">@{project.creator?.username}</span>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium">4.9</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        15 projects posted
                                    </div>

                                    <div className="mt-4 w-full">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">Project Success</span>
                                            <span className="text-gray-900 font-medium">92%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full">
                                            <div
                                                className="h-full bg-greenTheme rounded-full"
                                                style={{ width: '92%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Project Details */}
                            <div className="flex-1 p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{project.basic_info.title}</h3>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                                {project.category_specific?.proposals || 0} proposals
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                {project.category_specific?.timeline || 'Flexible timeline'}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <span className="flex items-center">
                                                    <DollarSign size={16} className="text-gray-400" />
                                                    {project.basic_info.priceRange.from}
                                                </span>
                                                <span>-</span>
                                                <span className="flex items-center">
                                                    <DollarSign size={16} className="text-gray-400" />
                                                    {project.basic_info.priceRange.to}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <Button 
                                        className="w-full sm:w-auto bg-greenTheme text-white rounded-full px-6 py-2"
                                        onClick={() => handleApplyClick(project)}
                                    >
                                        Submit Proposal
                                    </Button>
                                </div>

                                <p className="text-gray-600 mb-6">{project.basic_info.description}</p>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.details.skills?.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {project.category_specific?.deliverables?.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Deliverables</h4>
                                            <ul className="list-disc pl-4">
                                                {project.category_specific.deliverables.map((deliverable, index) => (
                                                    <li key={index} className="text-gray-600">{deliverable}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock size={16} />
                                                Posted {new Date(project.basic_info.createdAt.seconds * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button className="text-greenTheme hover:underline text-sm font-medium">
                                            Save Project
                                        </button>
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
                    setSelectedProject(null);
                }}
                job={selectedProject}
                jobType="freelance"
            />
        </>
    );
};
