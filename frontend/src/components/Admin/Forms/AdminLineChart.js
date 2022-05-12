import React, { useState, useEffect } from 'react';
import { Interval, DateTime } from "luxon";

import { 
	CircularProgress,
	Fade
 } from '@mui/material'

import '../styles/Admin.css';


function AdminLineChart({ data, dateFrom, dateTo }) {

	const [loading, setLoading] = useState(false)


	//chart points
	const [chartPoints, setChartPoints] = useState([])

	//chart values
	const [yDataMax, setYDataMax] = useState(0)
	const [yChartMax, setYChartMax] = useState(0)
	const [yDataHalf, setYDataHalf] = useState(0)
	const [yChartMin, setYChartMin] = useState(0)

	useEffect(() => {

		console.log(dateFrom)
		console.log(dateTo)

		//set chart sales highest point, data max, data half, chart minimum
		getMax(data)
		.then((result) => {

			setYDataMax(result)
			setYChartMax(result * 1.5)
			setYDataHalf(result * 0.5)
			setYChartMin(0)

			sumSalesByDay(data)
			.then((result) => {
				setChartPoints(result)
				setLoading(false)
			})

			

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

	const [salesByDay, setSalesByDay] = useState([])

	//sum order totals grouped into days
	async function sumSalesByDay() {

		//array containing sorted sales data
		let salesArray = []

		const dateStart = DateTime.fromFormat(dateFrom, 'yyyy-MM-dd')
		const dateEnd = DateTime.fromFormat(dateTo, 'yyyy-MM-dd')

		//create interval object to step through
		let interval = Interval.fromDateTimes(dateStart, dateEnd)

		//helper stepper function to generate an iterator object for an array of day slots
		//given an interval object and an slot interval gap
		function* stepper(interval, gap) {
			//current selected property at start of the current hour
			let cursor = interval.start;

			//loop to the end
			while (cursor <= interval.end) {
				//pause execution and return current date
				yield cursor;
				//add 1 step of interval gap
				cursor = cursor.plus({ days: gap });
			}			
		}

		//loop through each day of the interval
		for(let step of stepper(interval, 1)) {

			//current sum of totals
			let daySum = 0

			//loop through each sale point
			for(let sale of data) {

				//date of sale converted into DateTime
				const saleDate = DateTime.fromISO(sale.order_delivery_time)

				//start and end of step in DateTime
				const stepStart = step
				const stepEnd = step.plus({ days: 1 })

				//interval between start and end of each step
				const stepInterval = Interval.fromDateTimes(stepStart, stepEnd)

				//check if date of sale falls inside the step interval
				if(stepInterval.contains(saleDate)) {

					//if it does, then add current day total to sale array
					daySum += sale.order_total

				}

			}
			salesArray.push(daySum)
		}

		console.log(salesArray)
		return salesArray;
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
				{chartPoints.map((element, index) => (
					<Point x={(chartWidth/chartPoints.length)*index} y={(chartHeight - element)} />
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
