import React, { useState, useEffect } from 'react';
import { Interval, DateTime } from "luxon";

import { 
	CircularProgress,
	Fade
 } from '@mui/material'

import '../styles/Admin.css';


function AdminLineChart({ data, dateFrom, dateTo }) {

	const [loading, setLoading] = useState(false)

	//chart values
	//the data's highest reached value
	const [yDataMax, setYDataMax] = useState()
	//the chart's topmost value
	const [yChartMax, setYChartMax] = useState()

	//chart y axis labels
	const [yAxisLabels, setYAxisLabels] = useState([])
	//chart x axis labels
	const [xAxisLabels, setXAxisLabels] = useState([])

	//each data point in the chart representing sales for that day
	const [points, setPoints] = useState([])

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

					setLoading(false)

				})
				
			})

	}, [])


	//wait for yChartMax then build y axis labels
	useEffect(() => {


		if(yChartMax && points) {

			//build y axis labels
			buildYAxisLabels(numYAxisTicks, longDivision(yChartMax, 5))
			.then((result) => {
				setYAxisLabels(result)
			})

			//step size to increment till next tick
			//ex: 4 ticks needs 3 increments
			const xAxisStep = points.length/(numXAxisTicks-1)

			//build x axis labels
			buildXAxisLabels(numXAxisTicks, xAxisStep)
			.then((result) => {
				setXAxisLabels(result)
			})
		}

	}, [yChartMax, points])



/*****************************************************************************************************
*						array building helper functions
*****************************************************************************************************/


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


/*****************************************************************************************************
*						chart constants
*****************************************************************************************************/

	//fallback chart dimensions
	const fallbackChartWidth = 720;
	const fallbackChartHeight = 360;

	//chart dimensions set to outer div dimensions that is set to 100%
	let chartWidth = document.getElementById('chart-root').clientWidth;
	let chartHeight = chartWidth*0.6;

	//chart padding distance
	const chartPadding = 50;

	//number of y axis ticks to use
	const numYAxisTicks = 6

	//number of x axis ticks to use
	const numXAxisTicks = 6


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
	const heightPerTickRatio = yAxisLength/yChartMax

	//spacing ratio between each point
	//use axis length and divide by number of points -1
	const pointScatterRatio = xAxisLength/(points.length-1);



/*****************************************************************************************************
*						chart drawing functions
*****************************************************************************************************/

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
					x={x0-(chartPadding*0.16)} 
					y={y0+(yAxisLength-(index*spacing))}
					alignment-baseline="central"
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

		
		//reverse label orders because the chart is drawn inversed
		let labels = [...xAxisLabels]
		labels = labels.reverse()

		//spacing between each label, divide the y Axis Length by number of ticks to use -1
		//(there are only 5 spaces between 6 labels)
		const spacing = ((points.length-1)/(labels.length-1))*(pointScatterRatio)		

		return (
			<>

			{labels.map((label, index) => {

				return (

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
							y={xAxisY+(chartPadding*0.5)}
							text-anchor="middle"
							font-size="20"
							class="chart-labels"
						>
							{label}
						</text>
					</>

				)
			
			})}
			</>
		)

	}

	//point drawing function
	function DataPoint({ x, y, r=2 }) {
		return (
			<circle cx={x} cy={y} r={r} />
		)
	}

	//draw data line connecting each point in the graph
	//prevX, prevY = previous point
	//curX, curY = current point
	function DataLine({ prevX, curX, prevY, curY }) {

		return (
			<line
		        x1={prevX}
		        y1={prevY}
		        x2={curX}
		        y2={curY}
		        stroke="black"
		        stroke-width="4"
		      />
		)
	}


/*****************************************************************************************************/
/*****************************************************************************************************/



	return (
		<>
		{!!loading && (
			<Fade in={loading}>
				<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!loading && (
		<>
			<div id="chart-root" style={{ height: '100%', width: '100%' }}>
				<Chart width={chartWidth} height={chartHeight}>
					{points.map((element, index, array) => {

						return (
						<>
							<YAxis />
							<XAxis />
							<DataPoint 
								x={x0+(pointScatterRatio)*index}
								y={xAxisY-(element.sale*heightPerTickRatio)} 
							/>
							{index > 0 && (

								<DataLine
									prevX={x0+(pointScatterRatio)*(index-1)}
									prevY={xAxisY-((array[index-1]?.sale)*heightPerTickRatio)}
									curX={x0+(pointScatterRatio)*index}
									curY={xAxisY-(element.sale*heightPerTickRatio)}
								/>

							)}
							
						</>
						)
					})}
				</Chart>
			</div>

		</>
		)}
	</>
	  )

}

export default AdminLineChart;
