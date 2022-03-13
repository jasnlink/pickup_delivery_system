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

import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";

function Delivery({ setStep, userToken }) {

	//do you have an account prompt
	const [prompt, setPrompt] = useState(1);



	const { ref: autoCompleteRef } = usePlacesWidget({
	    apiKey: "AIzaSyA4I5APOf8GJC9hSLyx270OL5hOwj2iajU",
	    onPlaceSelected: (place) => console.log(place),
	    inputAutocompleteValue: "country",
	    options: {
	      componentRestrictions: "ca",
	    },
	  });
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
						<Input
							inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
								              <Autocomplete
								                apiKey="AIzaSyA4I5APOf8GJC9hSLyx270OL5hOwj2iajU"
								                {...props}
								                onPlaceSelected={(selected) => console.log(selected)}
								                options={{
											      componentRestrictions: { country: ["ca"] },
											      fields: ["address_components", "geometry"],
											      types: ["address"],
								                }}
								              />
								            )}
						/>
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