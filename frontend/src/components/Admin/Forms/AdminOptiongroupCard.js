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

function AdminOptiongroupCard({ optiongroups, optiongroup, index, handleOptiongroupEdit }) {

	

	return (
	<>
		<Card key={optiongroup.optgroup_id} component="div" sx={{ p: '6px 24px' }} square>
			<Grid container alignItems="center" spacing={2}>
				<Grid item>
					<div style={{ height: '96px', width: '48px' }}></div>
				</Grid>
				<Grid item xs={6}>
					<Typography variant="subtitle1">
						{optiongroup.optgroup_name}
					</Typography>
				</Grid>
				<Grid item xs={2}>
				</Grid>
				<Grid item xs={2}>
					<ButtonBase 
						className="btn"
						onClick={() => handleOptiongroupEdit(optiongroup.optgroup_id, optiongroup.optgroup_name, optiongroup.required, optiongroup.max_choices)}>
						<EditIcon />
					</ButtonBase>
				</Grid>
			</Grid>
		</Card>
	</>
	)

}
export default AdminOptiongroupCard;