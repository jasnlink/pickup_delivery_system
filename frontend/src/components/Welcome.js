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


function Welcome({ setStep, setOrderType }) {

	return (<>
		
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
					<ListItemButton onClick={() => {setStep(11); setOrderType('Emporter')}}>
						<ListItemText primary={<Typography variant="h3">Emporter</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => {setStep(11); setOrderType('Livraison')}}>
						<ListItemText primary={<Typography variant="h3">Livraison</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default Welcome;