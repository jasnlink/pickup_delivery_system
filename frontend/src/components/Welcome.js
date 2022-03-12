import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import './styles/Welcome.css';

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
	IconButton 
 } from '@mui/material';


import MenuIcon from '@mui/icons-material/Menu';


function Welcome({ setStep }) {


	return (<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
	            <MenuIcon />
	          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Commande en ligne
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<List sx={{ mt: '24px' }}>
				<ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
					<img src="./logo-black-transparent.png" className="welcome-logo" />
				</ListItem>
				<ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Bienvenue</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<Divider />
				<ListItem disablePadding>
					<ListItemButton onClick={() => setStep(11)}>
						<ListItemText primary={<Typography variant="h3">Emporter</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => setStep(21)}>
						<ListItemText primary={<Typography variant="h3">Livraison</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default Welcome;