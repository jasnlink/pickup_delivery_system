import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";
import InputMask from 'react-input-mask';


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
	SvgIcon,
	Stepper,
	Step,
	StepLabel
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ReactComponent as MainIcon } from './assets/noun-chef-3895898.svg';


function OrderStatus({ 
	orderType, 
	orderDate, 
	orderTime, 
	userFirstName, 
	userLastName, 
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

	//page loading
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		//data coming back too fast, wait
  		setTimeout(() => {
			setLoading(false)
		}, 500)

	}, [])	



	return (
	<>
		{loading && (
			<Fade in={loading} sx={{ color: '#000' }} unmountOnExit>
				<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!loading && (
			<Container maxWidth='sm'>
				<List sx={{ mt: '24px' }}>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<SvgIcon component={MainIcon} sx={{ width: '160px', height: '160px' }} inheritViewBox />
					</ListItem>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<ListItemText primary={<Typography style={{ textAlign:'center'}} variant="h3">Vous êtes entre bonnes mains.</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItem>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<Stepper activeStep={0} orientation="vertical">
							<Step>
								<StepLabel>
									Commande placée
									<Typography variant="body2">Estimée pour {orderTime}</Typography>
									{DateTime.now().setZone('America/Toronto').toFormat('yyyy-MM-dd') === orderDate ? "" :<Typography variant="body2">{orderDate}</Typography>}
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
									En préparation
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
									{orderType === "Livraison" ? "En cours de livraison" : "Prêt pour emporter"}
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
								{orderType === "Livraison" && (
								<>
									<Typography variant="subtitle2">{userAddress}</Typography>
									<Typography variant="subtitle2">{userCity}, {userDistrict} {userPostalCode}</Typography>
								</>
								)}
								{orderType === "Emporter" && (
								<>
									<Typography variant="subtitle2">{storeName}</Typography>
									<Typography variant="body2">{storeAddress}</Typography>
									<Typography variant="body2">{storeCity}, {storeDistrict} {storePostalCode}</Typography>
								</>
								)}
									
								</StepLabel>
							</Step>
						</Stepper>
					</ListItem>
				</List>
			</Container>
		)}

	</>
	)

}

 export default OrderStatus;