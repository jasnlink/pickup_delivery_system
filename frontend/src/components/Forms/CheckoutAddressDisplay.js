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



function CheckoutAddressDisplay({ 
	orderType, 
	userAddress, 
	userCity, 
	userDistrict, 
	userPostalCode, 
	storeName, 
	storeAddress, 
	storeCity, 
	storeDistrict, 
	storePostalCode
}) {


	var form;

	if(orderType === "Livraison") {

		form = (

			<>
			<List sx={{ mt: '2px', mb: '24px' }}>
				<ListItem disablePadding>
					<ListItemText primary={<Typography variant="h5">{userAddress}</Typography>} style={{ margin: 0, display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem disablePadding>
					<ListItemText primary={<Typography variant="h5">{userCity}, {userDistrict} {userPostalCode}</Typography>} style={{ margin: 0, display:'flex', justifyContent:'center'}} />
				</ListItem>
			</List>
			</>

		)

	} else {

		form = (
			<>
			<List sx={{ mt: '2px', mb: '24px' }}>
				<ListItem disablePadding sx={{ pb: '8px' }}>
					<ListItemText primary={<Typography variant="h5" style={{ fontWeight: '500' }}>{storeName}</Typography>} style={{ margin: 0, display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem disablePadding>
					<ListItemText primary={<Typography variant="h5" style={{ fontWeight: '400' }}>{storeAddress}</Typography>} style={{ margin: 0, display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem disablePadding>
					<ListItemText primary={<Typography variant="h5" style={{ fontWeight: '400' }}>{storeCity}, {storeDistrict} {storePostalCode}</Typography>} style={{ margin: 0, display:'flex', justifyContent:'center'}} />
				</ListItem>
			</List>
			</>
		)

	}
	

	return (
		<>
			{form}
		</>
	)
}

export default CheckoutAddressDisplay;