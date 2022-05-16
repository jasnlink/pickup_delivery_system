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
import AdminReports from './AdminReports'

import AdminNavMenu from './Forms/AdminNavMenu'



function Admin({ setStep, storeLat, storeLng }) {

	
	//navigation drawer bool
	const [navDrawer, setNavDrawer] = useState(false);

	//navigation selection
	const [navSelect, setNavSelect] = useState({
												parent: 1,
												child: 0,
												open: 0,
											})


	//current view to display
	const [adminView, setAdminView] = useState('10');

	//admin username and admin JWT token
	const [adminToken, setAdminToken] = useState('')
	const [adminUsername, setAdminUsername] = useState('')

	useEffect(() => {

		//access local storage to get admin token and admin username if they exist
		if(localStorage.getItem('adminAccessToken')) {

			setAdminToken(localStorage.getItem('adminAccessToken'))
			setAdminUsername(localStorage.getItem('adminAccessUsername'))

		}


	}, [])

	
	function doLogin(view) {

		const currentView = view

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
	useEffect(() => {

		//check if admin token and admin username exist
		if(adminToken && adminUsername) {

			Axios.post(process.env.REACT_APP_PUBLIC_URL+'/api/admin/auth', null,
			{ headers: {
				'access-token': adminToken,
				'access-username': adminUsername
			}})
			.then((response) => {
				if(response.data.status === 1) {
					setAdminView('10')
					return;
				} else {
					setAdminView('1')
				}
			})
			.catch((err) => {
		       	console.log("error ", err)});

		} else {
		//if they don't exist, send to login
			setAdminView('1')
		}

	}, [adminToken, adminUsername])
	


	switch(adminView) {


		case '1':
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
					<AdminOrderDashboard
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
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
					<AdminProductManager
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
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
					<AdminCategoryManager 
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
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
					<AdminOptionManager
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
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
					<AdminTimeManager
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
				</>

		)
		case '30': 
			return (
				<>
					<AdminNavMenu
						navDrawer={navDrawer}
						setNavDrawer={drawer => setNavDrawer(drawer)}
						navSelect={navSelect}
						setNavSelect={select => setNavSelect(select)}
						setAdminView={view => setAdminView(view)}
					 />
					<AdminReports
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
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
						adminToken={adminToken} 
						adminUsername={adminUsername}
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
					<AdminOrderDashboard
						adminToken={adminToken} 
						adminUsername={adminUsername}
					 />
				</>

		)



	}

}

export default Admin;