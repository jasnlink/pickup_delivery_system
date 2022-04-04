import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime, Interval } from "luxon";
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

import '../styles/Admin.css';

function AdminToggleCard({ item, idParam, nameParam, selectItems, index, handleSelect }) {

	const [selected, setSelected] = useState(false)

	useEffect(() => {

		let found = selectItems.find(el => el === item[idParam])
		if(found) {
			setSelected(true)
		} else {
			setSelected(false)
		}

	}, [selectItems])

	return (
	<>

		<Grid item key={index}>
			<ToggleButton
				className="timegroup-categories"
				classes={{ selected: "nav-item-selected" }}
				value={item[idParam]}
				onClick={(e) => handleSelect(item[idParam])}
				selected={selected}
					
			>
				{item[nameParam]}
			</ToggleButton>
		</Grid>

	</>
	)

}
export default AdminToggleCard;