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
	FormControl,
	InputLabel,
	Button,
	TextField,
	Input,
	SvgIcon,
	Fade,
	CircularProgress
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ReactComponent as MainIcon } from './assets/noun-search-3895584.svg';

function Account({ 
	setStep, 
	userFirstName, 
	userLastName, 
	userEmail, 
	userPhone, 
	userAddress, 
	userAddress2, 
	userCity, 
	userDistrict, 
	userPostalCode, 
	userAuth, 
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


	//page loading
	let [loading, setLoading] = useState(true);


	async function setUser(userData) {
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
			setLoading(false);
		}
		
	}


	//check if user is authenticated
	useEffect(() => {

		if(userAuth.accessType === 'jwt') {
		//claims to be authenticated with jwt accessToken of 30 days
		//verify auth with server
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/login/jwt/auth", {
				userAuth: userAuth,
			})
			.then((response) => {
				if(response.data.status === 1) {
				//user is authenticated, we may continue
					setUser(response.data.userInfo);
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
		{loading && (
			<Fade in={loading} sx={{ color: '#000' }} unmountOnExit>
				<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!loading && (
			<Container maxWidth='sm'>
				<List sx={{ mt: '24px' }}>
					<ListItem style={{display:'flex', justifyContent:'center'}}>
						<SvgIcon component={MainIcon} sx={{ width: '108px', height: '108px' }} inheritViewBox />
					</ListItem>
					<ListItem>
						<ListItemText primary={<Typography variant="h3">{userFirstName} {userLastName}</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItem>
					<Divider />
				</List>
				<List sx={{ mt: '8px' }}>
					<ListItem disablePadding>
						<ListItemText primary={<Typography variant="h5">{userAddress}</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemText primary={<Typography variant="h5">{userCity}, {userDistrict} {userPostalCode}</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItem>
				</List>
				<List sx={{ mt: '8px' }}>
					<Divider />
					<ListItem disablePadding>
						<ListItemButton onClick={() => setStep(13)}>
							<ListItemText primary={<Typography variant="h4">Utiliser cette adresse</Typography>} style={{display:'flex', justifyContent:'center'}} />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => setStep(12)}>
							<ListItemText primary={<Typography variant="h4">Livrer ailleurs</Typography>} style={{display:'flex', justifyContent:'center'}} />
						</ListItemButton>
					</ListItem>
				</List>
			</Container>
		)}

		</>)


}

export default Account;