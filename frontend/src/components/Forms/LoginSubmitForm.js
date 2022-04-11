import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as Yup from "yup";

import { 	
	Typography,
	ListItem,
	ListItemText,
	FormControl,
	Input,
	SvgIcon
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { ReactComponent as MainIcon } from './assets/noun-online-shopping-3895961.svg';

import '../styles/Menu.css'

function LoginSubmitForm({ email, setEmail, setHash }) {

	
	//email validation
	let [isEmail, setIsEmail] = useState(false);
	//loading button
	let [submitLoading, setSubmitLoading] = useState(false)

	//email validation schema
	const loginSchema = Yup.object().shape({
  		email: Yup.string().email().required("Entrez votre courriel."),
  	});

	//real time email validation
  	useEffect(() => {
		loginSchema.validate({ email: email })
		.then((response) => {
			setIsEmail(true);
		})
		.catch((err) => {
	       	setIsEmail(false);
	    })
	}, [email])

  	//handle in order to log in
	function handleSubmit() {
		
		//set to loading
		setSubmitLoading(true);
		//use new FormData() method to create a submitted form
		const formData = new FormData();
		formData.append('email', email);
		//send otp request to backend
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/login/submit", formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
		.then((response) => {
			setHash(response.data.hash);
		})
		.catch((err) => {
	       	console.log("error ", err)});
	}


	return (
		<>
		<ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '24px'}}>
			<SvgIcon component={MainIcon} sx={{ width: '128px', height: '128px' }} inheritViewBox />
		</ListItem>
		<ListItem style={{display:'flex', justifyContent:'center'}}>
			<ListItemText primary={<Typography variant="h3" align="center">Entrez votre <span style={{fontWeight: '600'}}>courriel</span></Typography>} style={{display:'flex', justifyContent:'center'}} />
		</ListItem>
		<ListItem style={{display:'flex', justifyContent:'center'}}>
			<FormControl variant="standard" sx={{ borderRadius: 0 }} fullWidth>
				<Input
					inputProps={{ 
						style: { textAlign:'center', borderRadius: 0 },
						type: 'email',
					}}
					placeholder="courriel@exemple.ca"							
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					onKeyUp={(e) => {if(e.keyCode === 13 && isEmail) {handleSubmit()}}}
				 />
			</FormControl>
		</ListItem>
		<ListItem style={{marginTop: 24, display:'flex', justifyContent:'center'}}>
			<LoadingButton 
				variant="contained" 
				size="large" 
				fullWidth 
				className="btn"
				disabled={!isEmail} 
				loading={submitLoading} 
				onClick={() => handleSubmit()}
			>
				{submitLoading ? '...' : 'Continuer'}
			</LoadingButton>
		</ListItem>
		</>
	)

}

export default LoginSubmitForm;