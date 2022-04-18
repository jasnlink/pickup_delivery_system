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


function CartDisplay({ cart, setCart, handleCheckout }) {

	//page loading
	const [cartLoading, setCartLoading] = useState(true);

	useEffect(()=> {

		setCartLoading(false)


	}, []);


	//handles removing a product from cart
	function handleRemoveFromCart(event, id) {

		let tempCart = [...cart];
		let toBeRemoved = {...tempCart[id]};

		//Search array for the item and filter it out from array
		//Replace current copy of cart with new filtered array
		let cleanCart = tempCart.filter((item, index) => index !== id);
		setCart(cleanCart);
	}


	return (

		<>
		{cartLoading && (
	    	
			<Fade in={cartLoading} sx={{ color: '#000' }} unmountOnExit>
				<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>

		)}
		{!cartLoading && (
		<>
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
	                		<ListItem sx={{ pb: '2px', pt: '2px' }}>
	                		<Grid container>
		                		<Grid item xs ={2}>
		                        	<div></div>
		                        </Grid>
		                        <Grid item xs={8}>
				                	{item['productOptions'].map((group, index) => (
				                		<>
				                		<Typography sx={{ pr: '8px' }} variant="body2">{group.groupName+':'}</Typography> 

					                	{group['groupOptions'].map((option, index) => (
						                	<>
						                		<Chip sx={{ mt:'4px' ,mr: '4px' }} variant="filled" size="small" color="default" label={option.optionName} />
						                	</>
						                ))}
					                	</>
				                	))}
			                	</Grid>
			                	<Grid item xs ={2}>
		                        	<div></div>
		                        </Grid>
			                </Grid>
		                	</ListItem>

	                	</List>
	                	</>
	                )}
	                </>
	            ))}
			</>
			)}
	</>
	)

}
export default CartDisplay;
