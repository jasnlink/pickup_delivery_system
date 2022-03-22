import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { DateTime } from "luxon";
import * as Yup from "yup";

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
	ButtonBase
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';


function TipInputForm({ cartSubtotal, cartTip, setCartTip, cartTotal, setCartTotal }) {


	//tip select value
	let [selectTipValue, setSelectTipValue] = useState("15");
	//tip input visible
	let [inputTip, setInputTip] = useState(false);
	//tip input value
	let [inputTipValue, setInputTipValue] = useState("");


	useEffect(()=> {
		if(selectTipValue !== "other") {

			let tempCartTip = (cartSubtotal*1)*(selectTipValue/100);
			tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
			setCartTip((tempCartTip).toFixed(2));

		} else if(selectTipValue === "other" && inputTipValue !== "") {
			let tempCartTip = Number.parseFloat(inputTipValue);
			tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
			setCartTip((tempCartTip).toFixed(2));
		}
	}, [selectTipValue, cartSubtotal]);


	function handleSelectTip(e) {
		if(e.target.value === "other") {
			setInputTip(true)
		} else {
			setInputTip(false)
			setInputTipValue("")
		}
		setSelectTipValue(e.target.value)
	}

	function handleInputTipSubmit() {

		let tempCartTip = Number.parseFloat(inputTipValue);
		tempCartTip = (Math.round((tempCartTip + Number.EPSILON) * 100) / 100);
		setCartTip((tempCartTip).toFixed(2));
		setInputTip(false)

	}


	return (
	     

		<>
		<ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '2px'}}>
        	<Typography variant="h6">
        		Ajouter un pourboire
        	</Typography>
        </ListItem>
        <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}}>
        	<ToggleButtonGroup color="primary" value={selectTipValue} exclusive onChange={(e) => handleSelectTip(e)}>
        		<ToggleButton value="10">
        			10%
        		</ToggleButton>
        		<ToggleButton value="15">
        			15%
        		</ToggleButton>
        		<ToggleButton value="20">
        			20%
        		</ToggleButton>
        		<ToggleButton value="other">
        			Autre
        		</ToggleButton>
        	</ToggleButtonGroup>
        </ListItem>
        {inputTip === true && (
            <ListItem style={{display:'flex', justifyContent:'center', paddingBottom: '12px'}}>
            	<FormControl variant="outlined">
            		<InputLabel htmlFor="filled-adornment-amount">Montant</InputLabel>
            		<OutlinedInput
            			onChange={(e) => setInputTipValue(e.target.value)}
            			value={inputTipValue}
            			sx={{ paddingRight: 0 }}
            			size="small"
            			id="filled-adornment-amount"
            			label="Montant"
            			startAdornment={<InputAdornment position="start">$</InputAdornment>}
            			endAdornment={
			              <InputAdornment position="end">
			              	<Divider sx={{ height: 38, m: 0 }} orientation="vertical" />
			              	<ButtonBase disabled={!inputTipValue.length} onClick={handleInputTipSubmit} sx={{ height: 38, padding: '12px 0', width: '48px', backgroundColor: '#1976d2', color: '#ffffff', outline: '1px solid #1976d2 !important', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}>
			              		<KeyboardReturnIcon color="inherit" fontSize="medium" />
			              	</ButtonBase>
			                
			              </InputAdornment>
			            }
            			fullWidth />
            			
            	</FormControl>
            </ListItem>
        )}

    </>
	)
}

export default TipInputForm;