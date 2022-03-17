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
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Link,
	Button 
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import TimeSelectForm from './Forms/TimeSelectForm'

function TimeSelect({ orderType, setStep, storeTimeHours, setOrderDate, setOrderTime }) {




	return (<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(1)}>
	            <ArrowBackIcon />
	          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            {orderType}
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<List sx={{ mt: '24px' }}>
				<TimeSelectForm setStep={step => setStep(step)} storeTimeHours={storeTimeHours} setOrderDate={setOrderDate} setOrderTime={setOrderTime} />
			</List>
		</Container>

		</>)


}

export default TimeSelect;