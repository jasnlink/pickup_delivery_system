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

import CartDisplay from './CartDisplay';

function CartDrawer({ cart, setCart, handleCheckout, productDrawer }) {

	//cart drawer open state
	let [cartDrawer, setCartDrawer] = useState(false);

	//cart price subtotal, item count and cart product option groups
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState(0);

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

		tempCartSubtotal = (Math.round((tempCartSubtotal + Number.EPSILON) * 100) / 100).toFixed(2);
		setCartCount(tempCartCount);
		setCartSubtotal(tempCartSubtotal);


	}, [cart]);



	return (
		<>
		{!!cart.length && [ !cartDrawer && [ !productDrawer && (
			<AppBar position="fixed" className="cart-btn-container">
				<Toolbar>
					<Button 
						onClick={() => setCartDrawer(true)} 
						variant="contained" 
						color="primary" 
						size="large" 
						className="cart-btn" 
						fullWidth>
						Votre commande ᛫ ({cartCount})
					</Button>
				</Toolbar>
			</AppBar>

		)]]}
		<Drawer classes={{ paper: "cart-drawer", }} anchor="bottom" open={cartDrawer} onClose={() => setCartDrawer(false)}>
        	<List>
                <ListItem disablePadding>
					<Grid container alignItems="center" justifyContent="flex-start">
						<Grid item>
							<IconButton className="cart-drawer-close-btn" size="large" onClick={() => setCartDrawer(false)}>
								<CloseIcon fontSize="inherit"  />
							</IconButton>
						</Grid>
						<Grid item>
		                    <Typography variant="h5">
		                        Votre commande
		                    </Typography>
	                    </Grid>
	                </Grid>
                </ListItem>
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
                <ListItem sx={{ pb: '16px' }}>
                    <Button 
                    	onClick={() => handleCheckout()} 
                    	variant="contained" 
                    	color="primary" 
                    	size="large"
                    	className="btn" 
                    	fullWidth 
                    	disabled={cart.length===0}
                    >
                        Passer au paiement
                    </Button>
                </ListItem>
                </List>
            
        </Drawer>
    </>
	)
}

export default CartDrawer