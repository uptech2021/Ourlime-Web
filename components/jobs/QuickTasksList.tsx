import { Button } from "@nextui-org/react";
import { Clock, DollarSign, MapPin, Star, Timer, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import JobApplicationModal from "./applyJobs/JobApplicationModal";

export const QuickTasksList = ({ jobs }) => {
    const quickTasks = jobs.filter(job => job.basic_info.type === "quickTask");

    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleApplyClick = (task) => {
        setSelectedTask(task);
        setIsApplicationModalOpen(true);
    };

    if (quickTasks.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-600">No quick tasks available at the moment.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickTasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                        <div className="relative h-32 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                            <div className="flex gap-2 absolute top-4 right-4">
                                <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-greenTheme">
                                    Quick Task
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                    ${task.category_specific?.urgency === 'high' 
                                        ? 'bg-red-100 text-red-600' 
                                        : task.category_specific?.urgency === 'medium'
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-green-100 text-green-600'
                                    }`}>
                                    {task.category_specific?.urgency || 'Medium'} Priority
                                </span>
                            </div>

                            <div className="absolute -bottom-10 left-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
                                        <Image
                                            src={task.creator?.profileImage || '/default-avatar.png'}
                                            alt={task.creator?.name || 'Task Creator'}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                            unoptimized={true}
                                        />
                                    </div>
                                    <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-sm font-medium">4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {task.basic_info.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {task.basic_info.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {task.details.skills?.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-50 rounded-full text-sm font-medium text-gray-600"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                    <Timer size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {task.category_specific?.duration || 'Flexible'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {task.basic_info.location.type === 'remote' 
                                            ? 'Remote' 
                                            : `${task.basic_info.location.city}, ${task.basic_info.location.country}`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                    <span className="flex items-center gap-2">
                                        <span className="flex items-center">
                                            <DollarSign size={16} className="text-gray-400" />
                                            {task.basic_info.priceRange.from}
                                        </span>
                                        <span>-</span>
                                        <span className="flex items-center">
                                            <DollarSign size={16} className="text-gray-400" />
                                            {task.basic_info.priceRange.to}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                    <AlertCircle size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {task.category_specific?.complexity || 'Moderate'} complexity
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Posted {new Date(task.basic_info.createdAt.seconds * 1000).toLocaleDateString()}
                                </div>
                                <Button
                                    onClick={() => handleApplyClick(task)}
                                    className="bg-greenTheme/10 text-greenTheme hover:bg-greenTheme hover:text-white rounded-full px-6 py-2 transition-colors"
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <JobApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => {
                    setIsApplicationModalOpen(false);
                    setSelectedTask(null);
                }}
                job={selectedTask}
                jobType="quicktasks"
            />
        </>
    );
};
