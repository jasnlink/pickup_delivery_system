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
	SvgIcon
 } from '@mui/material';


import MenuIcon from '@mui/icons-material/Menu';

import { ReactComponent as FooterIcon } from './assets/logo-top-brand-black.svg';

import './styles/Menu.css'

function Welcome({ setStep, setOrderType }) {

	return (<>
		
		<Container maxWidth='sm' className="container">
			<List sx={{ mt: '24px' }}>
				<ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
					<img src={process.env.REACT_APP_PUBLIC_URL+"/app/logo-black-transparent.png"} className="welcome-logo" />
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
				<ListItem sx={{mt:'20vh', display: 'flex', justifyContent: 'center'}}>
					<Typography style={{display:'flex', justifyContent:'center'}} variant="subtitle1">
						Solution par <a style={{color:'#000000'}} href="https://msmtech.ca"><SvgIcon component={FooterIcon} sx={{ ml: '6px', width: 'auto', height: '28px' }} inheritViewBox /></a>
					</Typography>
				</ListItem>
			</List>
		</Container>
		</>)


}

export default Welcome;