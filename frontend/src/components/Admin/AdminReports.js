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
	Stack,
	Switch,
	FormControlLabel,
	FormGroup
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

import AdminLineChart from './Forms/AdminLineChart'

function AdminReports({ adminToken, adminUsername }) {

	//data loading
	const [loading, setLoading] = useState(true)

	//array of order totals and their date
	const [orderTotals, setOrderTotals] = useState([])

	//sum of all order totals
	const [totalSales, setTotalSales] = useState(0)

	//initialize start and end dates
	//we're going with 60 days in the past
	const [dateFrom, setDateFrom] = useState(DateTime.now().setZone("America/Toronto").minus({days:60}).toFormat('yyyy-MM-dd'))
	const [dateTo, setDateTo] = useState(DateTime.now().setZone("America/Toronto").toFormat('yyyy-MM-dd'))


	useEffect(() => {

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/totals/date", {
			dateFrom: dateFrom,
			dateTo: dateTo
		},
		{ headers: {
			'access-token': adminToken,
			'access-username': adminUsername
		}})
		.then((response) => {
			setOrderTotals(response.data)

			getTotalSales(response.data)
			.then((result) => {

				setTotalSales(result)
				setLoading(false)

			})
			
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}, [])

	//get total sales from data
	async function getTotalSales(data) {

		let result = 0;

		for(let sale of data) {
			result += sale.order_total;
		}

		result = result.toFixed(2)
		return result
	}

	

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

					<Container maxWidth="md" sx={{ pt: 4, pb: 4}}>

							<Typography variant="h4">
								Rapports finances
							</Typography>

							<Divider color="black" sx={{ mt: '8px', mb: '16px' }} />

							<Stack spacing={2}>
								<Card component="div" sx={{ p: '36px 36px' }} square>
									<Typography variant="h4">
										Ventes totales
									</Typography>
									<Typography variant="h4">
										${totalSales}
									</Typography>
									<AdminLineChart data={orderTotals} dateFrom={dateFrom} dateTo={dateTo}/>
								</Card>
							</Stack>

					</Container>

				</>
				)}
			</Grid>
		</Grid>
	</>
	)

}
export default AdminReports;