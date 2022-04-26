import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
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
	Switch,
	FormControlLabel,
	FormGroup
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

import AdminOptiongroupCard from './Forms/AdminOptiongroupCard'
import AdminOptionCard from './Forms/AdminOptionCard'
import AdminError from './Forms/AdminError'

function AdminOptionManager({ adminToken, adminUsername }) {


	const [loading, setLoading] = useState(true)

	const [options, setOptions] = useState([])
	const [optiongroups, setOptiongroups] = useState([])



	useEffect(() => {


		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/optiongroups/fetch/all", null, 
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			setOptiongroups(response.data)
			setLoading(false)

		})
		.catch((err) => {
   			console.log("error ", err)});
	

	}, [])


	const [editId, setEditId] = useState(0)
	const [editName, setEditName] = useState('')
	const [editRequired, setEditRequired] = useState(false)
	const [editMaxChoices, setEditMaxChoices] = useState(0)

	const [isIncluded, setIsIncluded] = useState(false)

	const [editDrawer, setEditDrawer] = useState(false)
	const [editDrawerMode, setEditDrawerMode] = useState(false)


	function handleOptiongroupAdd() {

		setEditDrawerMode(false)
		setEditDrawer(true)

		setEditName('');
		setEditRequired(false)
		setEditMaxChoices(0)

	}

	function handleAddSubmit() {

		setLoading(true);
	
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/optiongroups/insert", {
			editName: editName,
			editRequired: editRequired,
			editMaxChoices: editMaxChoices,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			handleEditClose();
			setOptiongroups(response.data);
			setLoading(false);

		})

	}


	const [optionsLoading, setOptionsLoading] = useState(false)


	function handleOptiongroupEdit(sId, sName, sRequired, sMaxChoices) {

		setEditDrawerMode(true);
		setEditDrawer(true);
		setOptionsLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/options/fetch/optiongroup", {
			sId: sId,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			setOptions(response.data)
			setOptionsLoading(false)

			if(response.data.length) {

				if(response.data[0].option_price === 0) {
					setIsIncluded(true)
				}

			}
			

			setEditId(sId);	
			setEditName(sName);
			setEditRequired(sRequired);
			setEditMaxChoices(sMaxChoices);

		})
		.catch((err) => {
   			console.log("error ", err)});

		

	}


	function handleEditClose() {

		setEditDrawerMode(false)
		setEditDrawer(false)

		setEditId(0);	
		setEditName('');
		setEditRequired(false)
		setEditMaxChoices(0)
		setIsIncluded(false)

	}


	function handleEditDelete() {

		setLoading(true);

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/optiongroups/delete", {
			editId: editId,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			handleEditClose();
			setOptiongroups(response.data);
			setLoading(false);

		})

	}

	function handleAddSubmit() {

		setLoading(true);

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/optiongroups/insert", {
			editName: editName,
			editRequired: editRequired,
			editMaxChoices: editMaxChoices,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			handleEditClose();
			setOptiongroups(response.data);
			setLoading(false);

		})

	}

	function handleEditSubmit() {

		setLoading(true);

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/optiongroups/update", {
			editId: editId,
			editName: editName,
			editRequired: editRequired,
			editMaxChoices: editMaxChoices,
			isIncluded: isIncluded,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {

			handleEditClose();
			setOptiongroups(response.data);
			setLoading(false);

		})

	}


	//optiongroup edit input validation
	const [editOptiongroupValid, setEditOptiongroupValid] = useState(false)
	const optiongroupSchema = Yup.object().shape({

		title: Yup.string().required(),
		maxChoices: Yup.number().integer().min(1).required(),
	})

	useEffect(() => {

		optiongroupSchema.validate({
			title: editName,
			maxChoices: editMaxChoices,
		})
		.then((response) => {
			setEditOptiongroupValid(true)
		})
		.catch((err) => {
			setEditOptiongroupValid(false)
		})

	}, [editName, editMaxChoices])


	const [optionEditId, setOptionEditId] = useState(0)
	const [optionEditName, setOptionEditName] = useState('')
	const [optionEditPrice, setOptionEditPrice] = useState(0)


	const [optionEditDrawer, setOptionEditDrawer] = useState(false)
	const [optionEditDrawerMode, setOptionEditDrawerMode] = useState(false)


	function handleInclude(checked) {

		if(!checked) {


			setOptionsLoading(true)

			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/options/fetch/optiongroup", {
				sId: editId,
			},
			{ headers: {
				'access-token': adminToken,
				'access-username': adminUsername
			}})
			.then((response) => {

				setOptions(response.data)
				setOptionsLoading(false)
				setIsIncluded(checked)

			})
			.catch((err) => {
	   			console.log("error ", err)});


		} else {

			setIsIncluded(checked)

		}
		
	}

	function handleOptionEdit(sId, sName, sPrice) {

		setOptionEditDrawerMode(true)
		setOptionEditDrawer(true)
		setOptionEditId(sId)
		setOptionEditName(sName)
		setOptionEditPrice(sPrice)

	}


	function handleOptionEditClose() {

		setOptionEditDrawerMode(false)
		setOptionEditDrawer(false)
		setOptionEditId(0)
		setOptionEditName('')
		setOptionEditPrice(0)

	}

	function handleOptionEditSubmit() {

		setOptionsLoading(true);
		setOptionEditDrawer(false)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/options/update", {
			editId: editId,
			optionEditId: optionEditId,
			optionEditName: optionEditName,
			optionEditPrice: optionEditPrice,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			handleOptionEditClose();
			setOptions(response.data);
			setOptionsLoading(false);
		})

	}

	function handleOptionAdd() {

		setOptionEditDrawerMode(false)
		setOptionEditDrawer(true)
		setOptionEditName('')
		setOptionEditPrice(0)

	}

	function handleOptionAddSubmit() {

		setOptionsLoading(true);
		setOptionEditDrawer(false)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/options/insert", {
			editId: editId,
			optionEditName: optionEditName,
			optionEditPrice: optionEditPrice,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			handleOptionEditClose();
			setOptions(response.data);
			setOptionsLoading(false);
		})

	}

	function handleOptionDelete() {

		setOptionsLoading(true);
		setOptionEditDrawer(false)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/options/delete", {
			editId: editId,
			optionEditId: optionEditId,
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			handleOptionEditClose();
			setOptions(response.data);
			setOptionsLoading(false);
		})

	}

	//option edit input validation
	const [optionValid, setOptionValid] = useState(false)
	const optionSchema = Yup.object().shape({

		title: Yup.string().required(),
		price: Yup.number().min(0).required(),
	})

	useEffect(() => {

		optionSchema.validate({
			title: optionEditName,
			price: optionEditPrice,
		})
		.then((response) => {
			setOptionValid(true)
		})
		.catch((err) => {
			setOptionValid(false)
		})

	}, [optionEditName, optionEditPrice])



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
						<Container maxWidth="sm" sx={{ pt: 6 }}>
							<Grid container justifyContent="space-between" alignItems="center">
								<Grid item xs={8}>
									<Typography variant="h4">
										Groupes d'options
									</Typography>
								</Grid>
								<Grid item>
									<Button
										className="product-add-btn"
										disableElevation
										onClick={handleOptiongroupAdd}
									>
										<AddCircleIcon />
									</Button>
								</Grid>
							</Grid>
							
							<Divider color="black" sx={{ mt: '8px' }} />
							<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
								{optiongroups.map((optiongroup, index) => (

									<AdminOptiongroupCard 
										optiongroups={optiongroups}
										optiongroup={optiongroup} 
										index={index}
										handleOptiongroupEdit={(sId, sName, sRequired, sMaxchoices) => handleOptiongroupEdit(sId, sName, sRequired, sMaxchoices)} 
									/>

								))}
								
							</Stack>
						</Container>

						<Drawer classes={{ paper: 'option-edit-drawer' }} anchor="bottom" open={optionEditDrawer} onClose={handleOptionEditClose}>

							<ButtonBase className="option-edit-close-btn" size="medium" onClick={handleOptionEditClose}>
								<CloseIcon  />
							</ButtonBase>

							<Container sx={{ pt: '12vh' }}>
								<List sx={{ mt: '28px' }}>

									<ListItem>
										<Grid container justifyContent="space-between" alignItems="center">
											<Grid item xs={9}>
												<Typography variant="h5">
													Nom de l'option
												</Typography>
											</Grid>
										{optionEditDrawerMode && (
										<>

											<Grid item>
												<Button
													className="product-delete-btn"
													disableElevation
													onClick={handleOptionDelete}
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
											value={optionEditName}
											onChange={e => setOptionEditName(e.target.value)}
											fullWidth
											InputProps={{
												className: 'text-input'
											}}

										 />
									</ListItem>

									<ListItem>
										<Typography variant="h5">
											Prix
										</Typography>
									</ListItem>

									<ListItem>
										<TextField
											disabled={isIncluded}
											variant="outlined"
											type="number"
											value={isIncluded ? 0 : optionEditPrice}
											onChange={e => setOptionEditPrice(e.target.value)}
											fullWidth
											InputProps={{
												className: 'text-input'
											}}

										 />
									</ListItem>

									<ListItem sx={{ pt: '24px' }}>
										<Button
											fullWidth
											className="btn"
											disableElevation
											disabled={!optionValid}
											onClick={optionEditDrawerMode ? handleOptionEditSubmit : handleOptionAddSubmit}
										>
											Sauvegarder
										</Button>
									</ListItem>

								</List>
							</Container>
						</Drawer>




						<Drawer classes={{ paper: "optiongroup-edit-drawer", }} open={editDrawer} onClose={handleEditClose} anchor="bottom">
							<ButtonBase className="product-edit-close-btn" size="medium" onClick={handleEditClose}>
								<CloseIcon  />
							</ButtonBase>
							{optionsLoading && (
								<Fade in={optionsLoading}>
									<CircularProgress size={64} style={{position: 'absolute', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px', color: 'black'}} />
								</Fade>
							)}
							{!optionsLoading && (
								<Container sx={{ pt: '100px' }}>
									<List>
										<ListItem>
											<Grid container justifyContent="space-between" alignItems="center">
												<Grid item xs={10}>
													<Typography variant="h5">
														Nom du groupe d'option
													</Typography>
												</Grid>
											{editDrawerMode && (
											<>

												<Grid item>
													<Button
														className="product-delete-btn"
														disableElevation
														onClick={handleEditDelete}
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

										<ListItem>
											<Grid container alignItems="center" justifyContent="space-between">
												<Grid item xs={8}>
													<Typography variant="h5" onClick={() => console.log(editRequired)}>
														Nombre de choix
													</Typography>
												</Grid>
												<Grid item>
													<FormGroup>

														<FormControlLabel 
															label="Obligatoire" 
															labelPlacement="start"
															control={
																<Switch 
																	checked={editRequired}
																	onChange={(e) => setEditRequired(e.target.checked)}
																	color="primary" 
																/>} 
															/>

													</FormGroup>
												</Grid>
											</Grid>
										</ListItem>

										<ListItem>
											<TextField
												variant="outlined"
												value={editMaxChoices}
												onChange={e => setEditMaxChoices(e.target.value)}
												fullWidth
												inputProps={{
													type: 'number'
												}}
												InputProps={{
													className: 'text-input'
												}}

											 />
										</ListItem>
										{editDrawerMode && (
										<>

											<Divider color="black" sx={{ mt: '32px', mb: '32px' }} />
											<ListItem sx={{pb: '24px', backgroundColor: '#d9d9d994'}}>
												<Grid container alignItems="center" justifyContent="space-between">
													<Grid item xs={6}>
														<Grid container direction="row" alignItems="center" spacing={3}>
															<Grid item>
																<Typography variant="h5">
																	Options
																</Typography>
															</Grid>
															<Grid item>
																<FormGroup>

																	<FormControlLabel 
																		label="Inclut" 
																		labelPlacement="end"
																		control={
																			<Switch 
																				checked={isIncluded}
																				onChange={e => handleInclude(e.target.checked)}
																				color="primary" 
																			/>} 
																		/>

																</FormGroup>
																
															</Grid>
														</Grid>
													</Grid>
													<Grid item>
														
													</Grid>
													<Grid item>
														<Button
															className="product-add-btn"
															disableElevation
															onClick={handleOptionAdd}
														>
															<AddCircleIcon />
														</Button>
													</Grid>
												</Grid>
											</ListItem>

											<ListItem sx={{pb: '24px', backgroundColor: '#d9d9d994'}}>
												<Stack spacing={2} sx={{ width: '88%' }}>
												{!!options.length && (
												<>
													{options.map((option, index) => (
													<>
														{option.optgroup_id === editId && (


															<AdminOptionCard 
																option={option}
																options={options}
																index={index}
																handleOptionEdit={(sId, sName, sPrice) => handleOptionEdit(sId, sName, sPrice)}
																isIncluded={isIncluded}
															/>


														)}
														
													</>
													))}
												</>
												)}
													
												</Stack>
											</ListItem>
										</>
										)}

										<ListItem sx={{ pt: '24px' }}>
											<Button
												disabled={!editOptiongroupValid}
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
export default AdminOptionManager;