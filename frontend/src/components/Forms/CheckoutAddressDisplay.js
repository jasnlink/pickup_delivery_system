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
	SvgIcon
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';


import { ReactComponent as RestaurantIcon } from './assets/noun-waiter-3895890.svg';
import { ReactComponent as DeliveryIcon } from './assets/noun-scooter-3895878.svg';

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
			<Grid container justifyContent="center" alignItems="center" sx={{ mt: '2px', mb: '24px' }}>
				<Grid item>
					<SvgIcon component={DeliveryIcon} sx={{ width: '96px', height: '96px', pr: '24px' }} inheritViewBox />
				</Grid>
				<Grid item>
					<List>
						<ListItem disablePadding>
							<ListItemText primary={<Typography variant="h5">{userAddress}</Typography>} style={{ margin: 0 }} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemText primary={<Typography variant="h5">{userCity}, {userDistrict}</Typography>} style={{ margin: 0 }} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemText primary={<Typography variant="h5">{userPostalCode}</Typography>} style={{ margin: 0 }} />
						</ListItem>
					</List>
				</Grid>
			</Grid>
			</>

		)

	} else {

		form = (
			<>
			<Grid container justifyContent="center" alignItems="center" sx={{ mt: '2px', mb: '24px' }}>
				<Grid item>
					<SvgIcon component={RestaurantIcon} sx={{ width: '100px', height: '100px', pr: '12px' }} inheritViewBox />
				</Grid>
				<Grid item>
					<List>
						<ListItem disablePadding sx={{ pb: '8px' }}>
							<ListItemText primary={<Typography variant="h5" style={{ fontWeight: '500' }}>{storeName}</Typography>} style={{ margin: 0, }} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemText primary={<Typography variant="h5" style={{ fontWeight: '400' }}>{storeAddress}</Typography>} style={{ margin: 0, }} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemText primary={<Typography variant="h5" style={{ fontWeight: '400' }}>{storeCity}, {storeDistrict} {storePostalCode}</Typography>} style={{ margin: 0, }} />
						</ListItem>
					</List>
				</Grid>
			</Grid>
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