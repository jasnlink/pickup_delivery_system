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

import CartDisplay from './Forms/CartDisplay';
import TipInputForm from './Forms/TipInputForm';
import PersonalInformationForm from './Forms/PersonalInformationForm';
import CheckoutAddressDisplay from './Forms/CheckoutAddressDisplay';
import PaymentDrawer from './Forms/PaymentDrawer';


function Checkout({ 
	setStep, 
	cart, 
	setCart, 
	orderType, 
	orderDate, 
	orderTime, 
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
	userLng,
	setUserFirstName, 
	setUserLastName, 
	setUserEmail, 
	setUserPhone, 
	storeName, 
	storeAddress, 
	storeCity, 
	storeDistrict, 
	storePostalCode,
	storeLat,
	storeLng,
	deliveryZones
}) {
	
	//page loading
	let [loading, setLoading] = useState(true);
	//payment drawer open state
	let [paymentDrawer, setPaymentDrawer] = useState(false);
	//order display date and time
	let [displayDate, setDisplayDate] = useState("")

	const [inputNote, setInputNote] = useState("")

	//cart price subtotal and item count
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState(0);

	const [cartDelivery, setCartDelivery] = React.useState(0);
	const [cartMinimum, setCartMinimum] = React.useState(0);

	const [cartGst, setCartGst] = React.useState(0);
	const [cartQst, setCartQst] = React.useState(0);
	const [cartTip, setCartTip] = React.useState(0);
	const [cartTotal, setCartTotal] = React.useState(0);


	useEffect(()=> {

		if(orderType === "Livraison") {

			getCurrentZone()
			.then((result) => {
				setCartDelivery((result.delivery_zone_price).toFixed(2))
				setCartMinimum((result.delivery_zone_order_min).toFixed(2))
				let date = DateTime.fromFormat(orderDate, 'yyyy-MM-dd').setLocale('fr').toFormat('dd MMMM');
				setDisplayDate(date);
				addCartTotal();
				setTimeout(() => {
					setLoading(false)
				}, 500)

			})
		} else {

			let date = DateTime.fromFormat(orderDate, 'yyyy-MM-dd').setLocale('fr').toFormat('dd MMMM');
			setDisplayDate(date);
			setTimeout(() => {
				setLoading(false)
			}, 500)
		}
		
	}, []);

	async function getCurrentZone() {
		//calculate distance between user and store with helper function
		const distanceFromStore = distance(storeLat, storeLng, userLat, userLng, 'K');
		var currentZone;

		let cursor = 0
		let i = 0;

		while(cursor < distanceFromStore) {
			cursor = deliveryZones[i]['delivery_zone_range']
			currentZone = deliveryZones[i]
			i++
		}

		return currentZone;
	}

	function addCartTotal() {
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
				for(let g of currentValue['productOptions']) {
					for(let o of g['groupOptions']) {
						optionSum += o.optionPrice;
					}
				}
				currentTotal = (optionSum+currentValue.productPrice)*currentValue.productQty
			} else {
				currentTotal = currentValue.productQty*currentValue.productPrice;
			}

			return previousValue + currentTotal;

		}, initialValue)

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100);

		var tempCartGst;
		var tempCartQst;

		if(orderType === "Livraison") {
			tempCartGst = ((cartDelivery*1)+tempCartSubtotal)*0.05;
			tempCartQst = ((cartDelivery*1)+tempCartSubtotal)*0.09975;
		} else {
			tempCartGst = tempCartSubtotal*0.05;
			tempCartQst = tempCartSubtotal*0.09975;
		}
		

		var tempCartTotal;

		tempCartGst = (Math.round((tempCartGst + Number.EPSILON) * 100) / 100);
		tempCartQst = (Math.round((tempCartQst + Number.EPSILON) * 100) / 100);

		if(orderType === "Livraison") {
			tempCartTotal = (Math.round(((cartDelivery*1) + (cartTip*1) + tempCartQst + tempCartGst + tempCartSubtotal + Number.EPSILON) * 100) / 100);
		} else {
			tempCartTotal = (Math.round(((cartTip*1) + tempCartQst + tempCartGst + tempCartSubtotal + Number.EPSILON) * 100) / 100);
		}

		setCartCount(tempCartCount);
		setCartSubtotal((tempCartSubtotal).toFixed(2));

		setCartGst((tempCartGst).toFixed(2));
		setCartQst((tempCartQst).toFixed(2));
		setCartTotal((tempCartTotal).toFixed(2))
	}


	useEffect(()=> {

		addCartTotal();

	}, [cart, cartTip, cartDelivery]);

	//Harversine formula to calculate distance between two points on earth
	function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
	}


	return (
		<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	        	<IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(14)}>
	            	<ArrowBackIcon />
	         	 </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Sommaire de commande
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
				<PaymentDrawer 
						paymentDrawer={paymentDrawer} 
						setPaymentDrawer={paymentDrawer => setPaymentDrawer(paymentDrawer)}
						inputNote={inputNote}

						orderType={orderType}
						orderDate={orderDate}
						orderTime={orderTime}

						cartSubtotal={cartSubtotal}
						cartDelivery={cartDelivery}
						cartTip={cartTip}
						cartQst={cartQst}
						cartGst={cartGst}
						cartTotal={cartTotal}
						cart={cart}

						userId={userId}
						userFirstName={userFirstName}
						userLastName={userLastName}
						userEmail={userEmail}
						userPhone={userPhone}

						userAddress={userAddress}
						userCity={userCity}
						userDistrict={userDistrict}
						userPostalCode={userPostalCode}
						userLat={userLat}
						userLng={userLng}



						 />
				<List sx={{ mt: '24px' }}>

					<PersonalInformationForm
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
	            	<ListItem sx={{ pt: '48px', pb: '24px' }}>
						<TextField 
							label="Ajouter une note à la commande" 
							multiline 
							minRows={4} 
							value={inputNote}
							onChange={(e) => setInputNote(e.target.value)}
							fullWidth />
					</ListItem>

					{parseFloat(cartMinimum) > parseFloat(cartSubtotal) && (
						<ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}}>
							<Alert variant="filled" severity="error" icon={false}>
					        	<Typography  variant="subtitle1" sx={{ pl: '8px', pr: '8px' }}>
					        		Minimum de {cartMinimum}$ avant frais et taxes pour cette livraison.
					        	</Typography>
					        </Alert>
				        </ListItem>
	                )}
	                {parseFloat(cartMinimum) < parseFloat(cartSubtotal) && (
						<TipInputForm cartSubtotal={cartSubtotal} cartTip={cartTip} setCartTip={tip => setCartTip(tip)} cartTotal={cartTotal} setCartTotal={total => setCartTotal(total)} />
	                )}
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
		                                Pourboire
		                            </Typography>
		                        </Grid>
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                {cartTip}$
		                            </Typography>
		                        </Grid>
		                    </Grid>
		                </ListItem>
		            {orderType === "Livraison" && (
		            <>
		                <ListItem>
		                    <Grid container alignItems="center" justifyContent="space-between">
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                Frais de Livraison
		                            </Typography>
		                        </Grid>
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                {cartDelivery === 0 ? 'Gratuit' : cartDelivery}$
		                            </Typography>
		                        </Grid>
		                    </Grid>
		                </ListItem>
		            </>
	            	)}
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
	                    <Button onClick={() => setPaymentDrawer(true)} disabled={!cart.length || parseFloat(cartMinimum) > parseFloat(cartSubtotal)} variant="contained" color="primary" size="large" fullWidth>
	                        Payer Maintenant
	                    </Button>
	                </ListItem>
	                <ListItem>
	                    <Button onClick={() => setPaymentDrawer(true)} disabled={!cart.length || parseFloat(cartMinimum) > parseFloat(cartSubtotal)} variant="outlined" color="primary" size="large" fullWidth>
	                        Paiement sur livraison
	                    </Button>
	                </ListItem>
	            </List>
	        </Container>    
	        
		)}
		</>
	
	)
	
}

export default Checkout;
