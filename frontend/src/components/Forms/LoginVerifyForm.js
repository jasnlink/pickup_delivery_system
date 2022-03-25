import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as Yup from "yup";

import { 	
	Typography,
	ListItem,
	ListItemText,
	FormControl,
	TextField,
	SvgIcon
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { ReactComponent as MainIcon } from './assets/noun-radar-4583961.svg';


function LoginVerifyForm({ 
	email, 
	hash,  
	setUserVerified, 
	setError, 
	setUserAuth,
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


	//form OTP
	let [otp, setOtp] = useState('');
	//otp validation
	let [isOtp, setIsOtp] = useState(false);
	//verify button
	let [verifyLoading, setVerifyLoading] = useState(false)



	//otp validation schema
	const verifySchema = Yup.object().shape({
  		otp: Yup.string().matches(/^[0-9]+$/).min(6).max(6).required("Entrez le code de vérification."),
  	});
	//real time otp validation
  	useEffect(() => {
		verifySchema.validate({ otp: otp })
		.then((response) => {
			setIsOtp(true);
		})
		.catch((err) => {
	       	setIsOtp(false);
	    })
	}, [otp])



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
			setUserVerified(true);
		}
		
	}



	function handleVerify() {

		//set to loading
		setVerifyLoading(true);

		//use new FormData() method to create a submitted form
		const formData = new FormData();
		
		formData.append('email', email);
		formData.append('hash', hash);
		formData.append('otp', otp);

		//data coming back too fast, wait 1 second
		setTimeout(() => {
			//send otp verify to backend
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/login/verify", formData, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
			.then((response) => {


				if(response.data.status === 0 && response.data.verify === 0) {
				//user could not verify otp, issue error message
					setOtp('')
					setError(true);

				}
				if(response.data.status === 0 && response.data.verify === 1) {
				//user verified otp but not registered, use otp hash that only lasts 30 mins
					setUserAuth({ 
									accessType: 'otp', 
									accessEmail: email, 
									accessToken: hash, 
									accessOtp: otp 
								})
					setUserEmail(email);
					setUserVerified(true);

				}
				if(response.data.status === 1 && response.data.verify === 1) {
				//user verified otp and is registered, use issued jwt token, which lasts 30 days
					setUserAuth({ 
									accessType: 'jwt', 
									accessEmail: email, 
									accessToken: response.data.accessToken 
								})

					//save access token to localstorage, so we can reaccess it anytime
					localStorage.setItem('accessType', 'jwt')
					localStorage.setItem('accessEmail', email)
					localStorage.setItem('accessToken', response.data.accessToken)

					setUser(response.data.userInfo);
				}
				
	            setVerifyLoading(false);
	         
				
			})
			.catch((err) => {
		       	console.log("error ", err)});
		}, 1000)
	}



	return (
		<>
		<ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '24px'}}>
			<SvgIcon component={MainIcon} sx={{ width: '128px', height: '128px' }} inheritViewBox />
		</ListItem>
		<ListItem style={{display:'flex', justifyContent:'center'}}>
			<ListItemText primary={<Typography variant="h4" align="center">Un code de vérification à été envoyé à votre courriel, entrez le ici.</Typography>} style={{display:'flex', justifyContent:'center'}} />
		</ListItem>
		<ListItem style={{display:'flex', justifyContent:'center'}}>
			<FormControl variant="standard" fullWidth>
				<TextField
					inputProps={{ style: { textAlign:'center' }, maxLength: 6 }}
					placeholder=""							
					autoFocus
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					onKeyUp={(e) => {if(e.keyCode === 13 && isOtp) {handleVerify()}}}
					required
					disabled={verifyLoading}
				 />
			</FormControl>
		</ListItem>
		<ListItem style={{marginTop: 24, display:'flex', justifyContent:'center'}}>
			<LoadingButton 
				variant="contained" 
				size="large" 
				fullWidth 
				disabled={!isOtp} 
				loading={verifyLoading} 
				onClick={() => handleVerify()}
			>
				Confirmer
			</LoadingButton>
		</ListItem>
		</>
	)

}

export default LoginVerifyForm;