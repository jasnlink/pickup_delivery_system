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

function AdminTimegroupCard({ timegroups, timegroup, index, marks, handleEdit }) {

	const [loading, setLoading] = useState(true)
	const [selectDays, setSelectDays] = useState([])


	useEffect(() => {

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/fetch/days", {
			timegroupId: timegroup.timegroup_id,
		})
		.then((response) => {

			buildDays(response.data)
			.then((result) => {

				setSelectDays(result)

				buildSlider(timegroup, marks)
				.then((result) => {
					setSliderValue(result)
					setLoading(false)

				})

			})

			
		})
		.catch((err) => {
   			console.log("error ", err)});



	}, [])



	async function buildSlider(timegroup, marks) {


		const fromTime = DateTime.fromFormat(timegroup.timegroup_from, 'HH:mm:ss').toFormat('HH:mm');
		const toTime = DateTime.fromFormat(timegroup.timegroup_to, 'HH:mm:ss').toFormat('HH:mm');

		const fromValue = marks.find(row => row.time === fromTime)
		const toValue = marks.find(row => row.time === toTime)

		return [fromValue.value, toValue.value]


	}



	const [sliderValue, setSliderValue] = useState([]);


	async function buildDays(data) {

		let result = []

		for(let row of data) {
			result.push(row.timegroup_day)
		}

		return result;
	}


	

	return (
	<>
		<Card key={timegroup.timegroup_id} component="div" sx={{ p: '32px 32px' }} square>
		{loading && (
			<Fade in={loading}>
				<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!loading && (
			<Grid container alignItems="center" spacing={2} sx={{ mt: '2px', mb: '24px' }}>
				<Grid container item xs={12} alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h6">
							{timegroup.timegroup_name}
						</Typography>
					</Grid>
					<Grid item>
						<ButtonBase 
							className="btn"
							onClick={(sId, sName, sDays, sSlider) => handleEdit(timegroup.timegroup_id, timegroup.timegroup_name, selectDays, sliderValue)}
						>
							<EditIcon />
						</ButtonBase>
					</Grid>
				</Grid>
				<Grid item xs={12} style={{display:'flex', justifyContent:'center'}}>
					<ToggleButtonGroup
						value={selectDays}
						sx={{ mt: '32px' }}
						disabled
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
						sx={{ height: '32px', borderRadius: 0, mt: '24px', mb: '32px' }}
						min={0}
						max={marks.length-1}
						marks={marks}
						step={null}
						value={sliderValue}
						valueLabelDisplay="off"
						disabled
					/>
				</Grid>
				<Grid item container xs={12} style={{display:'flex', justifyContent:'center'}} spacing={3} alignItems="center">
					<Grid item>
						<Chip
							label={
								<Typography variant="h4" sx={{ fontWeight: '200' }}>
									{marks[sliderValue[0]].time}
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
									{marks[sliderValue[1]].time}
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