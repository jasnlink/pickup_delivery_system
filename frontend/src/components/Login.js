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
	Input
 } from '@mui/material';


import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Login({ setStep, userToken, setUserToken }) {


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
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h4" align="center">Entrez votre <span style={{fontWeight: '600'}}>téléphone</span> ou votre <span style={{fontWeight: '600'}}>courriel</span></Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard" fullWidth>
						<Input />
					</FormControl>
				</ListItem>
				<ListItem style={{marginTop: 36, display:'flex', justifyContent:'center'}}>
					<Button variant="contained" size="large" fullWidth>Continuer</Button>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default Login;