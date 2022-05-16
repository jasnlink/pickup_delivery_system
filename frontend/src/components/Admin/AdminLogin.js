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
	Alert,
	OutlinedInput,
	Paper
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AdminError from './Forms/AdminError'

function AdminLogin({ adminToken, setAdminToken, adminUsername, setAdminUsername }) {

	//login button loading
	const [loginLoading, setLoginLoading] = useState(false)
	
	//user and password inputs
	const [inputUser, setInputUser] = useState('')
	const [inputPass, setInputPass] = useState('')

	//login validation bool
	const [loginValid, setLoginValid] = useState(false)

	//login validation schema
	const loginSchema = Yup.object().shape({
		username: Yup.string().required(),
		password: Yup.string().required(),
	})

	//login authentication error bool
	const [loginError, setLoginError] = useState(false)
	//other login errors bool
	const [error, setError] = useState(false)

	useEffect(() => {

		loginSchema.validate({
			username: inputUser,
			password: inputPass,
		})
		.then((response) => {
			setLoginValid(true)
		})
		.catch((err) => {
			setLoginValid(false)
		})

	}, [inputUser, inputPass])



	function handleLoginSubmit() {

		setLoginLoading(true)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+'/api/admin/login', {
			username: inputUser,
			password: inputPass,
		})
		.then((response) => {

			if(response.data.status === 0 && response.data.reason === 'username') {
			//username not found
				setLoginError(true);

			}
			if(response.data.status === 0 && response.data.reason === 'password') {
			//password not found
				setLoginError(true);

			}
			if(response.data.status === 0 && response.data.reason === 'error') {
			//error
				setError(true);

			}
			if(response.data.status === 1) {
			//login successful

				//set token and username
				setAdminToken(response.data.token)
				setAdminUsername(inputUser)

				//save access token to localstorage, so we can reaccess it anytime
				localStorage.setItem('adminAccessUsername', inputUser)
				localStorage.setItem('adminAccessToken', response.data.token)

			}
			
			setLoginLoading(false)

		})
		.catch((err) => {
	       	console.log("error ", err)});

	}


	return (
	<>
		<AdminError
			error={loginError}
			setError={setLoginError}
			message="L'utilisateur ou le mot de passe ne correspond pas."

		 />
		 <AdminError
			error={error}
			setError={setError}
			message="Une erreur s'est produite, réessayez une autre fois."

		 />
		<Container maxWidth={false} style={{ backgroundColor: '#d9d9d994', minHeight: '100vh' }}>
			<Container maxWidth="sm" sx={{ pt: '14vh' }}>
					<Paper square>
						<List>
							<ListItem style={{display: 'flex', justifyContent: 'center'}}>
								<Typography variant="h4" style={{display:'flex', justifyContent:'center'}}>
									Authentification
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h6">
									Utilisateur
								</Typography>
							</ListItem>
							<ListItem sx={{ pt: 0 }}>
			            		<OutlinedInput
			            			sx={{ paddingRight: 0 }}
			            			size="medium"
			            			id="outlined-username"
			            			value={inputUser}
			            			sx={{ borderRadius: 0 }}
			            			onChange={(e) => setInputUser(e.target.value)}
			            			onKeyUp={(e) => {if(e.keyCode === 13 && loginValid) {handleLoginSubmit()}}}
			            			fullWidth
			            		/>
							</ListItem>
							<ListItem>
								<Typography variant="h6">
									Mot de passe
								</Typography>
							</ListItem>
							<ListItem sx={{ pt: 0 }}>
			            		<OutlinedInput
			            			sx={{ paddingRight: 0 }}
			            			inputProps={{ type: 'password' }}
			            			size="medium"
			            			id="outlined-password"
			            			value={inputPass}
			            			sx={{ borderRadius: 0 }}
			            			onChange={(e) => setInputPass(e.target.value)}
			            			onKeyUp={(e) => {if(e.keyCode === 13 && loginValid) {handleLoginSubmit()}}}
			            			fullWidth
			            		/>
							</ListItem>
							<ListItem sx={{ pt: '12px', pb: '18px' }}>
								<LoadingButton 
									variant="contained" 
									loading={loginLoading} 
									onClick={handleLoginSubmit}
									disabled={!loginValid}
									size="large" 
									fullWidth 
									className="btn"
								>
									{loginLoading ? '...' : 'Continuer'}
								</LoadingButton>
							</ListItem>
						</List>
					</Paper>
			</Container>
		</Container>				

	</>
	)


}
export default AdminLogin
