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


	function handleLoginSubmit() {

		Axios.post(process.env.REACT_APP_PUBLIC_URL+'/api/admin/login')

	}


	return (
	<>

		<Container style={{ backgroundColor: '#d9d9d994', minHeight: '100vh' }}>
			<Container maxWidth="sm" sx={{ pt: '14vh' }}>
					<Paper square>
						<List>
							<ListItem style={{display:'flex', justifyContent:'center'}}>
								<Typography variant="h4" style={{display:'flex', justifyContent:'center'}}>
									Authentification
								</Typography>
							</ListItem>
							<ListItem>
								<FormControl variant="outlined" fullWidth>
				            		<InputLabel htmlFor="outlined-username">Utilisateur</InputLabel>
				            		<OutlinedInput
				            			sx={{ paddingRight: 0 }}
				            			size="medium"
				            			id="outlined-username"
				            			label="Utilisateur"
				            			value={inputUser}
				            			sx={{ borderRadius: 0 }}
				            			onChange={(e) => setInputUser(e.target.value)}
				            			fullWidth />
				            			
				            	</FormControl>
							</ListItem>
							<ListItem>
								<FormControl variant="outlined" fullWidth>
				            		<InputLabel htmlFor="outlined-password">Mot de passe</InputLabel>
				            		<OutlinedInput
				            			sx={{ paddingRight: 0 }}
				            			inputProps={{ type: 'password' }}
				            			size="medium"
				            			id="outlined-password"
				            			label="Mot de passe"
				            			value={inputPass}
				            			sx={{ borderRadius: 0 }}
				            			onChange={(e) => setInputPass(e.target.value)}
				            			fullWidth />
				            			
				            	</FormControl>
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
