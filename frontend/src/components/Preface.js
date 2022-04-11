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


function Preface({ setStep}) {


	//page loading
	let [loading, setLoading] = useState(true);
	//list of categories
	const [categories, setCategories] = useState('');
	//list of products
	const [products, setProducts] = useState('');


	useEffect(() => {

		const orderWeekday = DateTime.now().setZone('America/Toronto').get('weekday');
		const orderTime = DateTime.now().setZone('America/Toronto').toFormat('HH:mm')

		//get categories
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/category/list/operation", {
			day: orderWeekday,
			time: orderTime,
		})
		.then((response) => {
			setCategories(response.data)
			getIdArray(response.data, 'category_id')
			.then((result) => {
				Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/product/list/category", {
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

	return (
	<>

		{loading && (
			<Fade in={loading} sx={{ color: '#000' }} unmountOnExit>
				<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
			</Fade>
		)}
		{!loading && (
			<>
		    <Container maxWidth='sm'>
				<List style={{ paddingBottom: 96 }}>
				{categories.map((category, cIndex) => (
					<>
					<ListItem disablePadding key={cIndex} sx={{ mt: '24px' }}>
						<ListItemText primary={<Typography variant="h3" sx={{ fontWeight: '500' }} className="category-title">{category.category_name}</Typography>} />
					</ListItem>
					{products.map((product, pIndex) => (
						<>
						{product.category_id === category.category_id && (
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
						)}
						</>
					))}
					</>
				))}
				</List>

				<AppBar position="fixed" className="product-drawer-add-cart-container">
					<Toolbar>
						<LoadingButton 
							onClick={() => setStep(1)} 
							variant="contained" 
							color="primary" 
							size="large" 
							className="product-drawer-add-cart-btn" 
							fullWidth>
							Commencer une commande
						</LoadingButton>
					</Toolbar>
				</AppBar>

			</Container>
			</>
		)}

	</>
	)

}
export default Preface;