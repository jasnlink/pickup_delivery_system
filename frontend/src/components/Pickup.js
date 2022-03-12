import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import './styles/Pickup.css';

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
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Link,
	Button 
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Pickup({ setStep }) {


	return (<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(1)}>
	            <ArrowBackIcon />
	          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Emporter
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<List sx={{ mt: '24px' }}>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Pour quand?</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard">
						<InputLabel />
						<Select value="10"
							sx={{ 
								fontSize: '32px',
							    height: 64,
							    width: '100%',
							    padding: '0 12px', 
							}}>
							<MenuItem value={10}>Aujourd'hui</MenuItem>
							<MenuItem value={20}>Demain</MenuItem>
							<MenuItem value={30}>Mer 16</MenuItem>
							<MenuItem value={30}>Jeu 17</MenuItem>
						</Select>
					</FormControl>
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard">
						<InputLabel />
						<Select value="10"
							sx={{ 
								fontSize: '32px',
							    height: 64,
							    width: '100%',
							    padding: '0 12px', 
							}}>
							<MenuItem value={10}>11:00</MenuItem>
							<MenuItem value={20}>11:30</MenuItem>
							<MenuItem value={30}>12:00</MenuItem>
						</Select>
					</FormControl>
				</ListItem>
				<ListItem style={{marginTop: 48, display:'flex', justifyContent:'center'}}>
					<Button variant="contained" size="large" fullWidth>Continuer</Button>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default Pickup;