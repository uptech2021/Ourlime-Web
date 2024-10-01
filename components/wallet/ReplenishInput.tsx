'use client';
import { Button } from '@nextui-org/react';

import { CheckCheck } from 'lucide-react';
import Input from './Input';

export default function ReplenishInput() {
	return (
		<div className="flex flex-col justify-center gap-5 border-t-1">
			<p className="text-center">Replenish my balance</p>

			<Input />

			<Button className="mx-auto text-white" startContent={<CheckCheck />}>
				Continue
			</Button>
		</div>
	);
}
