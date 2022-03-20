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

import './styles/Menu.css';

import CheckBoxGroupForm from './Forms/CheckBoxGroupForm';


function Menu({ setStep, cart, setCart, orderType, orderDate, orderTime }) {
	
	//page loading
	let [loading, setLoading] = useState(true);
	//product selection loading
	let [productLoading, setProductLoading] = useState(true);
	//product drawer open state
	let [productDrawer, setProductDrawer] = useState(false);
	//cart drawer open state
	let [cartDrawer, setCartDrawer] = useState(false);

	//list of categories
	const [categories, setCategories] = useState('');
	//list of products
	const [products, setProducts] = useState('');
	//list of product option groups
	const [productOptgroups, setProductOptgroups] = useState('');
	//list of product options belonging in option groups
	const [productOptions, setProductOptions] = useState('');

	//product selection
	const [selectProductId, setSelectProductId] = useState('');
	const [selectProductName, setSelectProductName] = useState('');
	const [selectProductPrice, setSelectProductPrice] = useState('');
	const [selectProductDesc, setSelectProductDesc] = useState('');
	const [selectProductImg, setSelectProductImg] = useState('');
	const [selectProductQty, setSelectProductQty] = useState('');

	//product options of selection
	const [selectProductOptions, setSelectProductOptions] = React.useState([]);
	//subtotal of current selection
	const [selectSubtotal, setSelectSubtotal] = React.useState(0);

	//cart price subtotal and item count
	const [cartSubtotal, setCartSubtotal] = React.useState(0);
	const [cartCount, setCartCount] = React.useState(0);

	useEffect(() => {

		const orderWeekday = DateTime.fromFormat(orderDate, 'yyyy-MM-dd').get('weekday');

		//get categories
		Axios.post("http://localhost:3500/api/category/list/operation", {
			day: orderWeekday,
			time: orderTime,
		})
		.then((response) => {
			setCategories(response.data)
			getIdArray(response.data, 'category_id')
			.then((result) => {
				Axios.post("http://localhost:3500/api/product/list/category", {
					categories: result,
				})
				.then((response) => {
					setProducts(response.data)
					setLoading(false)
				})
				.catch((err) => {
	       			console.log("error ", err)});
			})
		})
		.catch((err) => {
	       	console.log("error ", err)});


	}, [])

	//helper function to generate an array of a specific property of an object
	async function getIdArray(data, id_field) {
		let result = []
		for(let d of data) {
			result.push(d[id_field])
		}
		return result;
	}


	//handle product selection
	async function handleProductSelect(id, name, price, desc, img) {
		try {
			setProductLoading(true)
			setProductDrawer(true)
			setSelectProductId(id);
			setSelectProductName(name);
			setSelectProductPrice(price);
			setSelectProductDesc(desc);
			setSelectProductImg(img);
			setSelectProductQty(1);
			await getProductOptiongroups(id);
			
		} finally {
			setTimeout(() => {
				setProductLoading(false)
			}, 450)
		}
	}
	//helper function to fetch product option groups given a product id
	async function getProductOptiongroups(id) {
		//get option groups
		Axios.post("http://localhost:3500/api/product/list/optiongroups", {
			id: id,
		})
		.then((response) => {
			if(response.data.length) {
				setProductOptgroups(response.data)
				getProductOptions(response.data)
			}
		})
		.catch((err) => {
	       	console.log("error ", err)});
	}
	//helper function to fetch product options given product option groups data
	async function getProductOptions(data) {
		console.log(data)
		getIdArray(data, 'optgroup_id')
			.then((result) => {
				Axios.post("http://localhost:3500/api/product/list/options", {
					optiongroups: result,
				})
				.then((response) => {
					setProductOptions(response.data)
					console.log(response.data)
				})
				.catch((err) => {
	       			console.log("error ", err)});
			})

	}

	//handle closing product drawer
	function closeProductDrawer() {

			setProductDrawer(false)
			setSelectProductId('');
			setSelectProductName('');
			setSelectProductPrice('');
			setSelectProductDesc('');
			setSelectProductImg('');
			setSelectProductQty('')
			setProductOptgroups('')
			setProductOptions('')
	}

	//Increment and decrement chosen item quantity
	function handleIncQty() {
		setSelectProductQty(selectProductQty+1);
	}
	function handleDecQty() {
		setSelectProductQty(selectProductQty-1);
	}
	//calculate subtotal amount to be added to cart
	useEffect(()=> {
		setSelectSubtotal(selectProductQty*selectProductPrice)
	}, [selectProductQty]);

	//handles adding a product to cart
	function handleAddToCart() {
		let product = {
			productId: selectProductId,
			productName: selectProductName,
			productPrice: selectProductPrice,
			productQty: selectProductQty,
		};
		setCart(cart => [...cart, product])
		closeProductDrawer();
	}

	//handles removing a product from cart
	function handleRemoveFromCart(event, id) {

		let tempCart = [...cart];
		let toBeRemoved = {...tempCart[id]};

		//Search array for the item and filter it out from array
		//Replace current copy of cart with new filtered array
		let cleanCart = tempCart.filter((item, index) => index !== id);
		setCart(cleanCart);
	}

	//go to checkout
	function handleCheckout() {
		setStep(15)
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

	}, [cart]);

	return (<>

		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <Typography variant="h6" color="inherit" component="div">
	            Menu
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
			<>
		    <Container maxWidth='sm'>
				<List style={{ paddingBottom: 64 }}>
				{categories.map((category, cIndex) => (
					<>
					<ListItem disablePadding key={cIndex} sx={{ mt: '24px' }}>
						<ListItemText primary={<Typography variant="h4" className=".category-title">{category.category_name}</Typography>} />
					</ListItem>
					{products.map((product, pIndex) => (
						<>
						{product.category_id === category.category_id && (
							<ListItemButton disableGutters onClick={() => handleProductSelect(product.product_id, product.product_name, product.product_price, product.product_desc, product.product_image)}>
								<ListItem disablePadding sx={{ mt: '4px' }}>
										<Grid container direction="row" key={pIndex}>
											<Grid container item direction="row" xs={8} sm={9}>
												<Grid item xs={12}>
													<Typography variant="h6" className="product-title">
														{product.product_name}
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<Typography variant="body1" className="product-price">
														{(product.product_price).toFixed(2)}$
													</Typography>
												</Grid>
												<Grid item xs={12} className="product-description-container">
													<div className="product-description-wrapper">
														<Typography variant="body2" className="product-description">
															{product.product_desc}
														</Typography>
													</div>
												</Grid>
											</Grid>
											<Grid item xs={4} sm={3}>
												<img className="product-media" src={product.product_image} />
											</Grid>
										</Grid>								
								</ListItem>
							</ListItemButton>
						)}
						</>
					))}
					</>
				))}
				</List>
				{!!cart.length && (
					<AppBar position="fixed" className="cart-btn-container">
						<Toolbar>
							<Button onClick={() => setCartDrawer(true)} variant="contained" color="primary" size="large" className="cart-btn" fullWidth>
								Votre commande ᛫ ({cartCount})
							</Button>
						</Toolbar>
					</AppBar>
				)}
			</Container>
			<Drawer classes={{ paper: "cart-drawer", }} anchor="bottom" open={cartDrawer} onClose={() => setCartDrawer(false)}>
            	<List>
	                <ListItem>
                        <Typography variant="h6">
                            Votre commande
                        </Typography>
	                </ListItem>
	                <Divider />
	            {cart.map((item, index) => (
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
	                    <Button onClick={() => handleCheckout()} variant="contained" color="primary" size="large" fullWidth disabled={cart.length===0}>
	                        Passer au paiement
	                    </Button>
	                </ListItem>
	                </List>
	            
	        </Drawer>

			<Drawer open={productDrawer} onClose={closeProductDrawer} classes={{paper: "product-drawer"}} anchor="bottom" style={{ paddingBottom: 32 }}>
				{productLoading && (
					<CircularProgress size={64} style={{position: 'absolute', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
				)}
				{!productLoading && (
					<>
					<IconButton className="product-drawer-close-btn" size="medium" onClick={closeProductDrawer}>
						<CloseIcon  />
					</IconButton>
					<img src={selectProductImg} className="product-drawer-media" />
					<Container>
						<List>
							<ListItem disablePadding>
								<Typography variant="h4" className="product-drawer-title">
									{selectProductName}
								</Typography>
							</ListItem>
							<ListItem disablePadding sx={{ mt: '8px', mb: '24px' }}>
								<Typography variant="body2" className="product-drawer-desc">
									{selectProductDesc}
								</Typography>
							</ListItem>
							<Divider style={{ marginLeft: '-4%', marginRight: '-4%' }} />
							{productOptgroups && (
								<>
									<CheckBoxGroupForm productOptgroups={productOptgroups} productOptions={productOptions} />
								</>
							)}
							<ListItem sx={{ mt: '4px', mb: '4px' }}>
								<Grid container spacing={2} justifyContent="center" alignItems="center">
			                        <Grid item>
			                            <IconButton
			                                color="primary"
			                                onClick={handleDecQty}
			                                disabled={selectProductQty <= 1}
			                                className="product-drawer-qty-icon"
			                            >
			                                <RemoveCircleIcon fontSize="inherit" />
			                            </IconButton>
			                        </Grid>
			                        <Grid item>
			                            <Typography variant="h5">{selectProductQty}</Typography>						
			                        </Grid>
			                        <Grid item>
			                            <IconButton color="primary" onClick={handleIncQty} className="product-drawer-qty-icon">
			                                <AddCircleIcon fontSize="inherit" />
			                            </IconButton>
			                        </Grid>
			                    </Grid>
							</ListItem>
						</List>
					</Container>
					</>
				)}
				<AppBar position="fixed" className="product-drawer-add-cart-container">
					<Toolbar>
						<LoadingButton onClick={handleAddToCart} variant="contained" color="primary" size="large" className="product-drawer-add-cart-btn" fullWidth>
							Ajouter à la commande ᛫ {selectSubtotal.toFixed(2)}$
						</LoadingButton>
					</Toolbar>
				</AppBar>
			</Drawer>
			</>
		)}

		</>)
}

export default Menu;