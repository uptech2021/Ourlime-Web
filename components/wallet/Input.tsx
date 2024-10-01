import styles from './wallet.module.css';
import React, { useState, useRef, useEffect } from 'react';

export default function Input() {
	const [inputValue, setInputValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.width = `${Math.max(1, inputValue.length + 1)}ch`;
		}
	}, [inputValue]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = /^\d{0,9}(\.\d{0,2})?$/;
		if ((regex.test(value) || value === '') && value.length <= 11) {
			setInputValue(value);
		}
	};
	return (
		<div className="flex min-w-3 items-center justify-center">
			<span className="text-4xl">$</span>
			<input
				ref={inputRef}
				type="number"
				placeholder="0"
				inputMode="numeric"
				pattern="[0-9]*"
				min="1"
				maxLength={11}
				className={styles.noSpinners}
				value={inputValue}
				onChange={handleInputChange}
			/>
		</div>
	);
}
