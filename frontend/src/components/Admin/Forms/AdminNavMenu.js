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

import '../styles/Admin.css';



function AdminNavMenu({ navDrawer, setNavDrawer, navSelect, setNavSelect, setAdminView }) {


	function handleNavSelect(sParentId, sChildId, hasChildren = false) {

		//temp hold selection object
		let temp = {...navSelect}
		
		//check if we selected only the parent and not a child
		//and that we have a matching open id with selection id
		//if the ids match then we're currently selecting a parent that we already opened
		//so we close it 
		if(sChildId === 0 && temp.open === sParentId) {
			temp.open = 0
			temp.parent = 0
			temp.child = 0
		} else {
			temp.open = sParentId;
			temp.parent =  sParentId
			temp.child = sChildId

			//if we selected a child then we close the drawer
			if(sChildId !== 0) {
				setAdminView(`${sParentId}${sChildId}`)
				setNavDrawer(false)
			}
			//if we  selected a parent and they dont have any children then we can also close drawer
			if(sChildId === 0 && hasChildren === false) {
				setAdminView(`${sParentId}${sChildId}`)
				setNavDrawer(false)
			}
		}

		setNavSelect(temp)

	}



	return (
	<>
		{!navDrawer && (

			<ButtonBase sx={{ position: 'absolute', width: '52px', height: '52px', color: '#ffffff', backgroundColor: '#000000', zIndex: '100' }} onClick={() => setNavDrawer(true)}>
				<MenuIcon sx={{ width: '32px', height: '32px' }} />
			</ButtonBase>

		)}
		
		<Drawer classes={{ paper: "nav-drawer", }} anchor="left" open={navDrawer} onClose={() => setNavDrawer(false)}>
			<List disablePadding>
				<ListItemButton 
					selected={navSelect.parent === 1} 
					onClick={() => handleNavSelect(1,0)}
					classes={{ selected: "nav-item-selected" }}
				>
					<ListItem sx={{ pl: 1 }}>
						<ListItemText primary={<Typography variant="h6" style={{ fontWeight: '500' }}>Tableau de commandes</Typography>} />
					</ListItem>
				</ListItemButton>

				<Divider />

				<ListItemButton 
					selected={navSelect.parent === 2} 
					onClick={() => handleNavSelect(2,0,true)}
					classes={{ selected: "nav-item-selected" }}

				>
					<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Menu</Typography>} />
					{navSelect.parent === 2 && navSelect.open === 2 ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>

					<Collapse 
						in={navSelect.parent === 2 && navSelect.open === 2} 
						unmountOnExit
					>
						<List disablePadding>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 2 && navSelect.child === 1}
								onClick={() => handleNavSelect(2,1)}
								classes={{ selected: "nav-item-selected" }}
							>
									<ListItemText primary="Produits" />
							</ListItemButton>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 2 && navSelect.child === 2}
								onClick={() => handleNavSelect(2,2)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Catégories" />
							</ListItemButton>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 2 && navSelect.child === 3}
								onClick={() => handleNavSelect(2,3)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Options de produits" />
							</ListItemButton>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 2 && navSelect.child === 4}
								onClick={() => handleNavSelect(2,4)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Horaires" />
							</ListItemButton>
						</List>
					</Collapse>

				<ListItemButton 
					selected={navSelect.parent === 3} 
					onClick={() => handleNavSelect(3,0)}
					classes={{ selected: "nav-item-selected" }}
				>
					<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Rapports finances</Typography>} />
				</ListItemButton>

				<ListItemButton 
					selected={navSelect.parent === 4} 
					onClick={() => handleNavSelect(4,0,true)}
					classes={{ selected: "nav-item-selected" }}
				>
					<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Emplacement</Typography>} />
					{navSelect.parent === 4 && navSelect.open === 4 ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>

					<Collapse 
						in={navSelect.parent === 4 && navSelect.open === 4} 
						unmountOnExit
					>
						<List disablePadding>
							<ListItemButton  
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 4 && navSelect.child === 1}
								onClick={() => handleNavSelect(4,1)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Adresse" />
							</ListItemButton>
							<ListItemButton  
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 4 && navSelect.child === 2}
								onClick={() => handleNavSelect(4,2)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Zones de livraison" />
							</ListItemButton>
							<ListItemButton  
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 4 && navSelect.child === 3}
								onClick={() => handleNavSelect(4,3)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Heures" />
							</ListItemButton>
						</List>
					</Collapse>

				<ListItemButton 
					selected={navSelect.parent === 5} 
					onClick={() => handleNavSelect(5,0,true)}
					classes={{ selected: "nav-item-selected" }}
				>
					<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Intégrations</Typography>} />
					{navSelect.parent === 5 && navSelect.open === 5 ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>

					<Collapse 
						in={navSelect.parent === 5 && navSelect.open === 5} 
						unmountOnExit
					>
						<List disablePadding>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 5 && navSelect.child === 1}
								onClick={() => handleNavSelect(5,1)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Caisses POS" />
							</ListItemButton>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 5 && navSelect.child === 2}
								onClick={() => handleNavSelect(5,2)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Plateformes" />
							</ListItemButton>
							<ListItemButton 
								sx={{ pl: 4 }} 
								selected={navSelect.parent === 5 && navSelect.child === 3}
								onClick={() => handleNavSelect(5,3)}
								classes={{ selected: "nav-item-selected" }}
							>
								<ListItemText primary="Paiements" />
							</ListItemButton>
						</List>
					</Collapse>

			</List>
		</Drawer>
	</>
	)

}
export default AdminNavMenu;