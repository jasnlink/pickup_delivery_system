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
	Alert,
	SvgIcon
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ShieldIcon from '@mui/icons-material/Shield';
import HttpsIcon from '@mui/icons-material/Https';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import { ReactComponent as VisaIcon } from './assets/visa.svg';
import { ReactComponent as MasterCardIcon } from './assets/mastercard.svg';
import { ReactComponent as AmexIcon } from './assets/amex.svg';
import { ReactComponent as SecureIcon } from './assets/noun-secure-3711283.svg';

import '../styles/Menu.css';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PaymentDrawer({ paymentDrawer, setPaymentDrawer }) {

	const [creditForm, setCreditForm] = useState(false);


	return (
		<>
		
		<Drawer classes={{ paper: "payment-drawer", }} anchor="bottom" open={paymentDrawer} onClose={() => setPaymentDrawer(false)}>
			<List>
				<ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h4">Votre paiement</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<Divider />
				{!creditForm && (
				<>
					<ListItem disablePadding style={{ display:'flex', justifyContent:'center', paddingTop: '8px' }}>
						<Grid container alignItems="center" justifyContent="center">
							<Grid item>
								<SvgIcon component={SecureIcon} sx={{ width: '32px', height: '32px' }} inheritViewBox />
							</Grid>
							<Grid item sx={{ pr: '8px' }}>
								<ListItemText primary={<Typography variant="h6">Paiements sécurisés</Typography>} style={{display:'flex', justifyContent:'center'}} />
							</Grid>
							<Grid item>
								<SvgIcon component={VisaIcon} sx={{ width: '36px', height: '36px' }} inheritViewBox />
							</Grid>
							<Grid item>
								<SvgIcon component={MasterCardIcon} sx={{ width: '36px', height: '36px' }} inheritViewBox />
							</Grid>
							<Grid item>
								<SvgIcon component={AmexIcon} sx={{ width: '36px', height: '36px' }} inheritViewBox />
							</Grid>
						</Grid>
					</ListItem>
	                <ListItem style={{ display:'flex', justifyContent:'center' }}>
						<Button 
							variant="contained" 
							size="large" 
							className="credit-btn" 
							startIcon={<CreditCardIcon />} 
							fullWidth 
							onClick={() => setCreditForm(true)}
							disableElevation>
								Carte de crédit
						</Button>
					</ListItem>
					<ListItem style={{ display:'flex', justifyContent:'center' }}>
						<PayPalScriptProvider>
							<PayPalButtons
					              style={{ layout: "horizontal", label: "pay" }} 
					              fundingSource="paypal"
					              className="paypal-btn"
					            />
						</PayPalScriptProvider>
					</ListItem>
				</>
				)}
				{!!creditForm && (
				<>
					<ListItem sx={{ pb: '4px' }}>
						<Grid container alignItems="center" justifyContent="center">
							<Grid item>
								<IconButton edge="start" color="inherit" onClick={() => setCreditForm(false)}>
					            	<ArrowBackIcon />
					         	 </IconButton>
							</Grid>
							<Grid item>
								<ListItemText primary={<Typography variant="h6">Payer</Typography>} style={{display:'flex', justifyContent:'center'}} />
							</Grid>
						</Grid>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-firstname">Nom sur la carte</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-card-name"
		            			label="Nom sur la carte"
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-firstname">Numéro de carte</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-card-number"
		            			label="Numéro de carte"
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-lastname">Expiration</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-expiration"
		            			label="Expiration"
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-cvv-code">CVV</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-cvv-code"
		            			label="CVV"
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem disablePadding style={{ display:'flex', justifyContent:'center', paddingTop: '8px' }}>
						<Grid container alignItems="center" justifyContent="center">
							<Grid item>
								<SvgIcon component={SecureIcon} sx={{ width: '32px', height: '32px' }} inheritViewBox />
							</Grid>
							<Grid item sx={{ pr: '8px' }}>
								<ListItemText primary={<Typography variant="h6">Paiements sécurisés</Typography>} style={{display:'flex', justifyContent:'center'}} />
							</Grid>
							<Grid item>
								<SvgIcon component={VisaIcon} sx={{ width: '36px', height: '36px' }} inheritViewBox />
							</Grid>
							<Grid item>
								<SvgIcon component={MasterCardIcon} sx={{ width: '36px', height: '36px' }} inheritViewBox />
							</Grid>
							<Grid item>
								<SvgIcon component={AmexIcon} sx={{ width: '36px', height: '36px' }} inheritViewBox />
							</Grid>
						</Grid>
					</ListItem>
					<ListItem sx={{ pt: '12px', pb: '12px' }}>
						<Button variant="contained" size="large" fullWidth>
							Placer la commande
						</Button>
					</ListItem>
				</>
				)}
			</List>
		</Drawer>
		</>
	)

}

export default PaymentDrawer;