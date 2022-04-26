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
import SaveIcon from '@mui/icons-material/Save';

import './styles/Admin.css';

import AdminRenderMap from './Forms/AdminRenderMap';


function AdminDeliveryZoneManager({ storeLat, storeLng, adminToken, adminUsername }) {

	const [loading, setLoading] = useState(true)
	const [zones, setZones] = useState([])

	const [zoneSelectId, setZoneSelectId] = useState(0)
	const [marks, setMarks] = useState([])

	useEffect(() => {

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/deliveryzones/fetch/all", null, 
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			setZones(response.data)

			buildMarks()
			.then((result) => {
				setMarks(result)
				setLoading(false)
			})
			
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}, [])

	const [editPrice, setEditPrice] = useState('')
	const [editMinimum, setEditMinimum] = useState('')
	const [sliderValue, setSliderValue] = useState(0)

	

	function handleZoneSelect(sId, sRange, sPrice, sMinimum) {
		if(zoneSelectId !== sId) {
			
			getRange(sRange, marks)
			.then((result) => {
				setSliderValue(result)
				setZoneSelectId(sId)
				setEditPrice(sPrice)
				setEditMinimum(sMinimum)
			})
			
		}
	}

	async function getRange(range, marks) {

		const value = parseInt(range*2)
		const result = marks.find(row => row.value === value)
		return result.value
		
	}

	function handleSliderChange(event, newValue) {
		setSliderValue(newValue);
	};

	async function buildMarks() {
		let result = []

		for(let m = 0; m <= 50; m++) {
			if(m % 4 === 0 && m !== 0) {
				result.push({
					value: m,
					label: m/2,
				})
			} else {
				result.push({
					value: m,
				})
			}
			
		}

		return result;
	}

	function handleZoneSave() {

		const range = ((marks[sliderValue].value)/2)

		setLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/deliveryzones/update", {
			zoneSelectId: zoneSelectId,
			editPrice: editPrice,
			editMinimum: editMinimum,
			editRange: range,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			setZones(response.data)
			setLoading(false)
			
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}

	function handleZoneAdd() {

		setLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/deliveryzones/insert", null, 
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			setZones(response.data.result)
			getAddSelect(response.data.lastInsertID, response.data.result)
			.then((result) => {
				handleZoneSelect(result.delivery_zone_id, result.delivery_zone_range, result.delivery_zone_price, result.delivery_zone_order_min)
				setLoading(false)
			})
			
			
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}

	async function getAddSelect(sId, data) {

		const cursor = data.find((el) => el.delivery_zone_id === sId)

		return cursor;
	}

	function handleZoneDelete() {

		setLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/deliveryzones/delete", {
			zoneSelectId: zoneSelectId,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			setZones(response.data)
			handleZoneUnselect()
			setLoading(false)
			
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}

	function handleZoneUnselect() {

		setSliderValue(0)
		setZoneSelectId(0)
		setEditPrice('')
		setEditMinimum('')


	}

	//delivery zone edit input validation
	const [zoneValid, setZoneValid] = useState(false)
	const zoneSchema = Yup.object().shape({

		price: Yup.number().min(0).required(),
		minimum: Yup.number().min(0).required(),
	})

	useEffect(() => {

		zoneSchema.validate({
			price: editPrice,
			minimum: editMinimum,
		})
		.then((response) => {
			setZoneValid(true)
		})
		.catch((err) => {
			setZoneValid(false)
		})

	}, [editPrice, editMinimum, sliderValue])

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
				<Grid container>
					<Grid item xs={2}>
						<Paper sx={{ minHeight: '100vh' }} elevation={8} square>
							<List sx={{ pt: '8vh' }}>
								<ListItem>
									
									<Grid container justifyContent="space-between" alignItems="center">
										<Grid item xs={9}>
											<ListItemText primary={<Typography variant="h6" style={{ fontWeight: '500' }}>Zones</Typography>} />
										</Grid>
										<Grid item xs={3}>
											<Button
												className="zone-add-btn"
												classes={{
													root: 'zone-add-btn-root'
												}}
												disableElevation
												onClick={handleZoneAdd}
											>
												<AddCircleIcon style={{ height: '18px', width: '18px' }} />
											</Button>
										</Grid>
									</Grid>

								</ListItem>
									{zones.map((zone, index) => (

										<ListItemButton 
											key={zone.delivery_zone_id} 
											selected={zoneSelectId === zone.delivery_zone_id} 
											onClick={() => handleZoneSelect(zone.delivery_zone_id, zone.delivery_zone_range, zone.delivery_zone_price, zone.delivery_zone_order_min)}
											classes={{ selected: "nav-item-selected" }}
										>
											<ListItemText primary={(zone.delivery_zone_range)+" KM"} />
										</ListItemButton>

									))}
							</List>
						</Paper>
					</Grid>

					<Grid item xs={10} style={{ maxHeight: '100vh', overflow: 'auto', backgroundColor: '#d9d9d994' }}>
						<Container sx={{ pt: 2, maxWidth: '100vw' }}>

							<Typography variant="h4">
								Zones de livraison
							</Typography>
								

							<Divider color="black" sx={{ mt: '8px', mb: '16px' }} />

							<div style={{ position: 'relative' }}>

								<AdminRenderMap storeLat={storeLat} storeLng={storeLng} range={((marks[sliderValue]['value'])/2)} />
								<Fade in={zoneSelectId !== 0}>
									<Paper sx={{ position: 'absolute', width: '6%', zIndex: '10', bottom: 0, mb: '12px', ml: '12px', p: '8px' }} elevation={1} square>
										<Stack spacing={2}>
											<Button
												className="zone-save-btn"
												classes={{
													root: 'zone-btn-root'
												}}
												disableElevation
												disabled={zoneSelectId === 0 || !zoneValid}
												onClick={handleZoneSave}
											>
												<SaveIcon style={{ height: '20px', width: '20px' }} />
											</Button>
											<Button
												className="zone-delete-btn"
												classes={{
													root: 'zone-btn-root'
												}}
												disableElevation
												disabled={zoneSelectId === 0}
												onClick={handleZoneDelete}
											>
												<DeleteForeverIcon style={{ height: '20px', width: '20px' }} />
											</Button>
										</Stack>
									</Paper>
								</Fade>
								<Fade in={zoneSelectId !== 0}>
									<Paper sx={{ position: 'absolute', width: '76%', zIndex: '10', bottom: 0, right: 0, mb: '12px', mr: '10%', p: '8px' }} elevation={1} square>
										<List style={{ pt: 0, pb: 0 }}>
											<ListItem sx={{ pt: 0, pb: 0, zIndex: 10 }}>
												<Grid container alignItems="center" justifyContent="space-between">

													<Grid container item xs={5} alignItems="flex-end">
														<Grid item>
															<Typography variant="h6" sx={{ pt: 0, pb: 0, pr: '8px' }}>
																Distance
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="subtitle1" sx={{ pt: 0, pb: 0, pr: '8px' }}>
																{zoneSelectId === 0 ? "" : (sliderValue/2).toFixed(1)+" KM"}
															</Typography>
														</Grid>
													</Grid>

													<Grid container item xs={3} alignItems="flex-end">
														<Grid item>
															<Typography variant="h6" sx={{ pt: 0, pb: 0, pr: '8px' }}>
																Frais
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextField
																disabled={zoneSelectId === 0}
																variant="standard"
																value={editPrice}
																onChange={(e) => setEditPrice(e.target.value)}
																inputProps={{
																	type: 'number',
																}}
																InputProps={{
																	className: 'zones-input',
																}}

															 />
														</Grid>
													</Grid>

													<Grid container item xs={4} alignItems="center">
														<Grid item>
															<Typography variant="h6" sx={{ pt: 0, pb: 0, pr: '8px' }}>
																Total min.
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextField
																disabled={zoneSelectId === 0}
																variant="standard"
																value={editMinimum}
																onChange={(e) => setEditMinimum(e.target.value)}
																inputProps={{
																	type: 'number',
																}}
																InputProps={{
																	className: 'zones-input',
																}}

															 />
														</Grid>
													</Grid>

												</Grid>
											</ListItem>
											<ListItem sx={{ pt: '4px', pb: 0 }}>

												<Slider
													sx={{ height: '10px', borderRadius: 0, mt: '4px', mb: '4px' }}
													min={1}
													max={marks.length-1}
													marks={marks}
													step={1}
													classes={{
														root: 'zoneslider-root',
														mark: 'zoneslider-mark',
														markLabel: 'zoneslider-markLabel',
														thumb: 'zoneslider-thumb',
														rail: 'zoneslider-rail',
														track: 'zoneslider-track',
														active: 'zoneslider-active',
													}}
													track={true}
													value={sliderValue}
													onChange={handleSliderChange}
													valueLabelDisplay="off"
													disabled={zoneSelectId === 0}
												/>

											</ListItem>
										</List>
										
									</Paper>
								</Fade>
							</div>
							

						</Container>
					</Grid>
				</Grid>
				</>
				)}
			</Grid>
		</Grid>

	</>
	)


}
export default AdminDeliveryZoneManager;