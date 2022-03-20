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
import RadioGroupForm from './Forms/RadioGroupForm';
import CartDrawer from './Forms/CartDrawer';


function Menu({ setStep, cart, setCart, orderType, orderDate, orderTime }) {
	
	//page loading
	let [loading, setLoading] = useState(true);
	//product selection loading
	let [productLoading, setProductLoading] = useState(true);
	//product drawer open state
	let [productDrawer, setProductDrawer] = useState(false);
	

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
		getIdArray(data, 'optgroup_id')
			.then((result) => {
				Axios.post("http://localhost:3500/api/product/list/options", {
					optiongroups: result,
				})
				.then((response) => {
					setProductOptions(response.data)
				})
				.catch((err) => {
	       			console.log("error ", err)});
			})

	}

	//handle add product option
	function handleAddProductOption(option) {
		let tempOptions = [...selectProductOptions]
		tempOptions.push(option);
		setSelectProductOptions(tempOptions)
	}
	//handle removing product option
	function handleRemoveProductOption(option) {
		let tempOptions = [...selectProductOptions]
		var toBeRemoved;
		//loop through and find matching product option
		for(let i = 0; i < tempOptions.length; i++) {
			if(tempOptions[i].groupId === option.groupId && tempOptions[i].optionId === option.optionId) {
				toBeRemoved = i;
			}
		}
		//filter out found option
		let cleanOptions = tempOptions.filter((item, index) => index !== toBeRemoved)
		setSelectProductOptions(cleanOptions);
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
			setSelectProductOptions([])
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
		let subtotal = 0

		if(selectProductOptions.length) {
			let sum = 0;
			for(let o of selectProductOptions) {
				sum += o.optionPrice
			}
			subtotal = (selectProductPrice+sum)*selectProductQty;
			subtotal = (Math.round((subtotal + Number.EPSILON) * 100) / 100).toFixed(2);
			setSelectSubtotal(subtotal)
		} else {
			subtotal = selectProductQty*selectProductPrice;
			subtotal = (Math.round((subtotal + Number.EPSILON) * 100) / 100).toFixed(2);
			setSelectSubtotal(subtotal);
		}

	}, [selectProductQty, selectProductOptions]);

	//handles adding a product to cart
	function handleAddToCart() {
		let product = {
			productId: selectProductId,
			productName: selectProductName,
			productPrice: selectProductPrice,
			productQty: selectProductQty,
			productSubtotal: selectSubtotal,
			productOptions: selectProductOptions,
		};
		setCart(cart => [...cart, product])
		closeProductDrawer();
	}



	//go to checkout
	function handleCheckout() {
		setStep(15)
	}


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
				<CartDrawer cart={cart} setCart={cart => setCart(cart)} handleCheckout={handleCheckout} />
			</Container>
			

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
									<RadioGroupForm productOptgroups={productOptgroups} productOptions={productOptions} handleAddProductOption={option => handleAddProductOption(option)} handleRemoveProductOption={option => handleRemoveProductOption(option)} />
									<CheckBoxGroupForm productOptgroups={productOptgroups} productOptions={productOptions} handleAddProductOption={option => handleAddProductOption(option)} handleRemoveProductOption={option => handleRemoveProductOption(option)} />
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
							Ajouter à la commande ᛫ {selectSubtotal}$
						</LoadingButton>
					</Toolbar>
				</AppBar>
			</Drawer>
			</>
		)}

		</>)
}

export default Menu;