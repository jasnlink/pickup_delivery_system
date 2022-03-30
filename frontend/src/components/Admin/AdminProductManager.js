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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import './styles/Admin.css';

import AdminProductCard from './Forms/AdminProductCard'

function AdminProductManager() {


	const [productLoading, setProductLoading] = useState(false)
	const [products, setProducts] = useState([])


	const [loading, setLoading] = useState(true)
	const [categories, setCategories] = useState([])
	const [optiongroups, setOptiongroups] = useState([])

	useEffect(() => {

		//fetch categories and product option groups
		const request1 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
		const request2 = (process.env.REACT_APP_PUBLIC_URL+"/api/admin/optiongroups/fetch/all")

		const requestCategories = Axios.post(request1)
		const requestOptiongroups = Axios.post(request2)

		Axios.all([requestCategories, requestOptiongroups])
		.then(Axios.spread((...responses) => {

			setCategories(responses[0].data)
			handleCategorySelect(responses[0].data[0].category_id)
			setOptiongroups(responses[1].data)
			setLoading(false)

		}))
		.catch((err) => {
   			console.log("error ", err)});


	}, [])


	const [categorySelectId, setCategorySelectId] = useState(0)

	function handleCategorySelect(sId) {

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
		})
		.catch((err) => {
   			console.log("error ", err)});

	}

	const [editId, setEditId] = useState(0)
	const [editName, setEditName] = useState('')
	const [editDesc, setEditDesc] = useState('')
	const [editPrice, setEditPrice] = useState(0)
	const [editImg, setEditImg] = useState('')

	const [editImgFile, setEditImgFile] = useState('')
	const [editImgTemp, setEditImgTemp] = useState('')


	const [productEditLoading, setProductEditLoading] = useState(false)
	const [productEditDrawer, setProductEditDrawer] = useState(false)
	const [productEditDrawerMode, setProductEditDrawerMode] = useState(false)

	//currently selected option groups in the product edit form
	const [selectedOptiongroups, setSelectedOptiongroups] = useState([])
	//selected optiongroups from the database kept static used to compare with currently selected ones
	const [editOptiongroups, setEditOptiongroups] = useState([])


	function handleProductAdd() {

		setProductEditDrawerMode(false)
		setProductEditDrawer(true)
		setEditId(0);	
		setEditName('');
		setEditDesc('');
		setEditPrice(0);
		setEditImg('');
		setEditImgFile('');
		setEditImgTemp('');
		setSelectedOptiongroups([])
		setEditOptiongroups([])

	}

	function handleAddSubmit() {


		setProductLoading(true);
		//use new FormData() method to create a submitted form
		const formData = new FormData();


		formData.append('file', editImgFile);
		formData.append('optiongroups', JSON.stringify(selectedOptiongroups));

		formData.append('categorySelectId', categorySelectId)
		formData.append('editName', editName);
		formData.append('editDesc', editDesc);
		formData.append('editPrice', editPrice);

		

		console.log(selectedOptiongroups)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/products/insert", formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then((response) => {
			handleEditClose();
			setProducts(response.data);
			setProductLoading(false);
		})

	}


	async function handleProductEdit(sId, sName, sDesc, sPrice, sImg) {

		try {
				setProductEditDrawerMode(true)
				setProductEditLoading(true)
				setProductEditDrawer(true)
				setEditId(sId);	
				setEditName(sName);
				setEditDesc(sDesc);
				setEditPrice(sPrice);
				setEditImg(sImg);

				await getSelectedOptiongroups(sId);

			} finally {

				setProductEditLoading(false)

			}
	}

	function handleEditClose() {

		setProductEditDrawerMode(false)
		setProductEditDrawer(false)
		setEditId(0);	
		setEditName('');
		setEditDesc('');
		setEditPrice(0);
		setEditImg('');
		setEditImgFile('');
		setEditImgTemp('');
		setSelectedOptiongroups([])
		setEditOptiongroups([])


	}

	function handleEditSubmit() {

		setProductLoading(true);
		//use new FormData() method to create a submitted form
		const formData = new FormData();

		//add uploaded image and other form fields to the data
		//check if we uploaded an image
		if(editImgFile) {
			formData.append('file', editImgFile);
		}

		//shallow compare to see if we changed selected optiongroups
		//only if they aren't the same then we add to form data to be sent over
		if(JSON.stringify(selectedOptiongroups) !== JSON.stringify(editOptiongroups)) {

			formData.append('optiongroups', JSON.stringify(selectedOptiongroups));

		}
		

		formData.append('categorySelectId', categorySelectId)
		formData.append('editId', editId);
		formData.append('editName', editName);
		formData.append('editDesc', editDesc);
		formData.append('editPrice', editPrice);

		

		console.log(selectedOptiongroups)

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/products/update", formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then((response) => {
			handleEditClose();
			setProducts(response.data);
			setProductLoading(false);
		})

	}

	function handleProductImgUpload(e) {

		if(editImg) {
			setEditImg('');
		}

		//get image to upload
		setEditImgFile(e.target.files[0]);
		//create temp url to preview image
		setEditImgTemp(URL.createObjectURL(e.target.files[0]));
	}



	//helper function to generate an array of a specific property of an object
	async function getIdArray(data, id_field) {
		let result = []
		for(let d of data) {
			result.push(d[id_field])
		}
		return result;
	}


	
	//helper function to fetch product option groups given a product id
	//then build array of option groups and assign selected flag to it
	//for each result we get back
	async function getSelectedOptiongroups(id) {
		//get option groups
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/product/list/optiongroups", {
			id: id,
		})
		.then((response) => {

			if(response.data.length) {
				let tempGroups = []
				for(let group of response.data) {
					tempGroups.push(group.optgroup_id)
				}
				//currently selected
				setSelectedOptiongroups(tempGroups);
				//static version used to compare
				setEditOptiongroups(tempGroups)
			} else {
				return;
			}
			
			

		})
		.catch((err) => {
	       	console.log("error ", err)});
	}

	function handleSelectOptgroups(value) {
		//turn string into int
		value = parseInt(value);
		//get temp array of current selected
		let tempGroups = [...selectedOptiongroups]
		//try to find the selected element to see if its already been selected
		let found = tempGroups.find((el) => el === value)

		//not found so not selected before, so we add it as a selection
		if(!found) {
			tempGroups.push(value)
			setSelectedOptiongroups(tempGroups)
		} else {
		//found so already selected, so we unselect it now, we filter out the value
			tempGroups = tempGroups.filter((el) => el !== value)
			setSelectedOptiongroups(tempGroups)
		}

		
	}

	//product edit input validation
	const [editProductValid, setEditProductValid] = useState(false)
	const productSchema = Yup.object().shape({

		title: Yup.string().required(),
		description: Yup.string().required(),
		price: Yup.string().matches(/^\d+(\.(\d{1,2}))?$/).required(),
	})

	useEffect(() => {

		productSchema.validate({
			title: editName,
			description: editDesc,
			price: editPrice,
		})
		.then((response) => {
			setEditProductValid(true)
		})
		.catch((err) => {
			setEditProductValid(false)
		})

	}, [editName, editDesc, editPrice])


	//move product up one index
	//sId: product id
	//ordId: product order index
	//mapId: current place in the products array, or the current spot it is being displayed
	function handleMove(sId, orderId, mapId, direction) {
		//if first item in list then return
		if((mapId === 0 && direction === 'up') || (mapId+1 === products.length && direction === 'down')) {
			return;
		}

		var nextRowId;
		var nextRowOrderId;

		if(direction === 'up')	{
			nextRowId = products[mapId-1].product_id;
			nextRowOrderId = products[mapId-1].order_index;
		}
		if(direction === 'down') {
			nextRowId = products[mapId+1].product_id;
			nextRowOrderId = products[mapId+1].order_index;
		}
		

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/products/move", {
			categorySelectId: categorySelectId,
			sId: sId,
			orderId: orderId,
			nextRowId: nextRowId,
			nextRowOrderId: nextRowOrderId,
		})
		.then((response) => {
			setProducts(response.data)
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}



	return (
	<>		


		<Grid container>
			<Grid item xs={2}>
				<Paper sx={{ minHeight: '100vh' }} elevation={8} square>
					<List sx={{ pt: '8vh' }}>
						<ListItem>
							<ListItemText primary={<Typography variant="h6" style={{ fontWeight: '500' }}>Catégories</Typography>} />
						</ListItem>
						{loading && (
							<Fade in={loading}>
								<CircularProgress size={32} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-16px', marginLeft: '-16px'}} color="inherit" />
							</Fade>
						)}
						{!loading && (
						<>
							{categories.map((category, index) => (

								<ListItemButton key={category.category_id} selected={categorySelectId === category.category_id} onClick={() => handleCategorySelect(category.category_id)}>
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
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item xs={8}>
								<Typography variant="h4">
									Produits
								</Typography>
							</Grid>
							<Grid item>
								<Button
									className="product-add-btn"
									disableElevation
									onClick={handleProductAdd}
								>
									<AddCircleIcon />
								</Button>
							</Grid>
						</Grid>
						
						<Divider color="black" sx={{ mt: '8px' }} />
						<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
							{products.map((product, index) => (

								<AdminProductCard 
									products={products}
									product={product} 
									index={index}
									handleProductEdit={(sId, sName, sDesc, sPrice, sImg) => handleProductEdit(sId, sName, sDesc, sPrice, sImg)} 
									handleMove={(sId, orderId, mapId, direction) => handleMove(sId, orderId, mapId, direction)}
								/>

							))}
							
						</Stack>
					</Container>

					<Drawer classes={{ paper: "product-edit-drawer", }} open={productEditDrawer} onClose={handleEditClose} anchor="bottom">
						<ButtonBase className="product-edit-close-btn" size="medium" onClick={handleEditClose}>
							<CloseIcon  />
						</ButtonBase>
						{productEditLoading && (
							<Fade in={productEditLoading}>
								<CircularProgress size={64} style={{position: 'absolute', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px', color: 'black'}} />
							</Fade>
						)}
						{!productEditLoading && (
						<>
							<Container sx={{ pt: '100px' }}>
								<List>
									<ListItem>
										<Grid container justifyContent="space-between" alignItems="center">
											<Grid item xs={10}>
												<Typography variant="h5">
													Nom du produit
												</Typography>
											</Grid>
										{productEditDrawerMode && (
										<>

											<Grid item>
												<Button
													className="product-delete-btn"
													disableElevation
												>
													<DeleteForeverIcon sx={{ height: '28px', width: '28px' }} />
												</Button>
											</Grid>

										</>
										)}
											
										</Grid>
									</ListItem>
									<ListItem>
										<TextField
											variant="outlined"
											value={editName}
											onChange={e => setEditName(e.target.value)}
											fullWidth
											InputProps={{
												className: 'text-input'
											}}

										 />
									</ListItem>

									<ListItem>
										<Typography variant="h5">
											Description
										</Typography>
									</ListItem>
									<ListItem>
										<TextField
											variant="outlined"
											value={editDesc}
											onChange={e => setEditDesc(e.target.value)}
											fullWidth
											multiline
											minRows="9"
											maxRows="9"
											InputProps={{
												className: 'text-input'
											}}

										 />
									</ListItem>

									<ListItem>
										<Typography variant="h5">
											Prix
										</Typography>
									</ListItem>
									<ListItem>
										<TextField
											variant="outlined"
											value={editPrice}
											onChange={e => setEditPrice(e.target.value)}
											fullWidth
											inputProps={{
												type: 'number'
											}}
											InputProps={{
												className: 'text-input',
												
											}}

										 />
									</ListItem>

									<ListItem sx={{ pb: '12px' }}>
										<input
									        accept="image/jpeg, image/png"
									        type="file"
									        id="product-edit-img-upload"
									        onChange={(e) => handleProductImgUpload(e)}
									        hidden
									    />
									    <label htmlFor="product-edit-img-upload">
										    <Button
												className="product-edit-upload-btn"
												component="span"
												disableElevation
											>
												<AddPhotoAlternateIcon sx={{ height: '28px', width: '28px' }} />
											</Button>
										</label>
										{!productEditDrawerMode && !editImg && !editImgTemp ? <div style={{ height: '256px', width: '256px' }}></div> : ''}
										<img src={editImg} className="product-edit-upload-img" hidden={!editImg}/>
										<img src={editImgTemp} className="product-edit-upload-img" hidden={!editImgTemp}/>
									</ListItem>

									<ListItem>
										<Typography variant="h5">
											Groupes d'options
										</Typography>
									</ListItem>
									<ListItem>
										<ToggleButtonGroup
											value={selectedOptiongroups}
											onChange={(e) => {handleSelectOptgroups(e.target.value)}}

										>
											{optiongroups.map((group, index) => (

												<ToggleButton sx={{ borderRadius: 0 }} value={group.optgroup_id}>
													{group.optgroup_name}
												</ToggleButton>

											))}
										</ToggleButtonGroup>
									</ListItem>

									<ListItem sx={{ pt: '24px' }}>
										<Button
											disabled={!editProductValid}
											fullWidth
											className="btn"
											disableElevation
											onClick={productEditDrawerMode ? handleEditSubmit : handleAddSubmit}
										>
											Sauvegarder
										</Button>
									</ListItem>

								</List>
							</Container>
						</>
						)}
					</Drawer>
				</>
				)}
			</Grid>
		</Grid>
	</>
	)

}
export default AdminProductManager;