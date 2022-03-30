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

function AdminProductCard({ products, product, index, handleProductEdit, handleMove }) {


	return (
	<>
		<Card key={product.product_id} component="div" sx={{ p: '6px 24px' }} square>
			<Grid container alignItems="center" spacing={2}>
				<Grid item>
					<Grid item>
						<ButtonBase 
							color="primary"
							onClick={(sId, orderId, mapId, direction) => handleMove(product.product_id, product.order_index, index, 'up')}
							className="product-move-btn"
							disabled={index === 0}
						>
							<ArrowDropUpIcon sx={{ height: '48px', width: '48px' }} />
						</ButtonBase>
					</Grid>
					<Grid item>
						<ButtonBase
							color="primary" 
							onClick={(sId, orderId, mapId, direction) => handleMove(product.product_id, product.order_index, index, 'down')}
							className="product-move-btn"
							disabled={index+1 === products.length}
						>
							<ArrowDropDownIcon sx={{ height: '48px', width: '48px' }} />
						</ButtonBase>
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Typography variant="subtitle1">
						{product.product_name}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="subtitle1">
						{product.product_price.toFixed(2)}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<ButtonBase 
						className="btn"
						onClick={() => handleProductEdit(product.product_id, product.product_name, product.product_desc, product.product_price, product.product_image)}>
						<EditIcon />
					</ButtonBase>
				</Grid>
			</Grid>
		</Card>
	</>
	)

}
export default AdminProductCard;