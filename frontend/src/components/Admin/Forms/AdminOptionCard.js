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

import '../styles/Admin.css';

function AdminOptionCard({ options, option, index, handleOptionEdit, isIncluded }) {

	return (
	<>
		<Card key={option.option_id} component="div" sx={{ p: '12px 32px', minWidth: '100%' }} square>
			<Grid container alignItems="center" spacing={2}>
				<Grid item xs={6}>
					<Typography variant="subtitle1">
						{option.option_name}
					</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="subtitle1">
						{isIncluded ? 'Inclut' : option.option_price.toFixed(2)}
					</Typography>
				</Grid>
				<Grid item>
					<ButtonBase 
						className="btn"
						onClick={() => handleOptionEdit(option.option_id, option.option_name, option.option_price)}
					>
						<EditIcon />
					</ButtonBase>
				</Grid>
			</Grid>
		</Card>
	</>
	)

}
export default AdminOptionCard;