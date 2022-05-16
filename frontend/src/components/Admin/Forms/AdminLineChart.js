import React, { useState, useEffect } from 'react';
import { Interval, DateTime } from "luxon";

import { 
	CircularProgress,
	Fade
 } from '@mui/material'

import '../styles/Admin.css';


function AdminLineChart({ data, dateFrom, dateTo }) {

	const [loading, setLoading] = useState(false)

	//chart y axis labels
	const [yAxisLabels, setYAxisLabels] = useState([])
	//chart x axis labels
	const [xAxisLabels, setXAxisLabels] = useState([])

	//each point in the chart representing sales for that day
	const [points, setPoints] = useState([])

	//chart values

	//the data's highest reached value
	const [yDataMax, setYDataMax] = useState()
	//the chart's topmost value
	const [yChartMax, setYChartMax] = useState()
	//chart half point
	const [yDataHalf, setYDataHalf] = useState(0)
	//chart lowest value
	const [yChartMin, setYChartMin] = useState(0)



	//number of y axis ticks to use
	const numYAxisTicks = 6

	//number of x axis ticks to use
	const numXAxisTicks = 6

	useEffect(() => {

		

			sumSalesByDay(data)
			.then((result) => {

				setPoints(result)

				//set chart sales highest point, data max, data half, chart minimum
				getDataMax(result)
				.then((result) => {

					setYDataMax(result)

					//set chart maximum
					//it is set to 1.25 times the highest value the data reaches, rounded to nearest 10
					setYChartMax(Math.ceil((result * 1.25)/10)*10)
					setYDataHalf(result * 0.5)
					setYChartMin(0)

					setLoading(false)

				})
				
			})

	}, [])


	//wait for yChartMax then build y axis labels
	useEffect(() => {


		if(yChartMax && points) {
			console.log('yChartMax',yChartMax)
			console.log('points#####',points)

			//build y axis labels
			buildYAxisLabels(numYAxisTicks, longDivision(yChartMax, 5))
			.then((result) => {
				console.log('yaxislabels',result)
				setYAxisLabels(result)
			})

			//step size to increment till next tick
			//ex: 4 ticks needs 3 increments
			const xAxisStep = points.length/(numXAxisTicks-1)

			//build x axis labels
			buildXAxisLabels(numXAxisTicks, xAxisStep)
			.then((result) => {
				console.log('xaxislabels',result)
				setXAxisLabels(result)
			})
		}

	}, [yChartMax, points])


	//helper function to build y axis labels array
	//numTicks for number of label increments to add to y axis
	//multiple is the step in each label increment
	async function buildYAxisLabels(numTicks, multiple) {

		let result = [];
		for(let i = 0; i < numTicks; i++) {
			result.push(Math.round(i*multiple))
		}
		return result

	}

	//helper function to build y axis labels array
	//numTicks for number of label increments to add to y axis
	//multiple is the step in each label increment
	async function buildXAxisLabels(numTicks, multiple) {

		let result = [];
		let cursor = 0;

		for(let i = 0; i < numTicks; i++) {

			if(i === 0) {
				cursor = Math.round(i*multiple)
			} else {
				cursor = (Math.round(i*multiple))-1
			}

			result.push(points[cursor].date)
			
		}
		return result

	}


	//long division function used to generate the multiplication multiple for each tick of data on the axis
	function longDivision(n,d){
	    var num = n + "",
	        numLength = num.length,
	        remainder = 0,
	        answer = '',
	        i = 0;

	    while( i < numLength + 3){
	        var digit = i < numLength ? parseInt(num[i]) : 0;

	        if (i == numLength){
	            answer = answer + ".";
	        }

	        answer = answer + Math.floor((digit + (remainder * 10))/d);
	        remainder = (digit + (remainder * 10))%d;
	        i++;
	    }
	    return parseFloat(answer);
	}

	//helper function to get biggest value of an array
	async function getDataMax(data) {
		let result = 0
		for(let day of data) {
			result = Math.max(result, day.sale)
		}

		return result
	}


	//sum order totals grouped into days
	async function sumSalesByDay() {

		//array containing sorted sales data
		let salesArray = []

		//starting and ending date of interval
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

			//start and end of step in DateTime
			const stepStart = step
			const stepEnd = step.plus({ days: 1 })

			//interval between start and end of each step
			const stepInterval = Interval.fromDateTimes(stepStart, stepEnd)

			//sum of sales for current day
			let daySum = 0

			//loop through each sale point
			for(let sale of data) {

				//date of sale converted into DateTime
				const saleDate = DateTime.fromISO(sale.order_delivery_time)

				//check if date of sale falls inside the step interval
				if(stepInterval.contains(saleDate)) {

					//if it does, then add current day total to sale array
					daySum += sale.order_total

				}

			}
			//push in each new sale of the day after each day iteration
			salesArray.push({
				date: step.toFormat('d MMMM', { locale: "fr" }),
				sale: daySum
			})
		}

		return salesArray;
	}


/********************************************************************/	

	//chart dimensions
	const chartWidth = 720;
	const chartHeight = 640;

	//chart padding distance
	const chartPadding = 50;

	//number of days
	const dataLength = data.length

	// X axis -> time
	// X axis starting point from left side with a padding of 50
	const x0 = 0+chartPadding;

	// X axis length,
	// must pad right side twice the distance of the left side,
	// once for the left padding distance,
	// second time for the right padding distance
	const xAxisLength = chartWidth - (x0 * 2);

	// Y axis -> sales
	// Y axis starting point from top side with a padding of 50
	const y0 = 0+chartPadding;

	// Y axis length
	const yAxisLength = chartHeight - (y0 * 2);

	//X and Y axis crossing point, (0, 0) point on chart
	//start from top side, add y axis length to get to the bottom
	const xAxisY = y0 + yAxisLength;

	//ratio to how much height to attribute for each point of increase in the chart data
	//divide the axis length by the highest point in the chart
	const heightPerPointRatio = yAxisLength/yChartMax

	//ratio to how much width to attribute for each point of increase in the chart data
	//divide the axis length by the number to spaces between each tick
	const widthPerPointRatio = xAxisLength/(numXAxisTicks-1)


/********************************************************************/	


	//chart drawing function
	function Chart({ children, width, height }) {
		return (
			<svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
				{children}
			</svg>
		)
	}

	//Y axis drawing function
	function YAxis() {

		//spacing between each label, divide the y Axis Length by number of ticks to use -1
		//(there are only 5 spaces between 6 labels)
		const spacing = (yAxisLength/(numYAxisTicks-1))
		//don't need reverse label orders because the chart is drawn inversed
		const labels = [...yAxisLabels]

		return (
			<>

			{labels.map((label, index) => (
			<>
				<line 
					x1={0} 
					y1={y0+(yAxisLength-(index*spacing))} 
					x2={x0+xAxisLength} 
					y2={y0+(yAxisLength-(index*spacing))} 
					stroke="black"
				/>
				<text 
					x={x0-4} 
					y={y0+(yAxisLength-(index*spacing))}
					text-anchor="end"
					font-size="20"
					class="chart-labels"
				>
					{label}
				</text>
			</>
			))}
			</>
		)
	}

	//X axis drawing function
	function XAxis() {

		//spacing between each label, divide the y Axis Length by number of ticks to use -1
		//(there are only 5 spaces between 6 labels)
		const spacing = widthPerPointRatio
		//reverse label orders because the chart is drawn inversed
		let labels = [...xAxisLabels]
		labels = labels.reverse()

		return (
			<>

			{labels.map((label, index) => (
			<>
				<line 
					x1={x0+(xAxisLength-(index*spacing))} 
					y1={xAxisY+chartPadding} 
					x2={x0+(xAxisLength-(index*spacing))} 
					y2={y0} 
					stroke="black"
				/>
				<text 
					x={x0+(xAxisLength-(index*spacing))} 
					y={xAxisY+34}
					text-anchor="middle"
					font-size="20"
					class="chart-labels"
				>
					{label}
				</text>
			</>
			))}
			</>
		)

	}

	//point drawing function
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
				{points.map((element, index) => {

					return (
					<>
						<YAxis />
						<XAxis />
						<Point 
							x={x0+((xAxisLength/points.length)*index)}
							y={xAxisY-(element.sale*heightPerPointRatio)} 
						/>

						{/* X axis */}
					      <line
					        x1={x0}
					        y1={xAxisY}
					        x2={x0 + xAxisLength}
					        y2={xAxisY}
					        stroke="black"
					      />
					    {/* Y axis */}
		      				<line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="black" />

					</>
					)
				})}
			</Chart>

		</>
		)}
	</>
	  )

}

export default AdminLineChart;
