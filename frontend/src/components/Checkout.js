import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";

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
	InputLabel,
	Button,
	TextField,
	Input,
	Grid,
	Fade,
	CircularProgress,
	Drawer,
	Paper,
	Chip
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



function Checkout({ setStep, cart, setCart, orderType, orderDate, orderTime, setOrderSubtotal }) {
	
	//page loading
	let [loading, setLoading] = useState(false);

	//cart price subtotal and item count
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState(0);

	const [cartGst, setCartGst] = React.useState(0);
	const [cartQst, setCartQst] = React.useState(0);
	const [cartTip, setCartTip] = React.useState(0);
	const [cartTotal, setCartTotal] = React.useState(0);


	let displayDate = DateTime.fromFormat(orderDate, 'yyyy-MM-dd').setLocale('fr').toFormat('dd MMMM');

	function handleRemoveFromCart(event, id) {

		let tempCart = [...cart];
		let toBeRemoved = {...tempCart[id]};

		//Search array for the item and filter it out from array
		//Replace current copy of cart with new filtered array
		let cleanCart = tempCart.filter((item, index) => index !== id);
		setCart(cleanCart);
	}

	//Update cart count and subtotal
	useEffect(()=> {

		if (cart.length === 0) {
			setCartCount(0);
			setCartSubtotal(0);
			return;
		}
		//inital value so no errors are thrown
		let initialValue = 0;
		//sum up all cart quantities
		let tempCartCount = cart.reduce(function (previousValue, currentValue) {
		    return previousValue + currentValue.productQty
		}, initialValue)

		let tempCartSubtotal = cart.reduce(function (previousValue, currentValue) {
			let currentTotal = currentValue.productQty*currentValue.productPrice;
			return previousValue + currentTotal;
		}, initialValue)

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2);
		setCartCount(tempCartCount);
		setCartSubtotal(tempCartSubtotal);
		setCartGst((Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2))
		console.log(cartGst)

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
	                <ListItem style={{display:'flex', justifyContent:'center'}}>
	                    <Typography variant="h3">
	                        {displayDate} {orderTime}
	                    </Typography>
	                </ListItem>
	                <Divider />
	                
	            {cart.map((item, index) => (
	                <ListItem key={index}>
	                    <Grid container alignItems="center" direction="row" justifyContent="space-between">
	                        <Grid item xs={9}>
	                            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
	                                <Grid item xs={2}>
	                                    <Chip label={item.productQty} />
	                                </Grid>
	                                <Grid item xs={10}>
	                                    <Typography variant="subtitle2" color="textPrimary">
	                                    	{item.productName}
	                                    </Typography>
	                                </Grid>
	                            </Grid>
	                        </Grid>
	                        <Grid item xs={3}>
	                            <Grid container justifyContent="flex-end">
	                                <Typography variant="subtitle1" color="textPrimary">
	                                    {(item.productPrice*item.productQty).toFixed(2)}$
	                                </Typography>
	                            </Grid>
	                        </Grid>
	                    </Grid>
	                    <ListItemSecondaryAction>
	                        <IconButton 
	                        color="default"
	                        size="small"
	                        edge="end"
	                        onClick={(event) => handleRemoveFromCart(event, index)} 
	                        >
	                            <CloseIcon />
	                        </IconButton>
	                    </ListItemSecondaryAction>
	                </ListItem>
	            ))}
	            
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
	                    <Button variant="contained" color="primary" size="large" fullWidth>
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
