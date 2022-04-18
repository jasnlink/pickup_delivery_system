import React, { useState, useEffect } from 'react';
import Axios from 'axios';


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

import '../styles/Admin.css';

import AdminOrderCard from './AdminOrderCard'

function AdminOrderHistoryCard({ orders }) {


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


	return (
	<>

		<Paper square>
			<List>
				<ListItem style={{display: 'flex', justifyContent: 'center'}}>
					<Typography variant="h6" style={{display:'flex', justifyContent:'center'}}>
						Historique de commandes
					</Typography>
				</ListItem>
				<Stack spacing={0}>

					{orders.map((order, index) => (
					<>
							<ListItem disablePadding>
								<AdminOrderCard order={order} index={index} orderSelect={orderSelect} handleOrderSelect={sel => handleOrderSelect(sel)} />
							</ListItem>
					</>
					))}
		
				</Stack>
			</List>
		</Paper>
			

	</>
	)

}
export default AdminOrderHistoryCard;