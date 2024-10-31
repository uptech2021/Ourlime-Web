import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

type Articles = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
    category: string;
};

type CategoriesProps = {
    categories: Array<string>;
    filteredArticles: Articles[];
};


export default function Categories({ categories, filteredArticles }: CategoriesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [categoriesWithData, setCategoriesWithData] = useState<Set<string>>(new Set());

    useEffect(() => {
        const availableCategories = new Set(filteredArticles?.map(article => article.category) || []);
        setCategoriesWithData(availableCategories);
    }, [filteredArticles]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const urlCategories = searchParams.get('categories')?.split(',') || ['All'];
        return urlCategories;
    });


    const handleCategoryClick = (category: string) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        const currentSearch = currentParams.get('search');
        
        let newCategories: string[];
        
        if (category === "All") {
            newCategories = ["All"];
        } else {
            // Remove "All" when selecting other categories
            newCategories = selectedCategories
                .filter(cat => cat !== "All")
                .filter(cat => cat !== category);
                
            if (!selectedCategories.includes(category)) {
                newCategories.push(category);
            }
            
            // If no categories selected, default back to "All"
            if (newCategories.length === 0) {
                newCategories = ["All"];
            }
        }
        
        // Update URL with current search and new categories
        if (newCategories.includes("All")) {
            if (currentSearch) {
                router.push(`?search=${currentSearch}`);
            } else {
                router.push('/articles');
            }
        } else {
            const categoryParam = `categories=${newCategories.join(',')}`;
            const searchParam = currentSearch ? `&search=${currentSearch}` : '';
            router.push(`?${categoryParam}${searchParam}`);
        }
        
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
