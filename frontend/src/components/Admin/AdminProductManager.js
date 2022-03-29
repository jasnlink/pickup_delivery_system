import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";
import io from 'socket.io-client';

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
	Alert,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	Collapse,
	Card,
	CardActionArea,
	Stack
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import AdminProductEditDrawer from './Forms/AdminProductEditDrawer'

function AdminProductManager() {


	const [productLoading, setProductLoading] = useState(false)
	const [products, setProducts] = useState([])

	const [categoryLoading, setCategoryLoading] = useState(true)
	const [categories, setCategories] = useState([])
	

	useEffect(() => {

		//fetch categories
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
		.then((response) => {
			setCategories(response.data)
			handleSelectCategory(response.data[0].category_id)
			setCategoryLoading(false)
		})
		.catch((err) => {
   			console.log("error ", err)});

	}, [])


	const [categorySelectId, setCategorySelectId] = useState(0)

	function handleSelectCategory(sId) {

		if(sId === categorySelectId) {
			return;
		}

		setProductLoading(true)
		setCategorySelectId(sId)

		//fetch categories
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/products/fetch/category", {
			categoryId: sId
		})
		.then((response) => {
			setProducts(response.data)
			setProductLoading(false)
			console.log(response.data)
		})
		.catch((err) => {
   			console.log("error ", err)});

	}

	const [productEditId, setProductEditId] = useState(0)


	return (
	<>		


		<Grid container>
			<Grid item xs={2}>
				<Paper sx={{ minHeight: '100vh' }} elevation={8} square>
					<List sx={{ pt: '8vh' }}>
						<ListItem>
							<ListItemText primary={<Typography variant="h6" style={{ fontWeight: '500' }}>Catégories</Typography>} />
						</ListItem>
						{categoryLoading && (
							<Fade in={categoryLoading}>
								<CircularProgress size={32} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-16px', marginLeft: '-16px'}} color="inherit" />
							</Fade>
						)}
						{!categoryLoading && (
						<>
							{categories.map((category, index) => (

								<ListItemButton key={category.category_id} selected={categorySelectId === category.category_id} onClick={() => handleSelectCategory(category.category_id)}>
									<ListItemText primary={category.category_name} />
								</ListItemButton>

							))}
						</>
						)}
					</List>
				</Paper>
			</Grid>
			<Grid item xs={10} style={{ maxHeight: '100vh', overflow: 'auto', backgroundColor: '#d9d9d994' }}>
				{productLoading && (
					<Fade in={productLoading}>
						<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
					</Fade>
				)}
				{!productLoading && (
				<>
					<Container maxWidth="sm" sx={{ pt: 6 }}>
						<Typography variant="h4">
							Produits
						</Typography>
						<Divider color="black" sx={{ mt: '8px' }} />
						<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
							{products.map((product, index) => (
								<Card key={product.product_id} component="div" sx={{ p: '6px 24px' }} square>
									<Grid container alignItems="center" spacing={2}>
										<Grid item xs={6}>
											<Typography variant="subtitle1">
												{product.product_name}
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography variant="subtitle1">
												{product.product_price}
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<ButtonBase 
												sx={{ backgroundColor: '#000000', color: '#ffffff', p: '12px 24px' }}
												disableElevation
												onMouseDown={event => event.stopPropagation()}
												onTouchStart={(event) => event.stopPropagation()} 
												onClick={event => {
									              event.stopPropagation();
									              event.preventDefault();
									              
								            }}>
												<EditIcon />
											</ButtonBase>
										</Grid>
										<Grid item sx={2} direction="column">
											
											<Grid item>
												<ButtonBase 
													sx={{ p:0 }}
													color="primary"
													disableElevation
													onMouseDown={event => event.stopPropagation()}
													onTouchStart={(event) => event.stopPropagation()} 
													onClick={event => {
										              event.stopPropagation();
										              event.preventDefault();
										              
									            }}>
													<ArrowDropUpIcon sx={{ height: '48px', width: '48px' }} />
												</ButtonBase>
											</Grid>
											<Grid item>
												<ButtonBase
													sx={{ p:0 }}
													color="primary" 
													disableElevation
													onMouseDown={event => event.stopPropagation()}
													onTouchStart={(event) => event.stopPropagation()} 
													onClick={event => {
										              event.stopPropagation();
										              event.preventDefault();
										              
									            }}>
													<ArrowDropDownIcon sx={{ height: '48px', width: '48px' }} />
												</ButtonBase>
											</Grid>
										</Grid>
									</Grid>
								</Card>
							))}
							
						</Stack>
					</Container>
					<AdminProductEditDrawer />
				</>
				)}
			</Grid>
		</Grid>
	</>
	)

}
export default AdminProductManager;