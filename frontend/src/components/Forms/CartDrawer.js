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
	Chip,
	Checkbox,
	FormGroup,
	Radio,
	RadioGroup
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';

import '../styles/Menu.css';

function CartDrawer({ cart, setCart, handleCheckout }) {

	//cart drawer open state
	let [cartDrawer, setCartDrawer] = useState(false);

	//cart price subtotal, item count and cart product option groups
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState(0);
	const [cartOptgroups, setCartOptgroups] = React.useState({});

	//handles removing a product from cart
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
			setCartSubtotal((0).toFixed(2));
			return;
		}
		//inital value so no errors are thrown
		let initialValue = 0;
		//sum up all cart quantities
		let tempCartCount = cart.reduce(function (previousValue, currentValue) {
		    return previousValue + currentValue.productQty
		}, initialValue)

		//calculate cart subtotal from all items in cart
		let tempCartSubtotal = cart.reduce(function (previousValue, currentValue) {

			let currentTotal = 0;

			//add selected product options
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

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2);
		setCartCount(tempCartCount);
		setCartSubtotal(tempCartSubtotal);


		//generate product option groups that are in the cart
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

		setCartOptgroups(cartMap)

	}, [cart]);



	return (
		<>
		{!!cart.length && [ !cartDrawer && (
			<AppBar position="fixed" className="cart-btn-container">
				<Toolbar>
					<Button onClick={() => setCartDrawer(true)} variant="contained" color="primary" size="large" className="cart-btn" fullWidth>
						Votre commande ᛫ ({cartCount})
					</Button>
				</Toolbar>
			</AppBar>

		)]}
		<Drawer classes={{ paper: "cart-drawer", }} anchor="bottom" open={cartDrawer} onClose={() => setCartDrawer(false)}>
        	<List>
                <ListItem>
                    <Typography variant="h6">
                        Votre commande
                    </Typography>
                </ListItem>
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
					                		<Chip sx={{ mt:'4px' ,mr: '4px' }} variant="filled" size="small" color="default" label={option.optionName} />
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
                    <Button onClick={() => handleCheckout()} variant="contained" color="primary" size="large" fullWidth disabled={cart.length===0}>
                        Passer au paiement
                    </Button>
                </ListItem>
                </List>
            
        </Drawer>
    </>
	)
}

export default CartDrawer