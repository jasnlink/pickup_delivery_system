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
	ButtonBase
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import CartDisplay from './Forms/CartDisplay';
import TipInputForm from './Forms/TipInputForm';
import PersonalInformationForm from './Forms/PersonalInformationForm';
import CheckoutAddressDisplay from './Forms/CheckoutAddressDisplay';


function Checkout({ 
	setStep, 
	cart, 
	setCart, 
	orderType, 
	orderDate, 
	orderTime, 
	setOrderSubtotal, 
	setOrderNote, 
	userFirstName, 
	userLastName, 
	userEmail, 
	userPhone,
	userAddress, 
	userCity, 
	userDistrict, 
	userPostalCode, 
	setUserFirstName, 
	setUserLastName, 
	setUserEmail, 
	setUserPhone, 
	storeName, 
	storeAddress, 
	storeCity, 
	storeDistrict, 
	storePostalCode
}) {
	
	//page loading
	let [loading, setLoading] = useState(true);
	
	//order display date and time
	let [displayDate, setDisplayDate] = useState("")

	//cart price subtotal and item count
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState(0);
	const [cartOptgroups, setCartOptgroups] = React.useState({});

	const [cartGst, setCartGst] = React.useState(0);
	const [cartQst, setCartQst] = React.useState(0);
	const [cartTip, setCartTip] = React.useState(0);
	const [cartTotal, setCartTotal] = React.useState(0);


	useEffect(()=> {

		let date = DateTime.fromFormat(orderDate, 'yyyy-MM-dd').setLocale('fr').toFormat('dd MMMM');
		setDisplayDate(date);
		setTimeout(() => {
			setLoading(false)
		}, 500)

	}, []);


	//Update cart count and subtotal
	useEffect(()=> {

		if (cart.length === 0) {
			setCartCount(0);
			setCartSubtotal((0).toFixed(2));
			setCartGst((0).toFixed(2));
			setCartQst((0).toFixed(2));
			setCartTip((0).toFixed(2));
			setCartTotal((0).toFixed(2))
			return;
		}
		//inital value so no errors are thrown
		let initialValue = 0;
		//sum up all cart quantities
		let tempCartCount = cart.reduce(function (previousValue, currentValue) {
		    return previousValue + currentValue.productQty
		}, initialValue)

		let tempCartSubtotal = cart.reduce(function (previousValue, currentValue) {

			let currentTotal = 0;

			if(currentValue['productOptions'].length) {
				let optionSum = 0;
				for(let o of currentValue['productOptions']) {
					optionSum += o.optionPrice;
				}
				currentTotal = (optionSum+currentValue.productPrice)*currentValue.productQty
			} else {
				currentTotal = currentValue.productQty*currentValue.productPrice;
			}

			return previousValue + currentTotal;

		}, initialValue)

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100);

		let tempCartGst = tempCartSubtotal*0.05;
		let tempCartQst = tempCartSubtotal*0.0975;

		/*
		var tempCartTip
		if(selectTipValue === "other") {
			tempCartTip = cartTip*1;
		} else {
			tempCartTip = tempCartSubtotal*(selectTipValue/100);
			tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
		}
		*/

		var tempCartTotal;

		tempCartGst = (Math.round((tempCartGst + Number.EPSILON) * 100) / 100);
		tempCartQst = (Math.round((tempCartQst + Number.EPSILON) * 100) / 100);
		//tempCartTotal = (Math.round((tempCartQst + tempCartGst + tempCartTip + tempCartSubtotal + Number.EPSILON) * 100) / 100);
		tempCartTotal = (Math.round((tempCartQst + tempCartGst + tempCartSubtotal + Number.EPSILON) * 100) / 100);

		setCartCount(tempCartCount);
		setCartSubtotal((tempCartSubtotal).toFixed(2));

		setCartGst((tempCartGst).toFixed(2));
		setCartQst((tempCartQst).toFixed(2));
		//setCartTip((tempCartTip).toFixed(2));
		setCartTotal((tempCartTotal).toFixed(2))

	}, [cart]);




	return (
		<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	        	<IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(14)}>
	            	<ArrowBackIcon />
	         	 </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Paiement
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
	    {loading && (
	    	
			<Fade in={loading} sx={{ color: '#000' }} unmountOnExit>
				<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>

		)}
		{!loading && (
			
			<Container maxWidth="sm" disableGutters>
				<List sx={{ mt: '24px' }}>

					<PersonalInformationForm
						setOrderNote={note => setOrderNote(note)}
						userFirstName={userFirstName}
						userLastName={userLastName}
						userEmail={userEmail}
						userPhone={userPhone}
						setUserFirstName={first => setUserFirstName(first)}
						setUserLastName={last => setUserLastName(last)}
						setUserEmail={email => setUserEmail(email)}
						setUserPhone={phone => setUserPhone(phone)}
					 />

					 <ListItem disablePadding sx={{ mb: '0' }}>
						<ListItemText primary={<Typography variant="h4" style={{ fontWeight: 900 }}>Votre commande</Typography>} style={{display:'flex', paddingTop: '64px', justifyContent:'center'}} />
					</ListItem>
	                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}}>
	                    <Typography variant="h3">
	                        {displayDate} {orderTime}
	                    </Typography>
	                </ListItem>
	                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '16px'}} disablePadding>
	                    <Chip variant="outlined" color="default" label={orderType} />
	                </ListItem>
	                
	                <CheckoutAddressDisplay
	                	orderType={orderType}
	                	userAddress={userAddress}
						userCity={userCity}
						userDistrict={userDistrict}
						userPostalCode={userPostalCode}

						storeName={storeName}
						storeAddress={storeAddress}
						storeCity={storeCity}
						storeDistrict={storeDistrict}
						storePostalCode={storePostalCode} />

	                <Divider />

	                <CartDisplay cart={cart} setCart={cart => setCart(cart)} />
	            
	                <Divider />
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                Sous-total
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                {cartSubtotal}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                TPS 5%
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                {cartGst}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                TVQ 9.975%
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                {cartQst}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                Total
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                {cartTotal}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                <Divider />
	                <ListItem>
	                    <Button disabled={!cart.length} variant="contained" color="primary" size="large" fullWidth>
	                        Placer la commande
	                    </Button>
	                </ListItem>
	            </List>
	        </Container>    
	        
		)}
		</>
	
	)
	
}

export default Checkout;
