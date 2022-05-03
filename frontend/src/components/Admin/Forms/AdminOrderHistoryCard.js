import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import { DayPicker, DateFormatter, registerLocale } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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
	FormGroup,
	Radio,
	RadioGroup,
	FormControlLabel,
	Menu,
	MenuItem
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
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import '../styles/Admin.css';

import AdminOrderDisplay from './AdminOrderDisplay'

function AdminOrderHistoryCard({ adminToken, adminUsername }) {

	const [loading, setLoading] = useState(true)
	const [orders, setOrders] = useState([])

	//order pagination
	const [pageOffset, setPageOffset] = useState(0)

	useEffect(() => {

		//initial order fetch
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/part", {
			offset: pageOffset
		},
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


	function handlePaginate(direction) {

		setLoading(true)

		let currentOffset = pageOffset
		currentOffset += direction

		console.log('currentOffset',currentOffset)

		//if we selected a date
		if(selectDate) {

			let date = DateTime.fromJSDate(selectDate).toFormat('yyyy-MM-dd')

			//fetch orders on selected date
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/date", {
				offset: currentOffset,
				date: date
			},
			{ headers: {
				'access-token': adminToken,
				'access-username': adminUsername
			}})
			.then((response) => {
				setPageOffset(currentOffset)
				setOrders(response.data)
				setLoading(false)
			})
			.catch((err) => {
					console.log("error ", err)});

		//we did not select a date
		} else {
			//fetch default orders list
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/part", {
				offset: currentOffset
			},
			{ headers: {
				'access-token': adminToken,
				'access-username': adminUsername
			}})
			.then((response) => {
				setPageOffset(currentOffset)
				setOrders(response.data)
				setLoading(false)
			})
			.catch((err) => {
					console.log("error ", err)});

		}
		

	}

	//date picker state
	const [startDate, setStartDate] = useState(new Date());

	//calendar menu anchor
	const [calendarAnchor, setCalendarAnchor] = useState();
	//calendar open/closed
	const [calendarOpen, setCalendarOpen] = useState(false)
	//selected date
	const [selectDate, setSelectDate] = useState()
	//date to be displayed
	const [displayDate, setDisplayDate] = useState()


	//track change in selected date
	useEffect(() => {

		setLoading(true)
		
		//if date has been selected,
		if(selectDate) {

			let date = DateTime.fromJSDate(selectDate).toFormat('yyyy-MM-dd')

			//fetch orders on selected date
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/date", {
				offset: pageOffset,
				date: date
			},
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

		} else {

			//if no date selected
			//fetch default orders list
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/list/part", {
				offset: pageOffset
			},
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

		}
		


	}, [selectDate])


	//opening and closing calendar popup
	function handleCalendarOpen(e) {
		setCalendarAnchor(e.currentTarget);
		setCalendarOpen(true)
	}
	function handleCalendarClose() {
		setCalendarOpen(false)
		setCalendarAnchor(null);
	}

	//handling date selection
	function handleDateSelect(date: Date) {
		if(date) {
			setSelectDate(date)
			setDisplayDate(DateTime.fromJSDate(date).toFormat('DD', { locale: "fr" }))
			setCalendarOpen(false)
			setCalendarAnchor(null);
			setPageOffset(0)
		}

	}

	//handle date remove
	function handleDateClear() {
		setSelectDate(null)
		setDisplayDate(null)
		setCalendarOpen(false)
		setCalendarAnchor(null);
		setPageOffset(0)
	}

	//format header month and year
    const formatCaption: DateFormatter = (month, options) => { 
    	return (
    		<span>{DateTime.fromJSDate(month).toFormat('MMMM yyyy', { locale: "fr" })}</span>
    	)
    }

    //format week day display on calendar
    const formatWeekdayName: DateFormatter = (weekday, options) => { 
    	return (
    		<span>{(DateTime.fromJSDate(weekday).toFormat('EEE', { locale: "fr" })).substring(0,3)}</span>
    	)
    }

	return (
	<>
		<Paper square>
			<List disablePadding>
				<ListItem style={{ padding: '24px 38px' }}>
					<Grid container alignItems="center" justifyContent="space-between" spacing={0}>
						<Grid item>
							<Typography variant="h5" onClick={() => console.log(selectDate)}>
								Historique de commandes
							</Typography>
						</Grid>
						<Grid item>
							<Grid container>
								<Grid item>
									<ButtonBase 
										className="btn"
										onClick={(e) => handleCalendarOpen(e)}
									>
										<CalendarMonthIcon />
									</ButtonBase>
									<Menu 
										open={calendarOpen}
										anchorEl={calendarAnchor}
										onClose={handleCalendarClose}
									>
										<DayPicker
											selected={selectDate}
											onSelect={handleDateSelect}
											defaultMonth={selectDate}
											formatters={{ formatCaption, formatWeekdayName }}
											mode="single"
										 />
									</Menu>
								</Grid>
								<Grid item>
								{!!selectDate && (
								<>
									<Chip
										label={
											<>
											<Grid container alignItems="center" justifyContent="space-between" spacing={2}>
												<Grid item>
													<Typography variant="h4" sx={{ fontWeight: '200' }}>
														{displayDate}
													</Typography>
												</Grid>
												<Grid item>
													<IconButton 
														className="clear-date-btn" 
														size="medium"
														onClick={handleDateClear}
													>
														<CloseIcon sx={{ height: '36px', width: '36px' }}  />
													</IconButton>
													
												</Grid>
											</Grid>
											</>
										}
										className="order-history-date"
									/>
								</>
								)}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</ListItem>
				<Divider />
				<Stack spacing={0}>
					{loading && (
						<CircularProgress size={48} style={{position: 'relative', left:'50%', marginTop: '-24px', marginLeft: '-24px', paddingTop: '64px', paddingBottom: '64px'}} color="inherit" />
					)}
					{!loading && (
					<>
						{orders.map((order, index) => (
						<>
									<Card key={index} elevation={0} square>
										<CardActionArea component="div" style={{ padding: '18px 48px' }} onClick={() => handleOrderSelect(order.order_id)} sx={{ p: '12px' }}>
											<Grid container alignItems="center" justifyContent="space-between">
												<Grid direction="column" container item xs={3}>
													<Grid item>
														<Typography variant="h6">Complétée</Typography>
													</Grid>
													<Grid item>
														<Typography variant="body1">
															{DateTime.fromISO(order.created_on).toFormat('MMM d HH:mm')}
														</Typography>
													</Grid>
												</Grid>
												<Grid item xs={3}>
													<Typography variant="h6">
														#{order.order_id}
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<Typography variant="h6">
														{order.user_first_name} {order.user_last_name.charAt(0)+'.'}
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<Typography variant="h6">
														${order.order_total}
													</Typography>
												</Grid>
											</Grid>
										</CardActionArea>
										<Collapse in={orderSelect === order.order_id} unmountOnExit>
											<div style={{ padding: '42px 24px' }}>
												<AdminOrderDisplay
													order={order}
													adminToken={adminToken}
													adminUsername={adminUsername}
												 />
											</div>
										</Collapse>
									</Card>
									<Divider />
						</>
						))}
					</>
					)}
		
				</Stack>
				<ListItem style={{ padding: '24px 38px' }}>
					<Grid container alignItems="center" sx={{ minWidth: '100%', display:'flex', justifyContent:'center' }} spacing={4}>
						<Grid item>
							<ButtonBase
								onClick={() => handlePaginate(-1)}
								disabled={((pageOffset === 0) || (loading))}
								className="product-move-btn"
							>
								<ArrowLeftIcon sx={{ height: '48px', width: '48px' }} />
							</ButtonBase>
						</Grid>
						<Grid item>
							<Typography>
								<Chip
									label={<Typography variant="h6">{pageOffset+1}</Typography>}
									className="page-chip"
								 />
							</Typography>
						</Grid>
						<Grid item>
							<ButtonBase
								onClick={() => handlePaginate(1)}
								className="product-move-btn"
								disabled={((orders.length < 10) || (loading))}
							>
								<ArrowRightIcon sx={{ height: '48px', width: '48px' }} />
							</ButtonBase>
						</Grid>
					</Grid>
				</ListItem>
			</List>
		</Paper>
			

	</>
	)

}
export default AdminOrderHistoryCard;