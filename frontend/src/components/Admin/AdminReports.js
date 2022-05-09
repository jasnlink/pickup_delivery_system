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

function AdminReports({ adminToken, adminUsername }) {

	const [loading, setLoading] = useState(true)
	const [orderTotals, setOrderTotals] = useState([])

	useEffect(() => {

		//initiate order totals from and to dates, default is 2 months range
		const dateFrom = DateTime.now().setZone("America/Toronto").minus({months:2})
		const dateTo = DateTime.now().setZone("America/Toronto")

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
			console.log(response.data)
			setLoading(false)
			
		})
		.catch((err) => {
	       	console.log("error ", err)});

	}, [])

	function LineChart() {

		function plotLine() {

		}

		const SVG_WIDTH = 800;
		const SVG_HEIGHT = 600;

		const x0 = 50;
		const xAxisLength = SVG_WIDTH - x0 * 2;

		const y0 = 50;
		const yAxisLength = SVG_HEIGHT - y0 * 2;

		const xAxisY = y0 + yAxisLength;

		return (
		    <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
		      {/* X axis */}
		      <line
		        x1={x0}
		        y1={xAxisY}
		        x2={x0 + xAxisLength}
		        y2={xAxisY}
		        stroke="black"
		      />
		      <text x={x0 + xAxisLength + 5} y={xAxisY + 4}>
		        x
		      </text>

		      {/* Y axis */}
		      <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="black" />
		      <text x={x0} y={y0 - 8} textAnchor="middle">
		        y
		      </text>
		    </svg>
		  )
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

					<Container maxWidth="md" sx={{ pt: 4}}>

							<Typography variant="h4">
								Rapports finances
							</Typography>

							<Divider color="black" sx={{ mt: '8px', mb: '16px' }} />

							<Stack spacing={2}>
								<Card component="div" sx={{ p: '6px 24px' }} square>
									<Typography variant="h5">
										Ventes totales
									</Typography>
									<LineChart />
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