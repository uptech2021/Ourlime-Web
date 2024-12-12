'use client';

import Card from './Card';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './home.module.css';
import { Stories } from '@/types/global';
import React, { SetStateAction, useState, useRef, useEffect } from 'react';

export default function StoriesSlider({
	setAddStory,
	stories,
}: {
	setAddStory: React.Dispatch<SetStateAction<boolean>>;
	stories: Stories[];
}) {
	const [scrollPosition, setScrollPosition] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Check scroll possibilities
	useEffect(() => {
		const checkScroll = () => {
			const container = containerRef.current;
			if (container) {
				setCanScrollLeft(container.scrollLeft > 0);
				setCanScrollRight(
					container.scrollLeft < container.scrollWidth - container.clientWidth
				);
			}
		};

		checkScroll();
		// Add event listener for scroll
		containerRef.current?.addEventListener('scroll', checkScroll);
		// Add event listener for resize
		window.addEventListener('resize', checkScroll);

		return () => {
			containerRef.current?.removeEventListener('scroll', checkScroll);
			window.removeEventListener('resize', checkScroll);
		};
	}, [stories]);

	const scroll = (direction: 'left' | 'right') => {
		const container = containerRef.current;
		if (!container) return;

		const scrollAmount = 200;
		const newPosition = direction === 'left' 
			? scrollPosition - scrollAmount 
			: scrollPosition + scrollAmount;

		container.scrollTo({
			left: newPosition,
			behavior: 'smooth'
		});

		setScrollPosition(newPosition);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		setStartX(e.pageX - containerRef.current!.offsetLeft);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - containerRef.current!.offsetLeft;
		const walk = (x - startX) * 2;
		containerRef.current!.scrollLeft = scrollPosition - walk;
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	return (
		<div className="relative group">
			{/* Left Arrow */}
			{canScrollLeft && (
				<button 
					onClick={() => scroll('left')}
					className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				>
					<ChevronLeft size={24} />
				</button>
			)}

			{/* Stories Container */}
			<div className="flex flex-row items-center bg-white p-2 overflow-hidden">
				{/* Add Story Button - Fixed Position */}
				<div
					onClick={() => setAddStory((prev: boolean) => !prev)}
					className={`${styles.plusIcon} w-31 h-40 p-4 mr-4 shrink-0`}
				>
					<Plus
						size={50}
						color="rgb(0, 236, 81)"
						className="rounded-full border-2 border-dashed border-[rgb(0,236,81)] p-2"
					/>
				</div>

				{/* Scrollable Stories Container */}
				<div 
					ref={containerRef}
					className="flex snap-x snap-mandatory flex-row items-center overflow-x-hidden scroll-smooth"
					onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
				>
					{stories.map((story, key) => (
						<div key={key} className="snap-start mr-4 min-w-[124px] shrink-0">
							<Card
								username={story.username}
								file={story.file}
								profilePicture={story.profilePicture}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Right Arrow */}
			{canScrollRight && (
				<button 
					onClick={() => scroll('right')}
					className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				>
					<ChevronRight size={24} />
				</button>
			)}
		</div>
	);
}
