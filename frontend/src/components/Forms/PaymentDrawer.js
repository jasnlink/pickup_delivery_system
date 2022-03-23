import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";
import InputMask from 'react-input-mask';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


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


function PaymentDrawer({ 
			paymentDrawer, 
			setPaymentDrawer, 
			inputNote,
			orderType,
			orderDate,
			orderTime,
			cartSubtotal,
			cartDelivery,
			cartTip,
			cartQst,
			cartGst,
			cartTotal,
			cart,
			userId,
			userFirstName,
			userLastName,
			userEmail,
			userPhone,
			userAddress,
			userCity,
			userDistrict,
			userPostalCode,
			userLat,
			userLng }) {



	//payment drawer loading
	let [paymentDrawerLoading, setPaymentDrawerLoading] = useState(true);


  	useEffect(() => {

  		setPaymentDrawerLoading(false);

	}, [])	



	const [creditForm, setCreditForm] = useState(false);
	const [isAmex, setIsAmex] = useState(false)

	//input value state
	const [inputCardName, setInputCardName] = useState('')
	const [inputCardNumber, setInputCardNumber] = useState('')
	const [inputCardExpiration, setInputCardExpiration] = useState('')
	const [inputCardCvv, setInputCardCvv] = useState('')

	//input validated state
	const [cardValidated, setCardValidated] = useState(false)

	//payment auth id 
	const [paymentAuthId, setPaymentAuthId] = useState(null);
	//payment date
	const [paymentDate, setPaymentDate] = useState(null);
	//payment source
	const [paymentSource, setPaymentSource] = useState(null);


	const nameSchema = Yup.object().shape({
  		cardName: Yup.string().matches(/^[aA-zZ\s]+$/).required("Entrez le nom sur la carte."),
  	});


	//card number validation schema
	//need to validate if its an amex card, if it is change CVV mask to 4 digits instead of 3
	const amexSchema = Yup.object().shape({
  		cardNumber: Yup.string().matches(/^3[47]/),
  	});
	//if normal visa or mastercard then validate 16 digits length
	//if amex then validate 15 digits length
	var cardSchema;
	var cvvSchema;
	if(isAmex) {
		cardSchema = Yup.object().shape({
			cardName: Yup.string().matches(/^[aA-zZ\s]+$/).required("Entrez le nom sur la carte."),
	  		cardNumber: Yup.string().matches(/^[0-9]+$/).min(15).max(15).required("Entrez le numéro de carte."),
  			cardExpiration: Yup.string().matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/).required("Entrez la date d'expiration de la carte."),
	  		cardCvv: Yup.string().matches(/^[0-9]+$/).min(4).max(4).required("Entrez le code CVV."),
	  	});
	} else {
		cardSchema = Yup.object().shape({
			cardName: Yup.string().matches(/^[aA-zZ\s]+$/).required("Entrez le nom sur la carte."),
	  		cardNumber: Yup.string().matches(/^[0-9]+$/).min(16).max(16).required("Entrez le numéro de carte."),
  			cardExpiration: Yup.string().matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/).required("Entrez la date d'expiration de la carte."),
	  		cardCvv: Yup.string().matches(/^[0-9]+$/).min(3).max(3).required("Entrez le code CVV."),
	  	});
	}

  	//real time card number validation
  	useEffect(() => {

		amexSchema.validate({ cardNumber: (inputCardNumber.replace(/\s/g, '')) })
		.then((response) => {
			setIsAmex(true)
		})
		.catch((err) => {
	       	setIsAmex(false)
	    })


	    cardSchema.validate({ 
	    						cardName: inputCardName,
	    						cardNumber: (inputCardNumber.replace(/\s/g, '')),
	    						cardExpiration: inputCardExpiration,
	    						cardCvv: inputCardCvv,

	    					})
		.then((response) => {
			setCardValidated(true)
		})
		.catch((err) => {
	        setCardValidated(false)
	    })


	}, [inputCardName, inputCardNumber, inputCardExpiration, inputCardCvv])


  	//handle closing payment drawer, reset all to initial values
	function handleClosePaymentDrawer() {

		setPaymentDrawer(false)
		setCreditForm(false)
		setInputCardName('')
		setInputCardNumber('')
		setInputCardExpiration('')
		setInputCardCvv('')

	}
	//handle going back from credit card form, reset all values
	function handleCloseCreditForm() {

		setCreditForm(false)
		setInputCardName('')
		setInputCardNumber('')
		setInputCardExpiration('')
		setInputCardCvv('')

	}

	return (
		<>
		
		<Drawer classes={{ paper: "payment-drawer", }} anchor="bottom" open={paymentDrawer} onClose={() => setPaymentDrawer(false)}>
			
		{paymentDrawerLoading && (
			<Fade in={paymentDrawerLoading} sx={{ color: '#000' }} unmountOnExit>
				<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!paymentDrawerLoading && (

			<List>
				<ListItem disablePadding>
					<Grid container alignItems="center" justifyContent="flex-start">
						<Grid item>
							<IconButton className="payment-drawer-close-btn" size="large" onClick={handleClosePaymentDrawer}>
								<CloseIcon fontSize="inherit"  />
							</IconButton>
						</Grid>
						<Grid item onClick={() => console.log(cart[0]['productOptions'][0]['groupId'])}>
							<ListItemText primary={<Typography variant="h5">Votre paiement</Typography>} />
						</Grid>
					</Grid>
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
						<PayPalScriptProvider options={{ 
														//"client-id": process.env.REACT_APP_PAYPAL_API_KEY,
														"client-id": 'AR2qxEkod_ECVuOYG1bqm70SQ6kkIv4FKpPh2pTR6cVl0JyA_QyJdbASGExi9yVfDR8z3Sf4fmUHKfi5', 
														currency: 'CAD' }}>
							<PayPalButtons
					              style={{ layout: "horizontal", label: "pay" }} 
					              fundingSource="paypal"
					              className="paypal-btn"
					              createOrder={(data, actions) => {
					                    return actions.order.create({
					                        purchase_units: [
					                            {
					                                amount: {
					                                    value: cartTotal,
					                                },
					                            },
					                        ],
					                    });
					                }}
					              onApprove={(data, actions) => {
					                    return actions.order.capture().then((details) => {
					                    	
					                    	if(orderType === "Livraison") {
					                    	//delivery order

					                    		Axios.post("http://localhost:3500/api/order/paid/delivery/place", {
													//create new order
													paymentAuthId: details.id,
													paymentDate: DateTime.fromISO(details.create_time).setZone('America/Toronto').toFormat('yyyy-MM-dd HH:mm:ss'),
													paymentSource: "PAYPAL",

													cart: cart,
													cartSubtotal: cartSubtotal,
													cartDelivery: cartDelivery,
													cartTip: cartTip,
													cartQst: cartQst,
													cartGst: cartGst,
													cartTotal: cartTotal,
													orderType: orderType,
													orderDate: orderDate,
													orderTime: orderTime,
													orderNote: inputNote,
													userId: userId,
													userFirstName: userFirstName,
													userLastName: userLastName,
													userEmail: userEmail,
													userPhone: userPhone,
													userAddress: userAddress,
													userCity: userCity,
													userDistrict: userDistrict,
													userPostalCode: userPostalCode,
													userLat: userLat,
													userLng: userLng,

												})
												.then((response) => {
													console.log('done', response)
												})
												.catch((err) => {
											       	console.log("error ", err)});


					                    	} else {
					                    	//pickup order

					                    		Axios.post("http://localhost:3500/api/order/paid/pickup/place", {

													//create new order
													paymentAuthId: details.id,
													paymentDate: DateTime.fromISO(details.create_time).setZone('America/Toronto').toFormat('yyyy-MM-dd HH:mm:ss'),
													paymentSource: "PAYPAL",

													cart: cart,
													cartSubtotal: cartSubtotal,
													cartDelivery: cartDelivery,
													cartTip: cartTip,
													cartQst: cartQst,
													cartGst: cartGst,
													cartTotal: cartTotal,
													orderType: orderType,
													orderDate: orderDate,
													orderTime: orderTime,
													orderNote: inputNote,
													userId: userId,
													userFirstName: userFirstName,
													userLastName: userLastName,
													userEmail: userEmail,
													userPhone: userPhone,

												})
												.then((response) => {
													console.log('done', response)
												})
												.catch((err) => {
											       	console.log("error ", err)});


					                    	}
																							

					                    });
					                }}
					            />
						</PayPalScriptProvider>
					</ListItem>
				</>
				)}
				{!!creditForm && (
				<>
					<ListItem sx={{ pb: '4px' }}>
						<Button size="small" onClick={handleCloseCreditForm} startIcon={<ArrowBackIcon />}>
							Retour
						</Button>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-firstname">Nom sur la carte</InputLabel>
		            		<OutlinedInput
		            			sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-card-name"
		            			label="Nom sur la carte"
		            			value={inputCardName}
		            			onChange={(e) => setInputCardName(e.target.value)}
		            			fullWidth />
		            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
							<InputLabel htmlFor="outlined-firstname">Numéro de carte</InputLabel>
							<InputMask 
								mask={isAmex ? "9999  999999  99999" : "9999  9999  9999  9999"}
								maskChar="*"
								placeholder="Numéro de carte"
								sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-card-number"
		            			label="Numéro de carte"
		            			value={inputCardNumber}
		            			onChange={(e) => setInputCardNumber(e.target.value)}
		            			fullWidth
								>
								{(inputProps) =>
  									<OutlinedInput {...inputProps}/>}
		            		</InputMask>
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-expiration">Expiration MM/AA</InputLabel>
		            		<InputMask 
								mask="99/99" 
								sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-expiration"
		            			label="Expiration MM/AA"
		            			value={inputCardExpiration}
		            			onChange={(e) => setInputCardExpiration(e.target.value)}
		            			fullWidth
								>
								{(inputProps) =>
  									<OutlinedInput {...inputProps}/>}
		            		</InputMask>	            			
		            	</FormControl>
					</ListItem>
					<ListItem>
						<FormControl variant="outlined" fullWidth>
		            		<InputLabel htmlFor="outlined-cvv-code">CVV</InputLabel>
		            		<InputMask 
								mask={isAmex ? "9999" : "999"}
								maskChar="*"
								sx={{ paddingRight: 0 }}
		            			size="medium"
		            			id="outlined-cvv-code"
		            			label="CVV"
		            			value={inputCardCvv}
		            			onChange={(e) => setInputCardCvv(e.target.value)}
		            			fullWidth
								>
								{(inputProps) =>
  									<OutlinedInput {...inputProps}/>}
		            		</InputMask>		            			
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
						<Button disabled={!cardValidated} variant="contained" size="large" fullWidth>
							Placer la commande
						</Button>
					</ListItem>
				</>
				)}
			</List>
		)}
		</Drawer>
		</>
	)

}

export default PaymentDrawer;