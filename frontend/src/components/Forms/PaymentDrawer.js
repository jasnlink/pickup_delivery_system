import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";

import { 	
	Typography,
	Container,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	Divider,
	AppBar,
	Box,
	Toolbar,
	IconButton,
	FormControl,
	FilledInput,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	FormHelperText,
	Button,
	TextField,
	Input,
	Grid,
	Fade,
	CircularProgress,
	Drawer,
	Paper,
	Chip,
	ToggleButton,
	ToggleButtonGroup,
	ButtonBase,
	Alert
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import '../styles/Menu.css';


function PaymentDrawer({ paymentDrawer, setPaymentDrawer }) {



	return (
		<>
		<Drawer classes={{ paper: "payment-drawer", }} anchor="bottom" open={paymentDrawer} onClose={() => setPaymentDrawer(false)}>
			<List>
                <ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Bienvenue</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<Divider />
                <ListItem disablePadding>
					<ListItemButton>
						<ListItemText primary={<Typography variant="h3">Payer avec une carte</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemText primary={<Typography variant="h3">Payer avec Paypal</Typography>} style={{display:'flex', justifyContent:'center'}} />
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
		</>
	)

}

export default PaymentDrawer;