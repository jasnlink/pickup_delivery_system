import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";

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
	Dialog,
	Link,
	SvgIcon
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import EditIcon from '@mui/icons-material/Edit';

import { ReactComponent as MainIcon } from './assets/noun-read-3895940.svg';

function PersonalInformationForm({ userFirstName, userLastName, userEmail, userPhone, setUserFirstName, setUserLastName, setUserEmail, setUserPhone }) {

	const [personalDialog, setPersonalDialog] = useState(false)
	const [editInfo, setEditInfo] = useState(false)

	const [inputFirstName, setInputFirstName] = useState('')
	const [inputLastName, setInputLastName] = useState('')
	const [inputEmail, setInputEmail] = useState('')
	const [inputPhone, setInputPhone] = useState('')


	useEffect(() => {
		if(!userFirstName || !userLastName || !userEmail || !userPhone) {
			setPersonalDialog(true)
		} else {
			setPersonalDialog(false)
		}

	}, [])



	function handleEditInfo() {

		setInputFirstName(userFirstName)
		setInputLastName(userLastName)
		setInputEmail(userEmail)
		setInputPhone(userPhone)
		setPersonalDialog(true)

	}

	function handlePersonalConfirm() {

		setUserFirstName(inputFirstName)
		setUserLastName(inputLastName)
		setUserEmail(inputEmail)
		setUserPhone(inputPhone)
		setPersonalDialog(false)

	}


	return (
		<>
			<ListItem disablePadding sx={{ mb: '24px' }}>
				<ListItemText primary={<Typography variant="h4" style={{ fontWeight: 900 }}>Vos informations</Typography>} style={{display:'flex', justifyContent:'center'}} />
			</ListItem>
			<ListItem sx={{ pb: '24px' }}>
					<Grid container alignItems="center" justifyContent="space-between">
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: 400 }}>
								Nom
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: 500 }}>
								{userFirstName} {userLastName}
							</Typography>
						</Grid>
					</Grid>
				</ListItem>
				<ListItem sx={{ pb: '24px' }}>
					<Grid container alignItems="center" justifyContent="space-between">
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: 400 }}>
								Courriel
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: 500 }}>
								{userEmail}
							</Typography>
						</Grid>
					</Grid>
				</ListItem>
				<ListItem sx={{ pb: '6px' }}>
					<Grid container alignItems="center" justifyContent="space-between">
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: 400 }}>
								Téléphone
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: 500 }}>
								{userPhone}
							</Typography>
						</Grid>
					</Grid>
				</ListItem>
				<ListItem sx={{ pb: '12px' }} style={{display:'flex', justifyContent:'center'}}>
					<Button onClick={() => handleEditInfo()} startIcon={<EditIcon />}>
						Modifier
					</Button>
				</ListItem>
			<Divider />
			<Dialog open={personalDialog} fullWidth sx={{ m: 0 }}>
				<List>
					<ListItem disablePadding sx={{ mt: '8px' }} style={{display:'flex', justifyContent:'center'}} >
						<SvgIcon component={MainIcon} sx={{ width: '100px', height: '100px' }} inheritViewBox />
					</ListItem>
					<ListItem sx={{ pb: '12px' }}>
						<ListItemText primary={<Typography variant="h3" style={{ fontWeight: 900 }}>Vos informations</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItem>
					
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-firstname">Prénom</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-firstname"
		            			label="Prénom"
		            			value={inputFirstName}
		            			onChange={(e) => setInputFirstName(e.target.value)}
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-lastname">Nom</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-lastname"
		            			label="Nom"
		            			value={inputLastName}
		            			onChange={(e) => setInputLastName(e.target.value)}
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-email">Courriel</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-email"
		            			label="Courriel"
		            			value={inputEmail}
		            			onChange={(e) => setInputEmail(e.target.value)}
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-phone">Téléphone</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-phone"
		            			label="Téléphone"
		            			value={inputPhone}
		            			onChange={(e) => setInputPhone(e.target.value)}
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem sx={{ pt: '12px', pb: '12px' }}>
						<Button variant="contained" size="large" onClick={() => handlePersonalConfirm()} fullWidth>
							Confirmer
						</Button>
					</ListItem>
				</List>
				</Dialog>

	</>
	)
}

export default PersonalInformationForm;