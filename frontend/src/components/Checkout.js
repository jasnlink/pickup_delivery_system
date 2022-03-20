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



function Checkout({ setStep, cart, setCart, orderType, orderDate, orderTime, setOrderSubtotal }) {
	
	//page loading
	let [loading, setLoading] = useState(true);
	//order display date and time
	let [displayDate, setDisplayDate] = useState("")
	//tip input visible
	let [inputTip, setInputTip] = useState(false);
	//tip select value
	let [selectTipValue, setSelectTipValue] = useState("15");
	//tip input value
	let [inputTipValue, setInputTipValue] = useState("");


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
		buildCartProductOptions()
		.then((result) => {
			setCartOptgroups(result)
			setTimeout(() => {
				setLoading(false)
			}, 500)
		})

	}, []);


	//helper function to generate product option groups that are in the cart
	async function buildCartProductOptions() {

		let cartMap = {};
		for(let c of cart) {
			if(c['productOptions'].length) {
				for(let o of c['productOptions']) {
					if(!cartMap[o.groupId]) {
						cartMap[o.groupId] = o.groupName;
					}
				}
			}			
		}

		return cartMap;
	}


	function handleRemoveFromCart(event, id) {

		let tempCart = [...cart];
		let toBeRemoved = {...tempCart[id]};

		//Search array for the item and filter it out from array
		//Replace current copy of cart with new filtered array
		let cleanCart = tempCart.filter((item, index) => index !== id);
		setCart(cleanCart);
	}

	useEffect(()=> {
		if(selectTipValue !== "other") {
			let tempCartTotal = cartTotal-cartTip;
			let tempCartTip = cartSubtotal*(selectTipValue/100);
			tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
			tempCartTotal += tempCartTip;
			setCartTip((tempCartTip).toFixed(2));
			setCartTotal((tempCartTotal).toFixed(2))
		} else {
			return;
		}
	}, [selectTipValue]);

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
		var tempCartTip
		if(selectTipValue === "other") {
			tempCartTip = cartTip*1;
		} else {
			tempCartTip = tempCartSubtotal*(selectTipValue/100);
			tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
		}
		var tempCartTotal;

		tempCartGst = (Math.round((tempCartGst + Number.EPSILON) * 100) / 100);
		tempCartQst = (Math.round((tempCartQst + Number.EPSILON) * 100) / 100);
		tempCartTotal = (Math.round((tempCartQst + tempCartGst + tempCartTip + tempCartSubtotal + Number.EPSILON) * 100) / 100);

		setCartCount(tempCartCount);
		setCartSubtotal((tempCartSubtotal).toFixed(2));

		setCartGst((tempCartGst).toFixed(2));
		setCartQst((tempCartQst).toFixed(2));
		setCartTip((tempCartTip).toFixed(2));
		setCartTotal((tempCartTotal).toFixed(2))

	}, [cart]);


	function handleSelectTip(e) {
		if(e.target.value === "other") {
			setInputTip(true)
		} else {
			setInputTip(false)
			setInputTipValue("")
		}
		setSelectTipValue(e.target.value)
	}

	function handleInputTipSubmit() {

		let tempCartTotal = cartTotal-cartTip;
		console.log('temp tip', cartTip)
		console.log('temp total',tempCartTotal)
		let tempCartTip = Number.parseFloat(inputTipValue);
		tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
		tempCartTotal += tempCartTip;
		setCartTip((tempCartTip).toFixed(2));
		setCartTotal((tempCartTotal).toFixed(2))
		setInputTip(false)

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
					
	                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}} onClick={() => console.log(cartTip)}>
	                    <Typography variant="h3">
	                        {displayDate} {orderTime}
	                    </Typography>
	                </ListItem>
	                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '16px'}} disablePadding>
	                    <Chip variant="outlined" color="default" label={orderType} />
	                </ListItem>
	                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '2px'}}>
	                	<Typography variant="h6">
	                		Ajouter un pourboire
	                	</Typography>
	                </ListItem>
	                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}}>
	                	<ToggleButtonGroup color="primary" value={selectTipValue} exclusive onChange={(e) => handleSelectTip(e)}>
	                		<ToggleButton value="10">
	                			10%
	                		</ToggleButton>
	                		<ToggleButton value="15">
	                			15%
	                		</ToggleButton>
	                		<ToggleButton value="20">
	                			20%
	                		</ToggleButton>
	                		<ToggleButton value="other">
	                			Autre
	                		</ToggleButton>
	                	</ToggleButtonGroup>
	                </ListItem>
	                {inputTip === true && (
		                <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}}>
		                	<FormControl variant="outlined">
		                		<InputLabel htmlFor="filled-adornment-amount">Montant</InputLabel>
		                		<OutlinedInput
		                			onChange={(e) => setInputTipValue(e.target.value)}
		                			value={inputTipValue}
		                			sx={{ paddingRight: 0 }}
		                			size="small"
		                			id="filled-adornment-amount"
		                			label="Montant"
		                			startAdornment={<InputAdornment position="start">$</InputAdornment>}
		                			endAdornment={
						              <InputAdornment position="end">
						              	<Divider sx={{ height: 38, m: 0 }} orientation="vertical" />
						              	<ButtonBase disabled={!inputTipValue.length} onClick={handleInputTipSubmit} sx={{ height: 38, padding: '12px 0', width: '48px', backgroundColor: '#1976d2', color: '#ffffff', outline: '1px solid #1976d2 !important', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}>
						              		<KeyboardReturnIcon color="inherit" fontSize="medium" />
						              	</ButtonBase>
						                
						              </InputAdornment>
						            }
		                			fullWidth />
		                			
		                	</FormControl>
		                </ListItem>
	                )}
	                <Divider />
	            {cart.map((item, index) => (
            	<>
                <ListItem key={index}>
                    <Grid container alignItems="center" direction="row" justifyContent="space-between">
                        <Grid item xs={9}>
                            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                                <Grid item xs={3}>
                                    <Chip label={item.productQty} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="subtitle2" color="textPrimary">
                                    	{item.productName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Grid container justifyContent="flex-end">
                                <Typography variant="subtitle1" color="textPrimary">
                                    {item.productSubtotal}$
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
                {!!item['productOptions'].length && (
                	<>
                	<List sx={{ mt: '-16px', pt: 0, pl: 1 }}>
                	{Object.keys(cartOptgroups).map((keyId, i) => (
                		<>
                		<ListItem sx={{ pb: '2px', pt: '2px' }}>
                		<Grid container>
	                		<Grid item xs ={2}>
	                        	<div></div>
	                        </Grid>
	                        <Grid item xs={8}>
		                		<Typography sx={{ pr: '8px' }} variant="body2">{cartOptgroups[keyId]+':'}</Typography> 
			                	{item['productOptions'].map((option, index) => (
			                		<>
				                	{option.groupId == keyId && (
					                	<>
					                		<Chip sx={{ mb:'4px' ,mr: '4px' }} variant="filled" size="small" color="default" label={option.optionName} />
					                	</>
					                )}
				                	</>
			                	))}
		                	</Grid>
		                	<Grid item xs ={2}>
	                        	<div></div>
	                        </Grid>
		                </Grid>
	                	</ListItem>
	                	</>
                	))}
                	</List>
                	</>
                )}
                </>
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
