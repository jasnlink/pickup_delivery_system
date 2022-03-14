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
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import LoginSubmitForm from './Forms/LoginSubmitForm';
import LoginVerifyForm from './Forms/LoginVerifyForm';

function Login({ setStep, userToken, setUserToken, setUserEmail }) {

	//form email
	let [email, setEmail] = useState('');
  	//hash for verification
	let [hash, setHash] = useState(null);
	//is verified
	let [verified, setVerified] = useState(false);
	

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
			<List sx={{ mt: '24px' }}>
			{!hash && (
				<LoginSubmitForm email={email} setEmail={(email) => setEmail(email)} setHash={(hash) => setHash(hash)} />
			)}
			{hash && (
				<LoginVerifyForm email={email} hash={hash} setVerified={(verify) => setVerified(verify)} />
			)}
			</List>
		</Container>

		</>)


}

export default Login;