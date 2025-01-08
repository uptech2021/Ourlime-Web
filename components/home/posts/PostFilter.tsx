import { Button } from '@nextui-org/react';
import { Camera, File, FileText, Filter, Map, Music, Video } from 'lucide-react';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './postform.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from "gsap";
import { handleSignOut } from '@/helpers/Auth';
import { useRouter } from 'next/navigation';

export default function PostFilter({
	showDropdown,
	selected,
	setSelected,
	setShowDropdown,
}: {
	showDropdown: boolean;
	selected: string;
	setSelected: React.Dispatch<SetStateAction<string>>;
	setShowDropdown: React.Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();

	const [viewMenu1, setViewMenu1] = useState(false);
	const [viewMenu2, setViewMenu2] = useState(false);
	const [viewMenu3, setViewMenu3] = useState(false);

	const menuRef1 = useRef<HTMLUListElement>(null);
	const menuRef2 = useRef<HTMLUListElement>(null);
	const menuRef3 = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const animateMenu = (ref: React.RefObject<HTMLUListElement>, isVisible: boolean) => {
			if (ref.current) {
				gsap.to(ref.current, {
					y: isVisible ? 0 : -10,
					opacity: isVisible ? 1 : 0,
					duration: 0.4,
					ease: "power2.out",
					display: isVisible ? 'block' : 'none',
				});
			}
		};

		animateMenu(menuRef1, viewMenu1);
	}, [viewMenu1]);

	useEffect(() => {
		const animateMenu = (ref: React.RefObject<HTMLUListElement>, isVisible: boolean) => {
			if (ref.current) {
				gsap.to(ref.current, {
					y: isVisible ? 0 : -10,
					opacity: isVisible ? 1 : 0,
					duration: 0.4,
					ease: "power2.out",
					display: isVisible ? 'block' : 'none',
				});
			}
		};

		animateMenu(menuRef2, viewMenu2);
	}, [viewMenu2]);

	useEffect(() => {
		const animateMenu = (ref: React.RefObject<HTMLUListElement>, isVisible: boolean) => {
			if (ref.current) {
				gsap.to(ref.current, {
					y: isVisible ? 0 : -10,
					opacity: isVisible ? 1 : 0,
					duration: 0.4,
					ease: "power2.out",
					display: isVisible ? 'block' : 'none',
				});
			}
		};

		animateMenu(menuRef3, viewMenu3);
	}, [viewMenu3]);

	const handleClick = (value: string) => {
		setSelected(value);
		showDropdown == true && setShowDropdown(false);
	};

	const signOut  = () => {
		handleSignOut(router)
	}

	return (
		<div className="flex flex-col gap-5">

			{/* Mobile Navbar */}
			<div className="p-3 -mt-[1.25rem] flex flex-row md:hidden justify-between bg-[#D9D9D9] rounded-b-lg">
				
				<div className='relative'>
					<div onClick={() => setViewMenu1((prev) => !prev)}>
						<Image
							className="cursor-pointer"
							src="/images/calender.svg"
							alt="calender"
							width={20}
							height={20}
						/>
					</div>

					<ul
						className="p-2 absolute bg-[#D9D9D9] z-40 -ml-2.5 space-y-2 max-w-[200px]"
						ref={menuRef1}
						style={{ display: 'none' }} // Initially hidden
					>
						{/* <li><Link href="/events">Events</Link></li> */}
						<li><Link href="/articles">My Articles</Link></li>
						<li><Link href="/advertise">Advertise</Link></li>
					</ul>
				</div>

				<div className='relative'>
					<div onClick={() => setViewMenu2((prev) => !prev)}>
						<Image
							className="cursor-pointer"
							src="/images/handshake.svg"
							alt="pin"
							width={20}
							height={20}
						/>
					</div>

					<ul
						className="p-2 absolute bg-[#D9D9D9] z-40 -ml-2.5 space-y-2 max-w-[200px]"
						ref={menuRef2}
						style={{ display: 'none' }} // Initially hidden
					>
						<li><Link href="/jobs">Jobs</Link></li>
						<li><Link href="/articles">Articles</Link></li>
						<li><Link href="/market">Market</Link></li>

						{/* <li><Link href="/people">Find Friends</Link></li> */}
						{/* <li><Link href="/communities">Communities</Link></li> */}
					</ul>
				</div>

				<div className='relative'>
					<div onClick={() => setViewMenu3((prev) => !prev)}>
						<Image
							className="cursor-pointer"
							src="/images/profile.svg"
							alt="pin"
							width={20}
							height={20}
						/>
					</div>

					<ul
						className="p-2 absolute bg-[#D9D9D9] z-40 -ml-10 space-y-2 max-w-[200px]"
						ref={menuRef3}
						style={{ display: 'none' }} // Initially hidden
					>
						<li><Link href="/profile">Profile</Link></li>
						{/* <li><Link href="/saved">Saved Posts</Link></li> */}
						<li><Link href="/album">Album</Link></li>
						<li><Link href="/admin">Admin</Link></li>
						<li onClick={signOut} className="cursor-pointer">Sign out</li>
					</ul>
				</div>
			</div>

			<div className="relative flex flex-row gap-3 overflow-x-auto scrollbar-hide">
				<div
					onClick={() => setShowDropdown((prev: boolean) => !prev)}
					className={`${styles.filterIcons}`}
				>
					<Filter />
				</div>

				<Button
					onClick={() => handleClick('all')}
					className={`${styles.filterIcons} ${selected === 'all' ? 'bg-greenTheme' : 'bg-none'
						}`}
				>
					<FileText />
					All
				</Button>

				<Button
					onClick={() => handleClick('photos')}
					className={`${styles.filterIcons} ${selected === 'photos' ? 'bg-greenTheme' : 'bg-none'
						}`}
				>
					<Camera />
					Photos
				</Button>
				<Button
					onClick={() => handleClick('videos')}
					className={`${styles.filterIcons} ${selected === 'videos' ? 'bg-greenTheme' : 'bg-none'
						}`}
				>
					<Video />
					Videos
				</Button>
				<Button
					onClick={() => handleClick('sounds')}
					className={`${styles.filterIcons} ${selected === 'sounds' ? 'bg-greenTheme' : 'bg-none'
						}`}
				>
					<Music />
					Sound
				</Button>
				<Button
					onClick={() => handleClick('files')}
					className={`${styles.filterIcons} ${selected === 'files' ? 'bg-greenTheme' : 'bg-none'
						}`}
				>
					<File />
					Files
				</Button>
				<Button
					onClick={() => handleClick('locations')}
					className={`${styles.filterIcons} ${selected === 'locations' ? 'bg-greenTheme' : 'bg-none'
						}`}
				>
					<Map width="100" height="100" />
					<span>Location</span>
				</Button>
			</div>
		</div>
	);
}
