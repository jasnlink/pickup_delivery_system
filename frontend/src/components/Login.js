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

function Login({ setStep, userToken, setUserToken, setUserEmail, userVerified, setUserVerified, userData, setUserData }) {

	//form email
	let [email, setEmail] = useState('');
  	//hash for verification
	let [hash, setHash] = useState(null);

	//check if verified
  	useEffect(() => {
		if(userVerified) {
			if(userData) {
			//verified and registered
				setStep(12) // go to account page
			} else {
			//verified but not registered
				setStep(13) // go to address search
			}
		}
	}, [userVerified])
	


	//otp error
	let [error, setError] = useState(false);
	//otp error notification close
  	function closeError(event, reason) {

	    setError(false)
  	}


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
			<Snackbar open={error} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={1000} onClose={closeError}>
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