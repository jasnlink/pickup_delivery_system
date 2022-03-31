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

import AdminCategoryCard from './Forms/AdminCategoryCard'



function AdminCategoryManager() {

	const [loading, setLoading] = useState(true)
	const [categories, setCategories] = useState([])


	useEffect(() => {


		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/fetch/all")
			.then((response) => {

				setCategories(response.data)
				setLoading(false)

			})
			.catch((err) => {
	   			console.log("error ", err)});

	}, [])



	const [editId, setEditId] = useState(0)
	const [editName, setEditName] = useState('')

	const [editDrawer, setEditDrawer] = useState(false)
	const [editDrawerMode, setEditDrawerMode] = useState(false)

	function handleCategoryAdd() {

		setEditDrawerMode(false)
		setEditDrawer(true)
		setEditName('');

	}

	function handleAddSubmit() {

		setLoading(true);
	
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/insert", {
			editName: editName,
		})
		.then((response) => {
			handleEditClose();
			setCategories(response.data);
			setLoading(false);
		})

	}


	function handleCategoryEdit(sId, sName) {

		setEditDrawerMode(true)
		setEditDrawer(true)
		setEditId(sId);	
		setEditName(sName);


	}

	function handleEditClose() {

		setEditDrawerMode(false)
		setEditDrawer(false)
		setEditId(0);	
		setEditName('');

	}

	function handleEditDelete() {

		setLoading(true);

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/delete", {
			editId: editId,
		})
		.then((response) => {
			handleEditClose();
			setCategories(response.data);
			setLoading(false);
		})

	}



	function handleEditSubmit() {

		setLoading(true);

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/update", {
			editId: editId,
			editName: editName,
		})
		.then((response) => {
			handleEditClose();
			setCategories(response.data);
			setLoading(false);
		})

	}




	//move category up or down one index
	//sId: category id
	//ordId: category order index
	//mapId: current place in the categories array, or the current spot it is being displayed
	function handleMove(sId, orderId, mapId, direction) {
		//if first item in list then return
		if((mapId === 0 && direction === 'up') || (mapId+1 === categories.length && direction === 'down')) {
			return;
		}

		var nextRowId;
		var nextRowOrderId;

		if(direction === 'up')	{
			nextRowId = categories[mapId-1].category_id;
			nextRowOrderId = categories[mapId-1].order_index;
		}
		if(direction === 'down') {
			nextRowId = categories[mapId+1].category_id;
			nextRowOrderId = categories[mapId+1].order_index;
		}
		

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/categories/move", {
			sId: sId,
			orderId: orderId,
			nextRowId: nextRowId,
			nextRowOrderId: nextRowOrderId,
		})
		.then((response) => {
			setCategories(response.data)
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}


	//product edit input validation
	const [editCategoryValid, setEditCategoryValid] = useState(false)
	const categorySchema = Yup.object().shape({

		title: Yup.string().required(),
	})

	useEffect(() => {

		categorySchema.validate({
			title: editName,
		})
		.then((response) => {
			setEditCategoryValid(true)
		})
		.catch((err) => {
			setEditCategoryValid(false)
		})

	}, [editName])



	return (

		<>		
			<Grid container>

				<Grid item xs={12} style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'auto', backgroundColor: '#d9d9d994' }}>
					{loading && (
						<Fade in={loading}>
							<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
						</Fade>
					)}
					{!loading && (
					<>
						<Container maxWidth="sm" sx={{ pt: 6 }}>
							<Grid container justifyContent="space-between" alignItems="center">
								<Grid item xs={8}>
									<Typography variant="h4">
										Catégories
									</Typography>
								</Grid>
								<Grid item>
									<Button
										className="product-add-btn"
										disableElevation
										onClick={handleCategoryAdd}
									>
										<AddCircleIcon />
									</Button>
								</Grid>
							</Grid>
							
							<Divider color="black" sx={{ mt: '8px' }} />
							<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
								{categories.map((category, index) => (

									<AdminCategoryCard 
										categories={categories}
										category={category} 
										index={index}
										handleCategoryEdit={(sId, sName) => handleCategoryEdit(sId, sName)} 
										handleMove={(sId, orderId, mapId, direction) => handleMove(sId, orderId, mapId, direction)}
									/>

								))}
								
							</Stack>
						</Container>

						<Drawer classes={{ paper: "category-edit-drawer", }} open={editDrawer} onClose={handleEditClose} anchor="bottom">
							<ButtonBase className="product-edit-close-btn" size="medium" onClick={handleEditClose}>
								<CloseIcon  />
							</ButtonBase>

								<Container sx={{ pt: '100px' }}>
									<List>
										<ListItem>
											<Grid container justifyContent="space-between" alignItems="center">
												<Grid item xs={10}>
													<Typography variant="h5">
														Nom de la catégorie
													</Typography>
												</Grid>
											{editDrawerMode && (
											<>

												<Grid item>
													<Button
														className="product-delete-btn"
														disableElevation
														onClick={handleEditDelete}
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

										<ListItem sx={{ pt: '24px' }}>
											<Button
												disabled={!editCategoryValid}
												fullWidth
												className="btn"
												disableElevation
												onClick={editDrawerMode ? handleEditSubmit : handleAddSubmit}
											>
												Sauvegarder
											</Button>
										</ListItem>

										</List>
								</Container>
						</Drawer>
					</>
					)}
			</Grid>
		</Grid>
	</>

	)

}
export default AdminCategoryManager;