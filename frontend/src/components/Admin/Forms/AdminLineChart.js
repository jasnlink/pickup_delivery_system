import React from 'react';

function AdminLineChart({data}) {

	const [loading, setLoading] = useState(true)

	//get max point of an array
	async function getMax(data) {
		let result = 0
		console.log(data)
		for(let sale of data) {
			result = Math.max(result, sale.order_total)
		}

		return result

	}


	const SVG_WIDTH = 720;
	const SVG_HEIGHT = 640;

	// time on X axis
	const x0 = 50;
	const xAxisLength = SVG_WIDTH - x0 * 2;

	// sales on Y axis
	const y0 = 50;
	const yAxisLength = SVG_HEIGHT - y0 * 2;

	const xAxisY = y0 + yAxisLength;

	//set chart sales highest point, data max, data half, chart minimum
	getMax(data)
	.then((result) => {

		var yDataMax = result
		var yChartMax = yDataMax * 1.5
		var yDataHalf = yDataMax * 0.5
		var yChartMin = 0

		console.log('yDataMax',yDataMax)
		console.log('yChartMax',yChartMax)
		console.log('yDataHalf',yDataHalf)
		console.log('yChartMin',yChartMin)

	})
		

	return (
		<>
		{loading && (
					<Fade in={loading}>
						<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
					</Fade>
				)}
		{!loading && (
		<>

		    <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
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
