'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Switch } from '@nextui-org/react';

export default function SwitchButton() {
	const [isSwitched, setIsSwitched] = useState(false);
	function handleSwitch() {
		setIsSwitched((prev) => !prev);
	}
	return (
		<Switch
			color={!isSwitched ? 'danger' : 'success'}
			aria-label="Automatic updates"
			onClick={handleSwitch}
			thumbIcon={({ isSelected, className }) =>
				isSelected ? (
					<Check className={`${className} switched text-green-400`} />
				) : (
					<X className={`${className} button text-red-400`} />
				)
			}
		/>
	);
}
