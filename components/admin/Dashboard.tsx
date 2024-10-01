'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

import styles from './dashboard.module.css';
import {
	Flag,
	Gamepad2,
	MessageSquareMore,
	PenLine,
	ShieldHalf,
	Users,
	UserSearch,
} from 'lucide-react';

const chartData = [
	{ name: 'Users', value: 30028 },
	{ name: 'Posts', value: 1120 },
	{ name: 'Pages', value: 300 },
	{ name: 'Communities', value: 300 },
	{ name: 'Online Users', value: 3000 },
	{ name: 'Comments', value: 400 },
	{ name: 'Games', value: 50 },
	{ name: 'Messages', value: 13040 },
];

const chartConfig = {
	value: {
		label: 'Value',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export default function Dashboard() {
	return (
		<div className="dashboard rounded-xl bg-[#f4f5fd] px-2">
			<div className="my-3 flex flex-col lg:flex-row lg:flex-wrap lg:gap-10">
				{chartData.map((item) => (
					<div key={item.name} className={styles.stats}>
						<p>{`Total ${item.name}`}</p>
						<div className="bottom flex items-center gap-3 text-xl font-bold">
							{getIcon(item.name)}
							{item.value.toLocaleString()}
						</div>
					</div>
				))}
			</div>

			<Card className="mt-10">
				<CardHeader>
					<CardTitle>Dashboard Statistics</CardTitle>
					<CardDescription>Overview of key metrics</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig}>
						<BarChart width={600} height={300} data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="name"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator="dashed" />}
							/>
							<Bar dataKey="value" fill="var(--color-value)" radius={4} />
						</BarChart>
					</ChartContainer>
				</CardContent>
				<CardFooter className="flex-col items-start gap-2 text-sm">
					<div className="flex gap-2 font-medium leading-none">
						Trending metrics <TrendingUp className="h-4 w-4" />
					</div>
					<div className="leading-none text-muted-foreground">
						Showing total counts for various metrics
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

function getIcon(name: string) {
	switch (name) {
		case 'Users':
			return <Users className={`${styles.statsIcon} bg-[#cad1f6]`} />;
		case 'Posts':
			return <PenLine className={`${styles.statsIcon} bg-[#c0ebfe]`} />;
		case 'Pages':
			return <Flag className={`${styles.statsIcon} bg-[#fff0c5]`} />;
		case 'Communities':
			return <ShieldHalf className={`${styles.statsIcon} bg-[#f5c7e4]`} />;
		case 'Online Users':
			return <UserSearch className={`${styles.statsIcon} bg-[#c2f0da]`} />;
		case 'Comments':
			return (
				<MessageSquareMore className={`${styles.statsIcon} bg-[#cad1f6]`} />
			);
		case 'Games':
			return <Gamepad2 className={`${styles.statsIcon} bg-[#cad1f6]`} />;
		case 'Messages':
			return (
				<MessageSquareMore className={`${styles.statsIcon} bg-[#c0ebfe]`} />
			);
		default:
			return null;
	}
}
