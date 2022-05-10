import React, { useState, useEffect } from 'react';

import { 
	CircularProgress,
	Fade
 } from '@mui/material'

import '../styles/Admin.css';


function AdminLineChart({data}) {

	const [loading, setLoading] = useState(false)

	//chart values
	const [yDataMax, setYDataMax] = useState(0)
	const [yChartMax, setYChartMax] = useState(0)
	const [yDataHalf, setYDataHalf] = useState(0)
	const [yChartMin, setYChartMin] = useState(0)

	useEffect(() => {

		//set chart sales highest point, data max, data half, chart minimum
		getMax(data)
		.then((result) => {

			setYDataMax(result)
			setYChartMax(result * 1.5)
			setYDataHalf(result * 0.5)
			setYChartMin(0)

			setLoading(false)

		})

	},[])


	//helper function to get biggest value of an array
	async function getMax(data) {
		let result = 0
		for(let sale of data) {
			result = Math.max(result, sale.order_total)
		}

		return result

	}


	//chart dimensions
	const chartWidth = 720;
	const chartHeight = 640;
	const dataLength = data.length


	// X axis -> time
	// X axis starting point
	const x0 = 50;
	const xAxisLength = chartWidth - x0 * 2;

	// Y axis -> sales
	// Y axis starting point
	const y0 = 50;
	const yAxisLength = chartHeight - y0 * 2;

	//X and Y axis crossing point
	const xAxisY = y0 + yAxisLength;


	//chart generation function
	function Chart({ children, width, height }) {
		return (
			<svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
				{children}
			</svg>
		)
	}

	//point generation function
	function Point({ x, y, r=4 }) {
		return (
			<circle cx={x} cy={y} r={r} />
		)
	}


		

	return (
		<>
		{!!loading && (
					<Fade in={loading}>
						<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
					</Fade>
		)}
		{!loading && (
		<>

			<Chart width={chartWidth} height={chartHeight}>
				{data.map((element, index) => (
					<Point x={(chartWidth/dataLength)*index} y={element.order_total} />
				))}
			</Chart>

		    <svg width={chartWidth} height={chartHeight}>
		      {/* X axis */}
		      <line
		        x1={x0}
		        y1={xAxisY}
		        x2={x0 + xAxisLength}
		        y2={xAxisY}
		        stroke="black"
		      />
		      <text x={x0 + xAxisLength + 5} y={xAxisY + 4}>
		        time
		      </text>

		      {/* Y axis */}
		      <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="black" />
		      <text x={x0} y={y0 - 8} textAnchor="middle">
		        sales
		      </text>
		    </svg>

		</>
		)}
	</>
	  )

}

export default AdminLineChart;
