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
	orderType, 
	userAuth, 
	setUserAuth,  
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
	

	//check if verified
  	useEffect(() => {
		if(userVerified) {
			if(userAuth.accessType === 'jwt') {
			//auth with jwt
				if(orderType === "Livraison") {
					setStep(21) // go to account page
				} else if(orderType === "Emporter") {
					setStep(13) // go to time select
				} else {
					//no order type set
					setStep(1)
				}
				
			}
			else if(userAuth.accessType === 'otp') {
			//verified via otp but not registered
				if(orderType === "Livraison") {
					setStep(12) // go to address search
				} else if(orderType === "Emporter") {
					setStep(13) // go to time select
				} else {
					//no order type set
					setStep(1)
				}
			} else {
			//catchall, verified but no valid auth
				setUserVerified(false)
				return;
			}
		}
	}, [userVerified])
	


	//otp error
	const [error, setError] = useState(false);


	return (<>
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
			<List sx={{ mt: '12px' }}>
				<ListItem sx={{ pb: '12px' }}>
					<Button onClick={() => setStep(1)} size="small" color="inherit" startIcon={<ArrowBackIcon />}>
						Retour
					</Button>
				</ListItem>
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
					setError={error => setError(error)}
					setUserAuth={auth => setUserAuth(auth)}

					setUserId={id => setUserId(id)}
					setUserFirstName={first => setUserFirstName(first)}
					setUserLastName={last => setUserLastName(last)}
					setUserEmail={email => setUserEmail(email)}
					setUserPhone={phone => setUserPhone(phone)}
					setUserAddress={address => setUserAddress(address)}
					setUserAddress2={address2 => setUserAddress2(address2)}
					setUserCity={city => setUserCity(city)}
					setUserDistrict={district => setUserDistrict(district)}
					setUserPostalCode={postalcode => setUserPostalCode(postalcode)}
					setUserLat={lat => setUserLat(lat)}
					setUserLng={lng => setUserLng(lng)}
				 />
			)}
			</List>
		</Container>

		</>)


}

export default Login;