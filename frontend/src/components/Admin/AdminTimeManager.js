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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import './styles/Admin.css';

import AdminTimegroupCard from './Forms/AdminTimegroupCard'
import AdminToggleCard from './Forms/AdminToggleCard'

function AdminTimeManager() {


	const [loading, setLoading] = useState(true)

	const [categories, setCategories] = useState([])	
	const [timegroups, setTimegroups] = useState([])


	useEffect(() => {


		//fetch categories and product option groups
		const request1 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
		const request2 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/fetch/all")

		const requestCategories = Axios.post(request1)
		const requestTimegroups = Axios.post(request2)


		Axios.all([requestCategories, requestTimegroups])
		.then(Axios.spread((...responses) => {


			setCategories(responses[0].data)
			setTimegroups(responses[1].data)

			buildTimeSlots(15, '00:00:00', '24:00:00')
			.then((result) => {

				buildMarks(result)
				.then((result) => {

					setMarks(result)

					setLoading(false)
					

				})

			})


		}))
		.catch((err) => {
   			console.log("error ", err)});

	

	}, [])



	//helper function to generate time slots for a given slot interval, start and end times
	async function buildTimeSlots(interval, start, end) {
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



	function handleSliderChange(event, newValue) {

		setEditTimeSlider(newValue);
	};


	function handleDaysChange(value) {

		//turn string into int
		value = parseInt(value);
		//get temp array of current selected
		let tempDays = [...selectDays]
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



	const [editDrawer, setEditDrawer] = useState(false)
	const [editLoading, setEditLoading] = useState(true)
	const [editDrawerMode, setEditDrawerMode] = useState(false)

	const [selectCategories, setSelectCategories] = useState([])

	const [editId, setEditId] = useState(0)
	const [editName, setEditName] = useState('')
	const [editTimeSlider, setEditTimeSlider] = useState([])
	const [selectDays, setEditDays] = useState([])


	function handleEdit(sId, sName, sDays, sSlider) {

		//fetch all categories
		//fetch selected categories

		setEditLoading(true)
		setEditDrawer(true)
		setEditDrawerMode(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/fetch/categories", {
			timegroupId: sId,
		})
		.then((response) => {

			setEditId(sId)
			setEditName(sName)
			setEditTimeSlider(sSlider)
			setEditDays(sDays)

			buildSelectCategories(response.data)
			.then((result) => {

				setSelectCategories(result)
				setEditLoading(false)

			})
			
		})
		.catch((err) => {
   			console.log("error ", err)});

	}


	function handleEditClose() {

		setEditDrawer(false)
		setEditDrawerMode(false)
		setEditLoading(true)

		setEditId(0)
		setEditName('')
		setEditTimeSlider([])
		setEditDays([])

		setSelectCategories([])


	}

	function handleEditSubmit() {

		handleEditClose()
		setLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/update", {
			editId: editId,
			editName: editName,
			selectDays: selectDays,
			editFrom: marks[editTimeSlider[0]].time,
			editTo: marks[editTimeSlider[1]].time,
			selectCategories: selectCategories,
		})
		.then((response) => {

			//fetch categories and product option groups
			const request1 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
			const request2 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/fetch/all")

			const requestCategories = Axios.post(request1)
			const requestTimegroups = Axios.post(request2)


			Axios.all([requestCategories, requestTimegroups])
			.then(Axios.spread((...responses) => {

				setCategories(responses[0].data)
				setTimegroups(responses[1].data)
				setLoading(false)
						
			}))
			.catch((err) => {
	   			console.log("error ", err)});

		})
		.catch((err) => {
   			console.log("error ", err)});


	}

	function handleDelete() {

		handleEditClose()
		setLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/delete", {
			editId: editId,
		})
		.then((response) => {

			//fetch categories and product option groups
			const request1 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
			const request2 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/fetch/all")

			const requestCategories = Axios.post(request1)
			const requestTimegroups = Axios.post(request2)


			Axios.all([requestCategories, requestTimegroups])
			.then(Axios.spread((...responses) => {

				setCategories(responses[0].data)
				setTimegroups(responses[1].data)
				setLoading(false)
						
			}))
			.catch((err) => {
	   			console.log("error ", err)});

		})
		.catch((err) => {
   			console.log("error ", err)});

	}


	function handleAdd() {

		setEditDrawer(true)
		setEditLoading(false)
		setEditDrawerMode(false)

		setEditName('')
		setEditTimeSlider([40,56])
		setEditDays([])

		setSelectCategories([])

	}

	function handleAddSubmit() {


		handleEditClose()
		setLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/insert", {
			editName: editName,
			selectDays: selectDays,
			editFrom: marks[editTimeSlider[0]].time,
			editTo: marks[editTimeSlider[1]].time,
			selectCategories: selectCategories,
		})
		.then((response) => {

			//fetch categories and product option groups
			const request1 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
			const request2 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/timegroups/fetch/all")

			const requestCategories = Axios.post(request1)
			const requestTimegroups = Axios.post(request2)


			Axios.all([requestCategories, requestTimegroups])
			.then(Axios.spread((...responses) => {

				setCategories(responses[0].data)
				setTimegroups(responses[1].data)
				setLoading(false)
						
			}))
			.catch((err) => {
	   			console.log("error ", err)});

		})
		.catch((err) => {
   			console.log("error ", err)});


	}


	//timegroup edit input validation
	const [timegroupValid, setTimegroupValid] = useState(false)
	const timegroupSchema = Yup.object().shape({

		title: Yup.string().required(),
		days: Yup.array().min(1),
		categories: Yup.array().min(1),

	})

	useEffect(() => {

		timegroupSchema.validate({
			title: editName,
			days: selectDays,
			categories: selectCategories,
		})
		.then((response) => {
			setTimegroupValid(true)
		})
		.catch((err) => {
			setTimegroupValid(false)
		})

	}, [editName, selectDays, selectCategories, editTimeSlider])



	async function buildSelectCategories(data) {

		let result = []

		for(let row of data) {
			result.push(row.category_id)
		}
		return result

	}


	function handleSelectCategory(sId) {


		//get temp array of current selected
		let tempSelect = [...selectCategories]
		//try to find the selected element to see if its already been selected
		let found = tempSelect.find(el => el === sId)
		//found so already selected, so we unselect it now, we filter out the value
		if(found) {
			tempSelect = tempSelect.filter(el => el !== found)
			setSelectCategories(tempSelect)
		} else {
		//not found so not selected before, so we add it as a selection
			tempSelect.push(sId)
			setSelectCategories(tempSelect)
		}

	}




	return (
	<>

		<Grid container>

				<Grid item xs={12} style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'auto', backgroundColor: '#d9d9d994' }}>
					{loading && (
						<Fade in={loading}>
							<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
						</Fade>
					)}
					{!loading && (
					<>
						<Container maxWidth="md" sx={{ pt: 10 }}>
							<Grid container justifyContent="space-between" alignItems="center">
								<Grid item xs={8}>
									<Typography variant="h4">
										Horaires de menu
									</Typography>
								</Grid>
								<Grid item>
									<Button
										className="product-add-btn"
										disableElevation
										onClick={handleAdd}
									>
										<AddCircleIcon />
									</Button>
								</Grid>
							</Grid>
							
							<Divider color="black" sx={{ mt: '8px' }} />
							<Stack spacing={4} sx={{ pt: '12px', pb: '24px' }}>
								{timegroups.map((timegroup, index) => (

									<AdminTimegroupCard 
										timegroups={timegroups}
										timegroup={timegroup} 
										index={index}
										marks={marks}
										handleEdit={(sId, sName, sDays, sSlider) => handleEdit(sId, sName, sDays, sSlider)}
									/>

								))}
								
							</Stack>
						</Container>


						<Drawer classes={{ paper: "timegroup-edit-drawer", }} open={editDrawer} onClose={handleEditClose} anchor="bottom">
							<ButtonBase className="product-edit-close-btn" size="medium" onClick={handleEditClose}>
								<CloseIcon  />
							</ButtonBase>
							{editLoading && (
								<Fade in={editLoading}>
									<CircularProgress size={64} style={{position: 'absolute', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px', color: 'black'}} />
								</Fade>
							)}
							{!editLoading && (
								<Container sx={{ pt: '12vh' }}>
									<List>
										<ListItem>
											<Grid container justifyContent="space-between" alignItems="center">
												<Grid item xs={10}>
													<Typography variant="h5">
														Nom de la feuille de temps
													</Typography>
												</Grid>
											{editDrawerMode && (
											<>

												<Grid item>
													<Button
														className="product-delete-btn"
														disableElevation
														onClick={handleDelete}
													>
														<DeleteForeverIcon sx={{ height: '28px', width: '28px' }} />
													</Button>
												</Grid>

											</>
											)}
												
											</Grid>
										</ListItem>

										<ListItem>
											<TextField
												variant="outlined"
												value={editName}
												onChange={e => setEditName(e.target.value)}
												fullWidth
												InputProps={{
													className: 'text-input'
												}}

											 />
										</ListItem>
										
										<ListItem style={{display:'flex', justifyContent:'center'}}>
											<ToggleButtonGroup
												value={selectDays}
												onChange={(e) => handleDaysChange(e.target.value)}
												sx={{ mt: '32px' }}
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
										</ListItem>

										<ListItem>
											<Slider
												sx={{ height: '32px', borderRadius: 0, mt: '24px', mb: '32px' }}
												min={0}
												max={marks.length-1}
												marks={marks}
												step={null}
												classes={{
													mark: 'timeslider-mark',
													markLabel: 'timeslider-markLabel',
													thumb: 'timeslider-thumb',
													rail: 'timeslider-rail',
													track: 'timeslider-track',
													active: 'timeslider-active',
													
												}}
												value={editTimeSlider}
												onChange={handleSliderChange}
												valueLabelDisplay="off"
											/>
										</ListItem>

										<ListItem>
											<Grid container style={{display:'flex', justifyContent:'center'}} spacing={3} alignItems="center">
												<Grid item>
													<Chip
														label={
															<Typography variant="h4" sx={{ fontWeight: '200' }}>
																{marks[editTimeSlider[0]].time}
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
																{marks[editTimeSlider[1]].time}
															</Typography>  
														}
														className="timegroup-display-time"
													/>
												</Grid>
											</Grid>
										</ListItem>

										<Divider color="black" sx={{ mt: '32px', mb: '32px' }} />

										<ListItem>
											<Typography variant="h5" onClick={() => console.log(selectCategories)}>
												Sélection de catégories
											</Typography>
										</ListItem>

										<ListItem>
											<Grid container spacing={2}>
											{categories.map((category, index) => (

												<AdminToggleCard 
													item={category}
													idParam="category_id"
													nameParam="category_name"
													selectItems={selectCategories}
													index={index}
													handleSelect={(sId) => handleSelectCategory(sId)}
												/>

											))}
												
											</Grid>
										</ListItem>

										<ListItem sx={{ pt: '48px' }}>
											<Button
												disabled={!timegroupValid}
												fullWidth
												className="btn"
												disableElevation
												onClick={editDrawerMode ? handleEditSubmit : handleAddSubmit}
											>
												Sauvegarder
											</Button>
										</ListItem>

										</List>
								</Container>
							)}
						</Drawer>
					
					</>
					)}
			</Grid>
		</Grid>

	</>
	)

}
export default AdminTimeManager;