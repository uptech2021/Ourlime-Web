import Image from 'next/image';

export default function RightSection() {
    return (
        <section className="w-[280px] bg-white rounded-lg shadow-md p-4 fixed right-8 top-36 h-[calc(100vh-9rem)] overflow-y-auto">
            {/* Communities Grid */}
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Communities</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { name: 'Tech Hub', members: '2.3k', image: 'https://picsum.photos/200/200?random=1' },
                        { name: 'Design Club', members: '1.5k', image: 'https://picsum.photos/200/200?random=2' },
                        { name: 'Startup Network', members: '3.1k', image: 'https://picsum.photos/200/200?random=3' },
                        { name: 'Dev Connect', members: '980', image: 'https://picsum.photos/200/200?random=4' }
                    ].map((community, index) => (
                        <div key={index} className="relative group cursor-pointer">
                            <Image
                                src={community.image}
                                alt={community.name}
                                width={120}
                                height={120}
                                className="rounded-lg object-cover w-full h-24"
                                unoptimized={true}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 rounded-b-lg">
                                <p className="text-white text-sm font-medium truncate">{community.name}</p>
                                <p className="text-gray-300 text-xs">{community.members} members</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                    {[
                        { title: 'Tech Conference 2024', date: 'Mar 15', image: 'https://picsum.photos/200/200?random=5' },
                        { title: 'Design Workshop', date: 'Mar 20', image: 'https://picsum.photos/200/200?random=6' },
                        { title: 'Startup Meetup', date: 'Mar 25', image: 'https://picsum.photos/200/200?random=7' }
                    ].map((event, index) => (
                        <div key={index} className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                            <Image
                                src={event.image}
                                alt={event.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                                unoptimized={true}
                            />
                            <div>
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-gray-500 text-xs">{event.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Jobs Grid */}
            <div>
                <h2 className="text-lg font-bold mb-4">Featured Jobs</h2>
                <div className="space-y-4">
                    {[
                        { role: 'Senior Developer', company: 'TechCorp', location: 'Remote', image: 'https://picsum.photos/200/200?random=8' },
                        { role: 'UX Designer', company: 'DesignLabs', location: 'New York', image: 'https://picsum.photos/200/200?random=9' },
                        { role: 'Product Manager', company: 'StartupX', location: 'San Francisco', image: 'https://picsum.photos/200/200?random=10' }
                    ].map((job, index) => (
                        <div key={index} className="border rounded-lg p-3 cursor-pointer hover:border-greenTheme transition-colors">
                            <div className="flex gap-3 items-center">
                                <Image
                                    src={job.image}
                                    alt={job.company}
                                    width={40}
                                    height={40}
                                    className="rounded-lg"
                                    unoptimized={true}
                                />
                                <div>
                                    <p className="font-medium text-sm">{job.role}</p>
                                    <p className="text-gray-500 text-xs">{job.company}</p>
                                    <p className="text-gray-400 text-xs">{job.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}