import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime, Interval } from "luxon";
import * as Yup from "yup";
import io from 'socket.io-client';

import { 	
	Typography,
	Container,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	Divider,
	AppBar,
	Box,
	Toolbar,
	IconButton,
	FormControl,
	FilledInput,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	FormHelperText,
	Button,
	TextField,
	Input,
	Grid,
	Fade,
	CircularProgress,
	Drawer,
	Paper,
	Chip,
	ToggleButton,
	ToggleButtonGroup,
	ButtonBase,
	Alert,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	Collapse,
	Card,
	CardActionArea,
	Stack,
	Slider
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import '../styles/Admin.css';

function AdminTimegroupCard({ timegroups, timegroup, index }) {

	const [loading, setLoading] = useState(true)
	

	useEffect(() => {

		getTimeSlots(15, '00:00:00', '24:00:00')
		.then((result) => {
			
			buildMarks(result)

			.then((result) => {

				setMarks(result)
				setLoading(false)

			})
		})

	}, [])


	const [marks, setMarks] = useState([])

	async function buildMarks(data) {

		let result = []

		for(let i = 0; i<data.length; i++) {

			if(i % 8 === 0) {
				result.push({
					value: i,
					label: data[i],
					time: data[i]
				})
			} else {
				result.push({
					value: i,
					time: data[i]
				})
			}
			

		}

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
			while (cursor <= interval.end) {
				//pause execution and return current time
				yield cursor;
				//add 1 step of interval gap
				cursor = cursor.plus({ minutes: intGap });
			}
		}

		//populate result array with intervals
		for(var step of stepper(intervalDateTime, interval)) {
		  timeArray.push(step.toFormat('HH:mm'))
		}

		return timeArray;
	}

	

	const [value, setValue] = useState([20, 37]);

	function handleChange(event, newValue) {

		setValue(newValue);
	};

	const [editDays, setEditDays] = useState([1])

	function handleDaysChange(value) {

		console.log(editDays)

		//turn string into int
		value = parseInt(value);
		//get temp array of current selected
		let tempDays = [...editDays]
		//try to find the selected element to see if its already been selected
		let found = tempDays.find((el) => el === value)

		//not found so not selected before, so we add it as a selection
		if(!found) {
			tempDays.push(value)
			setEditDays(tempDays)
		} else {
		//found so already selected, so we unselect it now, we filter out the value
			tempDays = tempDays.filter((el) => el !== value)
			setEditDays(tempDays)
		}

	}

	return (
	<>
		<Card key={timegroup.timegroup_id} component="div" sx={{ p: '24px 24px' }} square>
		{loading && (
			<Fade in={loading}>
				<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!loading && (
			<Grid container alignItems="center" spacing={2}>
				<Grid container item xs={12} alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h6" onClick={() => console.log(editDays)}>
							{timegroup.timegroup_name}
						</Typography>
					</Grid>
					<Grid item>
						<ButtonBase 
							className="btn"
						>
							<EditIcon />
						</ButtonBase>
					</Grid>
				</Grid>
				<Grid item xs={12} style={{display:'flex', justifyContent:'center'}}>
					<ToggleButtonGroup
						value={editDays}
						onChange={(e) => handleDaysChange(e.target.value)}
					>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={1}
						>
							LUN
						</ToggleButton>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={2}
						>
							MAR
						</ToggleButton>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={3}
						>
							MER
						</ToggleButton>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={4}
						>
							JEU
						</ToggleButton>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={5}
						>
							VEN
						</ToggleButton>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={6}
						>
							SAM
						</ToggleButton>
						<ToggleButton
							className="timegroup-days"
							classes={{ selected: "nav-item-selected" }}
							value={7}
						>
							DIM
						</ToggleButton>
					</ToggleButtonGroup>
				</Grid>
				<Grid item xs={12}>
					<Slider
						sx={{ height: '32px', borderRadius: 0 }}
						min={0}
						max={marks.length-1}
						marks={marks}
						step={null}
						value={value}
						onChange={handleChange}
						valueLabelDisplay="off"
					/>
				</Grid>
				<Grid item container xs={12} style={{display:'flex', justifyContent:'center'}} spacing={3} alignItems="center">
					<Grid item>
						<Chip
							label={
								<Typography variant="h4" sx={{ fontWeight: '200' }}>
									{marks[value[0]].time}
								</Typography>  
							}
							className="timegroup-display-time"
						/>
						
					</Grid>
					<Grid item>
						<Typography variant="h4">
							-
						</Typography>
					</Grid>
					<Grid item>
						<Chip
							label={
								<Typography variant="h4" sx={{ fontWeight: '200' }}>
									{marks[value[1]].time}
								</Typography>  
							}
							className="timegroup-display-time"
						/>
					</Grid>
				</Grid>
			</Grid>
		)}
		</Card>
	</>
	)

}
export default AdminTimegroupCard;