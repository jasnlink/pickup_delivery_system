import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Interval ,DateTime } from "luxon";

import { 	
	Typography,
	ListItem,
	ListItemText,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Backdrop,
	CircularProgress,
	Fade,
	SvgIcon
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LoadingButton } from '@mui/lab';

import { ReactComponent as MainIcon } from './assets/noun-food-tray-3895876.svg';


function TimeSelectForm({ setStep, storeTimeHours, setOrderDate, setOrderTime }) {

	//current day of the week
	let [currentWeekday, setCurrentWeekday] = useState(0);	
	//selected day of the week
	let [selectWeekday, setSelectWeekday] = useState(0);

	//selected date
	let [selectDate, setSelectDate] = useState('');
	//dates selecton list
	let [dates, setDates] = useState('');

	//selected pickup/delivery time
	let [selectTime, setSelectTime] = useState('');
	//pickup/delivery time selection list
	let [time, setTime] = useState('');

	//page loading
	let [loading, setLoading] = useState(true);
	//submit button loading
	let [submitLoading, setSubmitLoading] = useState(false);
	//new data loading
	let [dataLoading, setDataLoading] = useState(false);

	// use refs in order to access most current data
	// state data is stale
	const currentWeekdayRef = useRef(currentWeekday);
	const selectWeekdayRef = useRef(selectWeekday);
	const selectTimeRef = useRef(selectTime);

	useEffect(() => {
		//get current time rounded to next quarter hour
		let currentRoundedTime = getCurrentRoundedTime();
		//get closing time
		getCloseTime(storeTimeHours)
		.then((result) => {

			//set the current day of the week, it is used to compare to the selected day to see if we selected today
			let weekday = DateTime.now().setZone("America/Toronto").get('weekday')

			setCurrentWeekday(weekday)
			currentWeekdayRef.current = weekday
			console.log(weekday)
			//check if store is closed by comparing current time to closing time
			//if it is closed then we offset by 1 day
			let offset = 0

			if(currentRoundedTime > result) {
				offset = 1
				weekday = DateTime.now().setZone("America/Toronto").plus({days:1}).get('weekday')
				setSelectWeekday(weekday)
				selectWeekdayRef.current = weekday
			} else {
				setSelectWeekday(weekday)
				selectWeekdayRef.current = weekday
			}


			Axios.post("http://localhost:3500/api/timegroup/hours/operation", {
				day: weekday,
			})
			.then((response) => {
				buildTimeSlots(response.data)
				.then((result) => {
					setTime(result)
					setSelectTime(result[0])
					selectTimeRef.current = result[0]
					buildDatesArray(offset)
					.then((res) => {
						setTimeout(() => {
							setLoading(false)
						}, 300)
						
					})
				})
			})
			.catch((err) => {
		       	console.log("error ", err)});

		})
		

	}, [])

	function handleSelectDate(e) {

		setSelectDate(e.target.value)
		let weekday = DateTime.fromFormat(e.target.value, 'yyyy-MM-dd').get('weekday')
		selectWeekdayRef.current = weekday
		setSelectWeekday(weekday)
		setDataLoading(true)
		Axios.post("http://localhost:3500/api/timegroup/hours/operation", {
			day: weekday,
		})
		.then((response) => {
			buildTimeSlots(response.data)
			.then((result) => {
				setTime(result)
				setSelectTime(result[0])
				selectTimeRef.current = result[0]
				setTimeout(() => {
					setDataLoading(false)
				}, 300)
			})
		})
		.catch((err) => {
		       	console.log("error ", err)});



		
	}


	//helper function to get the latest time in timegroups for closing hours
	async function getCloseTime(data) {

		var current = '';
		var max = '00:00:00';

		for(let i in data) {
			current = data[i].timegroup_to
			if(max <= current) {
				max = current
			}
		}
		return (max)
	}

	//function to build the dates select array
	//takes an offset to start from tomorrow if the store is closed right now
	async function buildDatesArray(offset) {
		
		//temp date array
		let dateArray = []
		let display = '';

		//loop 3 days in the future
		//start from tomorrow if offset
		for(let i = offset; i<=offset+3; i++) {
			let currentDate = DateTime.now().setZone("America/Toronto").plus({days:i}).toFormat('yyyy-MM-dd');
			//for a clean display
			if(i === 0) display = 'Aujourd\'hui';
			else if(i === 1) display = 'Demain';
			else {
				//string manipulation to make first letter upper case and remove 4th letter (a period)
				display = DateTime.now().setZone("America/Toronto").plus({days:i}).setLocale('fr').toFormat('EEE dd');
				var f = display.slice(0,1).toUpperCase()
				display = f+display.slice(1,3)+display.slice(4,display.length)
			}
			//need to substract back the offset from i when populating the array so we start from index 0
			dateArray[i-offset] = {date: currentDate, display: display};
		}
		//populate state
		setDates(dateArray)
		setSelectDate(dateArray[0].date)
		return dateArray;
		
	}
	//helper function to get the current time rounded to the next quarter hour
	function getCurrentRoundedTime() {

		let currentHour = DateTime.now().setZone("America/Toronto").get('hour');
		let currentMin = DateTime.now().setZone("America/Toronto").get('minute');
		let currentRoundedTime = roundToNext15Mins(currentHour, currentMin);
		currentRoundedTime = currentRoundedTime[0].hour+":"+currentRoundedTime[0].mins+":00"

		return currentRoundedTime;
	}

	//function to build time slots depending on the different open and closing timegroups
	//using getTimeSlots() helper function
	async function buildTimeSlots(data) {


		//a set so we only have unique values
		//need uniques because the timegroups from and to times may overlap each other
		let timeSlotSet = new Set;
		let currentRoundedTime = getCurrentRoundedTime()

		var result

		//loop through timegroups
		for(let hours of data) {
			//check if the current time is after opening hours
			//if it is then we generate starting from current time
			//this only applies if the selected day is today
			if (currentRoundedTime > hours.timegroup_from && currentWeekdayRef.current === selectWeekdayRef.current){
				//if current time is after closing hours, then we skip generation because the store is closed
				if (currentRoundedTime > hours.timegroup_to){
					continue;
				} else {
					result = await getTimeSlots(15, currentRoundedTime, hours.timegroup_to)
				}
				
			} else {
				//current time is before opening hours, so we generate the full list starting from opening hours
				result = await getTimeSlots(15, hours.timegroup_from, hours.timegroup_to)
			}
			for(let slot of result) {
				//add the set back into an array
				timeSlotSet.add(slot)
			}
		}
		let timeSlotArray = Array.from(timeSlotSet).sort();
		return timeSlotArray;
	}

	//helper function to round the given time to the next quarter hour
	function roundToNext15Mins(hour, mins) {
		let result = []

		mins = Math.ceil(mins/15)*15
		if(mins === 60) {
			mins = '00'
			hour++;
		}
		if(hour < 10) {
			hour = '0'+hour
		}
		result.push({ hour: hour, mins: mins })
		return result
	}

	//helper function to generate time slots for a given slot interval, start and end times
	async function getTimeSlots(interval, start, end) {
		//store results
		let timeArray = []
		//format start and end times
		let startDateTime = DateTime.fromFormat(start, 'HH:mm:ss');
		let endDateTime = DateTime.fromFormat(end, 'HH:mm:ss');
		//create interval object to step through
		let intervalDateTime = Interval.fromDateTimes(startDateTime, endDateTime)
		
		//helper stepper function to generate an iterator object for an array of time slots
		//given an interval object and an slot interval gap
		function* stepper(interval, intGap) {
			//current selected property at start of the current hour
			let cursor = interval.start.startOf("hour");
			//loop to the end
			while (cursor < interval.end) {
				//pause execution and return current time
				yield cursor;
				//add 1 step of interval gap
				cursor = cursor.plus({ minutes: intGap });
			}
		}

		//populate result array with intervals
		for(var step of stepper(intervalDateTime, 15)) {
		  timeArray.push(step.toFormat('HH:mm'))
		}

		return timeArray;
	}

	function handleSelectTime(e) {
		setSelectTime(e.target.value)
		selectTimeRef.current = e.target.value
	}
	async function initOrder() {
		try {
			setOrderDate(selectDate)
			setOrderTime(selectTime)
		}
		finally {
			setStep(14);
		}
	}
	function handleSubmit() {
		setSubmitLoading(true);
		//data coming back too fast, wait 1 second
		setTimeout(() => {
			initOrder();
		}, 1000)
	}

	return (<>
				{loading && (
					<Fade in={loading} sx={{ color: '#000' }} unmountOnExit>
						<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
					</Fade>
				)}
				{!loading && (
					<>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<SvgIcon component={MainIcon} sx={{ width: '138px', height: '138px' }} inheritViewBox />
					</ListItem>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<ListItemText primary={<Typography variant="h2">Pour quand?</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItem>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<FormControl variant="standard">
							<InputLabel />
							<Select
								value={selectDate}
								onChange={(e) => handleSelectDate(e)}
								disabled={dataLoading}
								sx={{ 
									fontSize: '32px',
								    height: 64,
								    width: '100%',
								    padding: '0 12px', 
								}}>
								{dates.map((value, index) => (
									<MenuItem key={index} value={value.date}>{value.display}</MenuItem>
								))}
							</Select>
						</FormControl>
					</ListItem>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<FormControl variant="standard">
							<InputLabel />
							<Select
								value={selectTimeRef.current}
								onChange={(e) => handleSelectTime(e)}
								disabled={dataLoading}
								sx={{ 
									fontSize: '32px',
								    height: 64,
								    width: '100%',
								    padding: '0 12px', 
								}}>
								{time.map((value, index) => (
									<MenuItem key={index} value={value}>{index === 0 && currentWeekday === selectWeekday ? 'Dès que possible' : value}</MenuItem>
								))}
							</Select>
						</FormControl>
					</ListItem>
					<ListItem style={{marginTop: 48, display:'flex', justifyContent:'center'}}>
						<LoadingButton
								variant="contained"
							  	size="large" 
							  	onClick={() => handleSubmit()} 
							  	fullWidth
							  	disabled={dataLoading}
							  	loading={submitLoading}
						>
							  	Continuer
						</LoadingButton>
					</ListItem>
					</>
				)}

		</>)


}

export default TimeSelectForm;