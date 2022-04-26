import React, { useState, useEffect, useRef } from 'react';
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
	Stack,
	SvgIcon
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
import HistoryIcon from '@mui/icons-material/History';

import './styles/Admin.css';

import AdminOrderCard from './Forms/AdminOrderCard';
import AdminOrderHistoryCard from './Forms/AdminOrderHistoryCard';

import { ReactComponent as NewIcon } from './assets/noun-add-order-662273.svg';
import { ReactComponent as ProcessingIcon } from './assets/noun-cooking-376836.svg';
import { ReactComponent as ReadyIcon } from './assets/noun-shopping-bag-3897262.svg';

function AdminOrderDashboard({ adminToken, adminUsername }) {

	const [loading, setLoading] = useState(true)
	const [orders, setOrders] = useState([]);

	//fetch orders
	useEffect(() => {

		//connect to socket host backend and listen for order refresh
		let ioClient = io.connect(process.env.REACT_APP_SOCKET_HOST, { 
			withCredentials: true,
			extraHeaders: {
				'socket-io-cors': 'auth'
			}
		});

		ioClient.on('refresh_orders', (response) => {


			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/today", null, 
			{ headers: {
				'access-token': adminToken,
				'access-username': adminUsername
			}})
			.then((response) => {
				setOrders(response.data)
			})
			.catch((err) => {
	   			console.log("error ", err)});

		})

		//initial order fetch
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/today", null,
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			setOrders(response.data)
			setLoading(false)
		})
		.catch((err) => {
   			console.log("error ", err)});

		return () => {
		   	ioClient.disconnect();
		  }


	}, [])


	//individual order selection
	const [orderSelect, setOrderSelect] = useState(0);

	function handleOrderSelect(sId) {
		if(orderSelect === sId) {
			setOrderSelect(0)
			return
		} else {
			setOrderSelect(sId)
		}
		
	}
	

	//order status view
	const [orderView, setOrderView] = useState('NEW');


	return (
	<>
			<Grid container>
			<Grid item xs={1} style={{ backgroundColor: '#d9d9d994', minHeight: '100vh', maxHeight: '100vh' }}>
				<Paper sx={{ minHeight: '70vh', mt: '16vh', mb: '14vh' }} elevation={8} square>
					<Stack sx={{ minWidth: '100%' }}>

						<ToggleButtonGroup
							orientation="vertical"
							exclusive
							sx={{height:'51vh', color: '#000000'}}
						>
							<ToggleButton sx={{height:'17vh', borderRadius: 0, color: "#000000"}} classes={{ selected: "status-view-selected" }} value="NEW" selected={orderView === "NEW"} onClick={() => setOrderView("NEW")}>
								<SvgIcon component={NewIcon} sx={{ width: '32px', height: '32px' }} inheritViewBox />
							</ToggleButton>
							<ToggleButton sx={{height:'17vh', borderRadius: 0, color: "#000000"}} classes={{ selected: "status-view-selected" }} value="PROCESSING" selected={orderView === "PROCESSING"} onClick={() => setOrderView("PROCESSING")}>
								<SvgIcon component={ProcessingIcon} sx={{ width: '32px', height: '32px', paddingRight: '4px' }} inheritViewBox />
							</ToggleButton>
							<ToggleButton sx={{height:'17vh', borderRadius: 0, color: "#000000"}} classes={{ selected: "status-view-selected" }} value="READY" selected={orderView === "READY"} onClick={() => setOrderView("READY")}>
								<SvgIcon component={ReadyIcon} sx={{ width: '32px', height: '32px' }} inheritViewBox />
							</ToggleButton>
						</ToggleButtonGroup>

						<ToggleButton sx={{ width: '100%', height: 'auto', pt: '30%', pb: '30%', mt: '8vh', borderRadius: 0, color: "#000000", border: 'none' }} classes={{ selected: "status-view-selected" }} value="HISTORY" selected={orderView === "HISTORY"} onClick={() => setOrderView("HISTORY")}>
							<HistoryIcon sx={{ width: '32px', height: '32px' }} />
						</ToggleButton>

					</Stack>
				</Paper>
			</Grid>
				<Grid item xs={11} style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'auto', backgroundColor: '#d9d9d994' }}>
					{loading && (
						<Fade in={loading}>
						<CircularProgress size={64} style={{position: 'relative', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />
						</Fade>
					)}
					{!loading && (
					<Container maxWidth="sm" sx={{ pt: 6 }}>
						{orderView === 'NEW' && (
						<>
							<Typography variant="h4">
								Nouvelles commandes
							</Typography>
							<Divider color="black" sx={{ mt: '8px' }} />
							<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
								{orders.map((order, index) => (
								<>
									{order.order_status === 'NEW' && (
										<AdminOrderCard order={order} index={index} orderSelect={orderSelect} handleOrderSelect={sel => handleOrderSelect(sel)} />
									)}
								</>
								))}
								
							</Stack>

						</>
						)}
						{orderView === 'PROCESSING' && (
						<>
							<Typography variant="h4">
								En préparation
							</Typography>
							<Divider color="black" sx={{ mt: '8px' }} />
							<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
								{orders.map((order, index) => (
								<>
									{order.order_status === 'PROCESSING' && (
										<AdminOrderCard order={order} index={index} orderSelect={orderSelect} handleOrderSelect={sel => handleOrderSelect(sel)} />
									)}
								</>
								))}
							
							</Stack>

						</>
						)}
						{orderView === 'READY' && (
						<>
							<Typography variant="h4">
								Prêtes
							</Typography>
							<Divider color="black" sx={{ mt: '8px' }} />
							<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
								{orders.map((order, index) => (
								<>
									{order.order_status === 'READY' && (
										<AdminOrderCard order={order} index={index} orderSelect={orderSelect} handleOrderSelect={sel => handleOrderSelect(sel)} />
									)}
								</>
								))}
								
							</Stack>

						</>
						)}
						{orderView === 'HISTORY' && (
						<>
							<AdminOrderHistoryCard orders={orders} />

						</>
						)}

					</Container>
				)}
			</Grid>
		</Grid>
	</>
	)


}
export default AdminOrderDashboard;