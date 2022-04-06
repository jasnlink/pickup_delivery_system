import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime, Interval } from "luxon";
import * as Yup from "yup";
import io from 'socket.io-client';
import { Wrapper, Status } from "@googlemaps/react-wrapper";


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
	Slider
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

import AdminRenderMap from './Forms/AdminRenderMap';


function AdminDeliveryZoneManager({ storeLat, storeLng }) {

	const [loading, setLoading] = useState(false)


	console.log(storeLng)

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
					<Container maxWidth="md" sx={{ pt: 10 }}>
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item xs={8}>
								<Typography variant="h4">
									Zones de livraison
								</Typography>
							</Grid>
							<Grid item>
								<Button
									className="product-add-btn"
									disableElevation
								>
									<AddCircleIcon />
								</Button>
							</Grid>
						</Grid>

						<Divider color="black" sx={{ mt: '8px' }} />

						<Wrapper apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
							<AdminRenderMap />
						</Wrapper>

					</Container>
				</>
				)}
			</Grid>
		</Grid>

	</>
	)


}
export default AdminDeliveryZoneManager;