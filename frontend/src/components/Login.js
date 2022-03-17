import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as Yup from "yup";


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
	FormControl,
	InputLabel,
	Button,
	Input,
	TextField,
	Snackbar,
	Alert
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import LoginSubmitForm from './Forms/LoginSubmitForm';
import LoginVerifyForm from './Forms/LoginVerifyForm';

function Login({ 
	setStep, 
	userToken, 
	setUserToken,  
	userVerified, 
	setUserVerified, 
	setUserId,
	setUserFirstName, 
	setUserLastName, 
	setUserEmail, 
	setUserPhone, 
	setUserAddress, 
	setUserAddress2, 
	setUserCity, 
	setUserDistrict, 
	setUserPostalCode, 
	setUserLat, 
	setUserLng 
}) {

	//form email
	const [email, setEmail] = useState('');
  	//hash for verification
	const [hash, setHash] = useState(null);
	//registered user data aggregate from DB
	const [userData, setUserData] = useState(null);

	async function setUser() {
		try {
			setUserId(userData.user_id)
			setUserFirstName(userData.user_first_name)
			setUserLastName(userData.user_last_name)
			setUserEmail(userData.user_email)
			setUserPhone(userData.user_phone)
			setUserAddress(userData.user_address)
			setUserAddress2(userData.user_address2)
			setUserCity(userData.user_city)
			setUserDistrict(userData.user_district)
			setUserPostalCode(userData.user_postal_code)
			setUserLat(userData.user_lat)
			setUserLng(userData.user_lng)
		} finally {
			setStep(21)
		}
		
	}

	//check if verified
  	useEffect(() => {
		if(userVerified) {
			if(userData) {
			//verified and registered
				setUser();
				//setStep(21) // go to account page
			} else {
			//verified but not registered
				setStep(12) // go to address search
			}
		}
	}, [userVerified])
	


	//otp error
	const [error, setError] = useState(false);


	return (<>
			<Box sx={{ flexGrow: 1 }}>
		      <AppBar position="static">
		        <Toolbar variant="regular">
		          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(1)}>
		            <ArrowBackIcon />
		          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Accéder à mon compte
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<Snackbar open={error} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={1250} onClose={() => setError(false)}>
				<Alert
					sx={{ mt: '24px' }}
					variant="filled"
					severity="error"
			      >
			      	Le code de vérification est incorrect.
			      </Alert>
			</Snackbar>
			<List sx={{ mt: '24px' }}>
			{!hash && (
				<LoginSubmitForm 
					email={email} 
					setEmail={(email) => setEmail(email)} 
					setHash={(hash) => setHash(hash)} 
				/>
			)}
			{hash && (
				<LoginVerifyForm 
					email={email} 
					hash={hash} 
					setUserVerified={verify => setUserVerified(verify)}
					setUserData={(data) => setUserData(data)}  
					setError={error => setError(error)}
				 />
			)}
			</List>
		</Container>

		</>)


}

export default Login;