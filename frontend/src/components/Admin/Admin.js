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

import { ReactComponent as NewIcon } from './assets/noun-add-order-662273.svg';
import { ReactComponent as ProcessingIcon } from './assets/noun-cooking-376836.svg';
import { ReactComponent as ReadyIcon } from './assets/noun-shopping-bag-3897262.svg';


import AdminOrderDashboard from './AdminOrderDashboard'
import AdminProductManager from './AdminProductManager'

import AdminNavMenu from './Forms/AdminNavMenu'



function Admin({ setStep }) {

	
	const [navDrawer, setNavDrawer] = useState(false);
	const [navSelect, setNavSelect] = useState({
												parent: 1,
												child: 0,
												open: 0,
											})



	const [adminView, setAdminView] = useState('10');
	switch(adminView) {


		case '10':
			return (
				<>	
				<AdminNavMenu
					navDrawer={navDrawer}
					setNavDrawer={drawer => setNavDrawer(drawer)}
					navSelect={navSelect}
					setNavSelect={select => setNavSelect(select)}
					setAdminView={view => setAdminView(view)}
				 />
					<AdminOrderDashboard />
				</>

		)
		case '21': 
			return (
				<>
				<AdminNavMenu
					navDrawer={navDrawer}
					setNavDrawer={drawer => setNavDrawer(drawer)}
					navSelect={navSelect}
					setNavSelect={select => setNavSelect(select)}
					setAdminView={view => setAdminView(view)}
				 />
					<AdminProductManager />
				</>

		)
		default:
			return (
				<>	
				<AdminNavMenu
					navDrawer={navDrawer}
					setNavDrawer={drawer => setNavDrawer(drawer)}
					navSelect={navSelect}
					setNavSelect={select => setNavSelect(select)}
					setAdminView={view => setAdminView(view)}
				 />
					<AdminOrderDashboard />
				</>

		)



	}

}

export default Admin;