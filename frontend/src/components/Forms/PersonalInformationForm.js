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
	ButtonBase
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';



function PersonalInformationForm({ userFirstName, userLastName, userEmail, userPhone, setUserFirstName, setUserLastName, setUserEmail, setUserPhone, setOrderNote }) {


	const [inputFirstName, setInputFirstName] = useState('')
	const [inputLastName, setInputLastName] = useState('')
	const [inputEmail, setInputEmail] = useState('')
	const [inputPhone, setInputPhone] = useState('')

	const [inputNote, setInputNote] = useState('')

	var form;

	if(!userFirstName && !inputLastName && !inputEmail && !inputPhone) {

		form = (

			<>
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
			<ListItem sx={{ pb: '24px' }}>
				<TextField 
					label="Ajouter une note" 
					multiline 
					minRows={4}
					value={inputNote}
            		onChange={(e) => setInputNote(e.target.value)} 
					fullWidth />
			</ListItem>
			</>

		)

	} else {

		form = (
			<>
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
			<ListItem sx={{ pb: '24px' }}>
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

			</>
		)

	}
	

	return (
		<>
			<ListItem disablePadding sx={{ mb: '24px' }}>
				<ListItemText primary={<Typography variant="h4" style={{ fontWeight: 900 }}>Vos informations</Typography>} style={{display:'flex', justifyContent:'center'}} />
			</ListItem>
			{form}
			<Divider />

		</>
	)
}

export default PersonalInformationForm;