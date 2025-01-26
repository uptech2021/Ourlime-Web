import { Button } from "@nextui-org/react";
import { Clock, DollarSign, MapPin, Star } from "lucide-react";
import Image from "next/image";

export const QuickTasksList = ({ tasks }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="relative h-32 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                        <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-greenTheme">
                            Quick Task
                        </span>
                        <div className="absolute -bottom-6 left-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={task.taskProvider.avatar}
                                    alt={task.taskProvider.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full border-4 border-white"
                                    unoptimized={true}
                                />
                                <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-medium">{task.taskProvider.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{task.jobTitle}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{task.jobDescription}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {task.skills.skillsNeeded.map((skill, index) => (
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
                                <Clock size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{task.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{task.location}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <span className="flex items-center gap-2">
                                    <span className="flex items-center">
                                        <DollarSign size={16} className="text-gray-400" />
                                        {task.priceRange.from}
                                    </span>
                                    <span>-</span>
                                    <span className="flex items-center">
                                        <DollarSign size={16} className="text-gray-400" />
                                        {task.priceRange.to}
                                    </span>
                                </span>
                            </div>

                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Posted {new Date(task.createdAt).toLocaleDateString()}

                            </div>
                            <Button
                                className="bg-greenTheme/10 text-greenTheme hover:bg-greenTheme hover:text-white rounded-full px-6 py-2 transition-colors"
                            >
                                Apply Now
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
