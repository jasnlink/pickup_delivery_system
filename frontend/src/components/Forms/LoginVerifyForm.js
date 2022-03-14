import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as Yup from "yup";

import { 	
	Typography,
	ListItem,
	ListItemText,
	FormControl,
	TextField
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';



function LoginVerifyForm({ email, hash, setUserData, setUserVerified, setError }) {


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
			Axios.post("http://localhost:3500/api/login/verify", formData, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
			.then((response) => {
				console.log(response.data)
				if(response.data.status === 0 && response.data.verify === 0) {
					//user could not verify otp
					setOtp('')
					setError(true);

				} else if(response.data.status === 0 && response.data.verify === 1) {
					//user verified otp but not registered
					setUserVerified(true);

				} else {
					//user verified and is registered
					setUserData(response.data);
					setUserVerified(true);
				}
				
	              setVerifyLoading(false);
	         
				
			})
			.catch((err) => {
		       	console.log("error ", err)});
		}, 1000)
	}



	return (
		<>
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
				loadingPosition="end"
				onClick={() => handleVerify()}
			>
				Confirmer
			</LoadingButton>
		</ListItem>
		</>
	)

}

export default LoginVerifyForm;