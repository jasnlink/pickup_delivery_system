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



import AddressSearchInput from './Forms/AddressSearchInput';


function Delivery({ setStep, userToken }) {

	//do you have an account prompt
	const [prompt, setPrompt] = useState(1);

	//to contain google maps autocomplete suggestion
	const [suggestion, setSuggestion] = useState(1);

	function handleSuggestionSelected(res) {
		setSuggestion(res)
		console.log(suggestion)
	}

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
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Quel endroit?</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{marginTop: 24, display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard" fullWidth>
						<AddressSearchInput />
					</FormControl>
				</ListItem>
				<ListItem style={{marginTop: 48, display:'flex', justifyContent:'center'}}>
					<Button variant="contained" size="large" fullWidth>Continuer</Button>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default Delivery;