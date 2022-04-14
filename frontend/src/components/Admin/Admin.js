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

import AdminLogin from './AdminLogin'
import AdminOrderDashboard from './AdminOrderDashboard'
import AdminProductManager from './AdminProductManager'
import AdminCategoryManager from './AdminCategoryManager'
import AdminOptionManager from './AdminOptionManager'
import AdminTimeManager from './AdminTimeManager'
import AdminDeliveryZoneManager from './AdminDeliveryZoneManager'

import AdminNavMenu from './Forms/AdminNavMenu'



function Admin({ setStep, storeLat, storeLng }) {

	
	const [navDrawer, setNavDrawer] = useState(false);
	const [navSelect, setNavSelect] = useState({
												parent: 1,
												child: 0,
												open: 0,
											})



	const [adminView, setAdminView] = useState('10');

	const [adminToken, setAdminToken] = useState('')
	const [adminUsername, setAdminUsername] = useState('')

	useEffect(() => {

		if(localStorage.getItem('adminAccessToken')) {

			setAdminToken(localStorage.getItem('adminAccessToken'))
			setAdminUsername(localStorage.getItem('adminAccessUsername'))

		}

	}, [])

	

	if(adminToken && adminUsername) {

		//temp holding of current view to go back to it
		const currentView = adminView;

		Axios.post(process.env.REACT_APP_PUBLIC_URL+'/api/admin/auth', {

			accessToken: adminToken,
			accessUsername: adminUsername

		})
		.then((response) => {
			if(response.data.status === 1) {
				setAdminView(currentView)
				return;
			} else {
				return (
				<>	
					<AdminLogin
						adminToken={adminToken}
						setAdminToken={token => setAdminToken(token)}
						adminUsername={adminUsername}
						setAdminUsername={username => setAdminUsername(username)}
					/>
				</>

		)
			}
		})
		.catch((err) => {
	       	console.log("error ", err)});

	} else {
		return (
				<>	
					<AdminLogin
						adminToken={adminToken}
						setAdminToken={token => setAdminToken(token)}
						adminUsername={adminUsername}
						setAdminUsername={username => setAdminUsername(username)}
					/>
				</>

		)
	}


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
		case '22': 
			return (
				<>
					<AdminNavMenu
						navDrawer={navDrawer}
						setNavDrawer={drawer => setNavDrawer(drawer)}
						navSelect={navSelect}
						setNavSelect={select => setNavSelect(select)}
						setAdminView={view => setAdminView(view)}
					 />
					<AdminCategoryManager />
				</>

		)
		case '23': 
			return (
				<>
					<AdminNavMenu
						navDrawer={navDrawer}
						setNavDrawer={drawer => setNavDrawer(drawer)}
						navSelect={navSelect}
						setNavSelect={select => setNavSelect(select)}
						setAdminView={view => setAdminView(view)}
					 />
					<AdminOptionManager />
				</>

		)
		case '24': 
			return (
				<>
					<AdminNavMenu
						navDrawer={navDrawer}
						setNavDrawer={drawer => setNavDrawer(drawer)}
						navSelect={navSelect}
						setNavSelect={select => setNavSelect(select)}
						setAdminView={view => setAdminView(view)}
					 />
					<AdminTimeManager />
				</>

		)
		case '42': 
			return (
				<>
					<AdminNavMenu
						navDrawer={navDrawer}
						setNavDrawer={drawer => setNavDrawer(drawer)}
						navSelect={navSelect}
						setNavSelect={select => setNavSelect(select)}
						setAdminView={view => setAdminView(view)}
					 />
					<AdminDeliveryZoneManager
						storeLat={storeLat}
						storeLng={storeLng}
					 />
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