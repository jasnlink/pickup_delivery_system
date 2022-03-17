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


function Menu({ setStep, orderType, orderTime }) {
	
	


	return (<>

		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <Typography variant="h6" color="inherit" component="div">
	            Menu
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>


		</>)
}

export default Menu;