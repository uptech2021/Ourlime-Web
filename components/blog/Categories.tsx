import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

type Blog = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
};

type CategoriesProps = {
    categories: Array<string>;
    filteredBlogs: Blog[];
};


export default function Categories({ categories, filteredBlogs }: CategoriesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [categoriesWithData, setCategoriesWithData] = useState<Set<string>>(new Set());

    useEffect(() => {
        const availableCategories = new Set(filteredBlogs?.map(blog => blog.author) || []);
        setCategoriesWithData(availableCategories);
    }, [filteredBlogs]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const urlCategories = searchParams.get('categories')?.split(',') || ['All'];
        return urlCategories;
    });


	const handleCategoryClick = (category: string) => {
		let newCategories: string[];
		
		if (category === "All") {
			newCategories = ["All"];
			router.push('/blogs'); // Clean URL when "All" is selected
		} else if (selectedCategories.includes("All")) {
			newCategories = [category];
			router.push(`?categories=${category}`);
		} else {
			newCategories = selectedCategories.includes(category)
				? selectedCategories.filter(cat => cat !== category)
				: [...selectedCategories, category];
				
			if (newCategories.length === 0) {
				newCategories = ["All"];
				router.push('/blogs');
			} else {
				router.push(`?categories=${newCategories.join(',')}`);
			}
		}
	    console.log('Selected Categories:', newCategories);
		setSelectedCategories(newCategories);
	};
	

    return (
        <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center border-b pb-2">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z"
                        ></path>
                    </svg>
                </span>
                <h2 className="text-2xl font-semibold">Categories</h2>
            </div>
            <div className="mt-2 flex flex-wrap">
                {categories.map((category) => (
                    <span
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`mb-2 mr-2 cursor-pointer rounded-full px-3 py-1 text-sm flex items-center transition-colors duration-200 ${
                        selectedCategories.includes(category)
                            ? categoriesWithData.has(category) || category === 'All'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {category}
                    {selectedCategories.includes(category) && (
                        categoriesWithData.has(category) || category === 'All' ? (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        )
                    )}
                </span>
                
                ))}
            </div>
        </div>
    );
}
