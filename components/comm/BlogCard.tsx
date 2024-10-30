import Image from 'next/image';

type BlogCardProps = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
    category?: string;
};

export default function BlogCard({ title, image, date, author, category }: BlogCardProps) {
    return (
        <div className="rounded overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 opacity-100 animate-fadeIn group">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={image}
                    alt={`Thumbnail for ${title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    quality={100}
                />
                <div className="transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25 group-hover:bg-transparent" />

                {category && (
                    <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3">
                        {category}
                    </div>
                )}
            </div>

            <div className="px-6 py-4 mb-auto">
                <a href="#" aria-label={`Read more about ${title}`} className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
                    {author}
                </a>
                <p className="text-gray-500 text-sm">
                    {title}
                </p>
            </div>

            <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                {new Date(date.seconds * 1000).toLocaleDateString()}
            </div>
        </div>
    );
}
