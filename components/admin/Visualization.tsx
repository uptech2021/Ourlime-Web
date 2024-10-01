'use client';

import React from 'react';
import * as d3 from 'd3';
import { Data } from '@/types/global';

const Visualization: React.FC = () => {
	// Define your data
	const data: Data[] = [
		{ month: 'Jan', users: 10, posts: 10, pages: 2, groups: 0 },
		{ month: 'Feb', users: 120, posts: 60, pages: 5, groups: 3 },
		{ month: 'Mar', users: 328, posts: 1120, pages: 11, groups: 5 },
	];

	// Define margins and dimensions
	const width: number = 800;
	const height: number = 500;
	const marginTop: number = 40;
	const marginRight: number = 40;
	const marginBottom: number = 60;
	const marginLeft: number = 60;

	// Define color scale
	const colorScale: d3.ScaleOrdinal<string, string> = d3
		.scaleOrdinal<string, string>()
		.domain(['users', 'posts', 'pages', 'groups'])
		.range(['#80c762', '#d55a5a', '#f2b92b', '#ff7373']);

	// Define scales
	const xScale: d3.ScaleBand<string> = d3
		.scaleBand<string>()
		.domain(data.map((d) => d.month))
		.range([marginLeft, width - marginRight])
		.padding(0.2);

	const yScale: d3.ScaleLinear<number, number> = d3
		.scaleLinear<number, number>()
		.domain([
			0,
			d3.max(data, (d) =>
				Math.max(d.users, d.posts, d.pages, d.groups)
			) as number,
		])
		.range([height - marginBottom, marginTop]);

	// State for tooltip
	// const [tooltip, setTooltip] = useState<{
	// 	month: string;
	// 	category: string;
	// 	value: number;
	// } | null>(null);

	return (
		<div className="statistics">
			<svg width={width} height={height}>
				{data.map((d) => (
					<rect
						key={d.month}
						x={xScale(d.month) || 0}
						y={yScale(Math.max(d.users, d.posts, d.pages, d.groups))}
						width={xScale.bandwidth()}
						height={
							height -
							marginBottom -
							yScale(Math.max(d.users, d.posts, d.pages, d.groups))
						}
						fill={colorScale('users')}
						// onMouseOver={() =>
						// 	setTooltip({ month: d.month, category: 'users', value: d.users })
						// }
						// onMouseOut={() => setTooltip(null)}
					/>
				))}
			</svg>
		</div>
	);
};

export default Visualization;
