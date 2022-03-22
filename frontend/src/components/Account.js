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
	Input,
	SvgIcon
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ReactComponent as MainIcon } from './assets/noun-search-3895584.svg';

function Account({ setStep, userFirstName, userLastName, userEmail, userPhone, userAddress, userAddress2, userCity, userDistrict, userPostalCode }) {

	return (<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(1)}>
	            <ArrowBackIcon />
	          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Votre adresse
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<List sx={{ mt: '24px' }}>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<SvgIcon component={MainIcon} sx={{ width: '108px', height: '108px' }} inheritViewBox />
				</ListItem>
				<ListItem>
					<ListItemText primary={<Typography variant="h3">{userFirstName} {userLastName}</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<Divider />
			</List>
			<List sx={{ mt: '8px' }}>
				<ListItem disablePadding>
					<ListItemText primary={<Typography variant="h5">{userAddress}</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem disablePadding>
					<ListItemText primary={<Typography variant="h5">{userCity}, {userDistrict} {userPostalCode}</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
			</List>
			<List sx={{ mt: '8px' }}>
				<Divider />
				<ListItem disablePadding>
					<ListItemButton onClick={() => setStep(13)}>
						<ListItemText primary={<Typography variant="h4">Utiliser cette adresse</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => setStep(12)}>
						<ListItemText primary={<Typography variant="h4">Livrer ailleurs</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default Account;