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

function AdminLogin() {


	const [loginLoading, setLoginLoading] = useState(false)
	
	const [inputUser, setInputUser] = useState('')
	const [inputPass, setInputPass] = useState('')

	const [loginValid, setLoginValid] = useState(false)

	const loginSchema = Yup.object().shape({
		username: Yup.string().required(),
		password: Yup.string().required(),
	})


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


	const [loginError, setLoginError] = useState(false)
	const [error, setError] = useState(false)


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
				setLoginLoading(false)

			}
			if(response.data.status === 0 && response.data.reason === 'password') {
			//password not found
				setLoginError(true);
				setLoginLoading(false)

			}
			if(response.data.status === 0 && response.data.reason === 'error') {
			//error
				setError(true);
				setLoginLoading(false)

			}
			if(response.data.status === 1) {
			//login successful
				console.log('success')
				setLoginLoading(false)

			}

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
		<Container style={{ backgroundColor: '#d9d9d994', minHeight: '100vh' }}>
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
