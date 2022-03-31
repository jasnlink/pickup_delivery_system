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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactsIcon from '@mui/icons-material/Contacts';

import AdminOrderDisplay from './AdminOrderDisplay'

import '../styles/Admin.css';

function AdminOrderCard({ order, index, orderSelect, handleOrderSelect }) {


	

	function handleOrderStatus(status, orderId) {


		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/status/next", {
			status: status,
			orderId: orderId
		})
		.then((response) => {
			return;
		})
		.catch((err) => {
   			console.log("error ", err)});

	}


	return (
	<>
		<Card key={index} square>
			<CardActionArea component="div" onClick={() => handleOrderSelect(order.order_id)} sx={{ p: '12px' }}>
				<Grid container alignItems="center">
					<Grid direction="column" container item xs={3}>
						<Grid item>
							<Typography variant="h6">IN</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1">
								#{order.order_id}
							</Typography>
						</Grid>
					</Grid>
					<Grid direction="column" container item xs={3}>
						<Grid item>
							<Typography variant="h6">
								{order.order_type === 'DELIVERY' ? 'Livraison' : 'Emporter'}
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1">
								{order.user_first_name} {order.user_last_name.charAt(0)+'.'}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={3}>
						<Typography variant="h6">
							Pour {DateTime.fromISO(order.order_delivery_time).toFormat('HH:mm')}
						</Typography>
					</Grid>
					<Grid item xs={3}>
					{order.order_status === 'NEW' && (

						<Button size="large"  
								fullWidth
								variant="contained" 
								className="btn"
								disableElevation
								onMouseDown={event => event.stopPropagation()}
								onTouchStart={(event) => event.stopPropagation()} 
								onClick={event => {
					              event.stopPropagation();
					              event.preventDefault();
					              handleOrderStatus(order.order_status, order.order_id);
					            }}>
					            Accepter
						</Button>

					)}
					{order.order_status === 'PROCESSING' && (

						<Button size="large"  
								fullWidth
								variant="contained" 
								className="btn"
								disableElevation
								onMouseDown={event => event.stopPropagation()}
								onTouchStart={(event) => event.stopPropagation()} 
								onClick={event => {
					              event.stopPropagation();
					              event.preventDefault();
					              handleOrderStatus(order.order_status, order.order_id);
					            }}>
					            Prêt
						</Button>
						
					)}
					{order.order_status === 'READY' && (

						<Button size="large"  
								fullWidth
								variant="contained" 
								className="btn"
								disableElevation
								onMouseDown={event => event.stopPropagation()}
								onTouchStart={(event) => event.stopPropagation()} 
								onClick={event => {
					              event.stopPropagation();
					              event.preventDefault();
					              handleOrderStatus(order.order_status, order.order_id);
					            }}>
					            Compléter
						</Button>
						
					)}
					{order.order_status === 'COMPLETED' && (

						<Chip variant="filled" size="medium" color="success" label="COMPLET" />
						
					)}
						
					</Grid>
				</Grid>
			</CardActionArea>
			<Collapse in={orderSelect === order.order_id} unmountOnExit>
				<AdminOrderDisplay order={order} />
			</Collapse>
		</Card>
	</>
	)
}
export default AdminOrderCard;