import { Button } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { Clock, DollarSign, Star } from "lucide-react";
import Image from "next/image";

export const FreelanceProjectsList = ({ projects }) => {
    return (
        <div className="space-y-6">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="bg-gradient-to-r from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Column - Client Info */}
                        <div className="w-full lg:w-72 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <Image
                                    src={project.clientInfo.avatar}
                                    alt={project.clientInfo.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full mb-4"
                                    unoptimized={true}
                                />
                                <h4 className="text-lg font-semibold text-gray-900">{project.clientInfo.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium">{project.clientInfo.rating}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    {project.clientInfo.projectsPosted} projects posted
                                </div>

                                <div className="mt-4 w-full">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Project Success</span>
                                        <span className="text-gray-900 font-medium">{project.clientInfo.successRate}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="h-full bg-greenTheme rounded-full"
                                            style={{ width: `${project.clientInfo.successRate}%` }}
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
                                        <h3 className="text-xl font-bold text-gray-900">{project.jobTitle}</h3>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                            {project.proposalCount} proposals
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            {project.deadline} deadline
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="flex items-center">
                                                <DollarSign size={16} className="text-gray-400" />
                                                {project.priceRange.from}
                                            </span>
                                            <span>-</span>
                                            <span className="flex items-center">
                                                <DollarSign size={16} className="text-gray-400" />
                                                {project.priceRange.to}
                                            </span>
                                            <span>({project.budget.type})</span>
                                        </span>

                                    </div>
                                </div>
                                <Button className="w-full sm:w-auto bg-greenTheme text-white rounded-full px-6 py-2">
                                    Submit Proposal
                                </Button>
                            </div>

                            <p className="text-gray-600 mb-6">{project.jobDescription}</p>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.skillsNeeded.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <span className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock size={16} />
                                            Posted {formatDistanceToNow(project.createdAt.toDate())} ago

                                        </span>
                                        <span className="hidden sm:inline text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">Proposals close in {project.deadline}</span>
                                    </div>
                                    <button className="text-greenTheme hover:underline text-sm font-medium">
                                        Save Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}        </div>
    );
};
