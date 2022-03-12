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
	Input
 } from '@mui/material';


import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Delivery({ setStep, userToken }) {

	//Application step var
	const [prompt, setPrompt] = useState(1);

	return (<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(1)}>
	            <ArrowBackIcon />
	          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Livraison
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<List sx={{ mt: '24px' }}>
			{prompt && (<> 
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h4">Avez-vous un compte?</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<Divider />
				<ListItem disablePadding>
					<ListItemButton onClick={() => setStep(100)}>
						<ListItemText primary={<Typography variant="h4">Oui</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => setPrompt(null)}>
						<ListItemText primary={<Typography variant="h4">Non</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
			</>)}
			{!prompt && (<>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Quel endroit?</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{marginTop: 36, display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard" fullWidth>
						<Input />
					</FormControl>
				</ListItem>
				<ListItem style={{marginTop: 48, display:'flex', justifyContent:'center'}}>
					<Button variant="contained" size="large" fullWidth>Continuer</Button>
				</ListItem>
			</>)}
			</List>
		</Container>

		</>)


}

export default Delivery;