import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";
import InputMask from 'react-input-mask';


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
	Alert,
	SvgIcon,
	Stepper,
	Step,
	StepLabel
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ReactComponent as MainIcon } from './assets/noun-chef-3895898.svg';


function OrderStatus() {




	return (
	<>
		<Container maxWidth='sm'>
			<List sx={{ mt: '24px' }}>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<SvgIcon component={MainIcon} sx={{ width: '160px', height: '160px' }} inheritViewBox />
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography style={{ textAlign:'center'}} variant="h3">Vous êtes entre bonnes mains.</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<Stepper activeStep={0} orientation="vertical">
						<Step>
							<StepLabel>
								Commande placée
							</StepLabel>
						</Step>
						<Step>
							<StepLabel>
								En préparation
							</StepLabel>
						</Step>
						<Step>
							<StepLabel>
								En cours de livraison
							</StepLabel>
						</Step>
						<Step>
							<StepLabel>
								<Typography variant="subtitle2">1915 rue Poupart</Typography>
								<Typography variant="subtitle2">Montréal, QC H2K 3H1</Typography>
								<Typography variant="body2">Estimée pour 19:15</Typography>
							</StepLabel>
						</Step>
					</Stepper>
				</ListItem>
			</List>
		</Container>

	</>
	)

}

 export default OrderStatus;