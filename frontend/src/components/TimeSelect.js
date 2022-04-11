import React, { useState, useEffect } from 'react';
import Axios from 'axios';


import { 	
	Typography,
	Container,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	AppBar,
	Box,
	Toolbar,
	IconButton,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Link,
	Button
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import TimeSelectForm from './Forms/TimeSelectForm'

import './styles/Menu.css'

function TimeSelect({ orderType, setStep, storeTimeHours, setOrderDate, setOrderTime, userAuth, setUserVerified }) {

	//check if user is authenticated
	useEffect(() => {

		if(userAuth.accessType === 'jwt' || userAuth.accessType === 'otp') {
		//claims to be authenticated with jwt or otp accessToken
		//verify auth with server
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/login/"+userAuth.accessType+"/auth", {
				userAuth: userAuth,
			})
			.then((response) => {
				if(response.data.status === 1) {
				//user is authenticated, we may continue
					return;
				} else {
				//user is not authenticated, send to login
					setUserVerified(false)
					setStep(11)
				}
				
			})
			.catch((err) => {
		       	console.log("error ", err)});

		} else {
		//no valid auth type, not supposed to be here, unverify and send to login
			setUserVerified(false)
			setStep(11)
		}

	}, [])


	return (<>
		<Container maxWidth='sm'>
			<List sx={{ mt: '12px' }}>
				<ListItem sx={{ pb: '12px' }}>
					<Button 
						onClick={() => orderType==="Emporter" ? setStep(1) : setStep(12)} 
						size="small" 
						color="inherit" 
						startIcon={<ArrowBackIcon />}
						className="btn-std"
					>
						Retour
					</Button>
				</ListItem>
				<TimeSelectForm setStep={step => setStep(step)} storeTimeHours={storeTimeHours} setOrderDate={setOrderDate} setOrderTime={setOrderTime} />
			</List>
		</Container>

		</>)


}

export default TimeSelect;