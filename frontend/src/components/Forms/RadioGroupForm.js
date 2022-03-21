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
	InputLabel,
	Button,
	TextField,
	Input,
	Grid,
	Fade,
	CircularProgress,
	Drawer,
	Paper,
	Chip,
	Checkbox,
	FormGroup,
	Radio,
	RadioGroup
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';


function RadioGroupForm({ productOptgroups, productOptions, handleAddProductOption, handleRemoveProductOption, setRadioFilled }) {
	
	const [radioLoading, setRadioLoading] = useState(true)
	//radio group checked state
	const [radioState, setRadioState] = useState({})
	//radio fill count to enable add to cart
	const [radioFillCount, setRadioFillCount] = useState(0)
	//previous radio option,
	//so we can remove it from cart when we change to another radio
	const [prevRadioOption, setPrevRadioOption] = useState({})


	useEffect(() => {
		setRadioFilled(true)
		buildRadioState()
		.then((result) => {
			setRadioState(result)
			setRadioLoading(false)
		})

	}, [])

	//helper function to build initial radio group state
	async function buildRadioState() {

		//map to contain all radio buttons
		let radioMap = {}
		//count number of groups to be filled
		let count = 0

		for(let group of productOptgroups) {
			if(group.max_choices === 1) {
				radioMap[group.optgroup_id] = '';
				count++;
			}
		}

		//if there are groups to be filled, this is a fail safe
		if(count > 0) {
			//have radios to be filled, set number of groups to be filled
			setRadioFilled(false)
			setRadioFillCount(count)
		}
		
		return radioMap

	}

	//handle radio selection
	function handleRadio(groupId, groupName, groupMax, optionId, optionName, optionPrice) {

		//temp variable to hold current radio group state
		//need to use spread operator to create a copy of the old object state
		//because just updating a property inside an object state will not make react rerender checkboxes
		let tempChecked = {...radioState};

		//previously selected option, need to remove from cart before adding the new option
		let prevOption = {...prevRadioOption}

		//current option object to be added to cart
		let option = {
						groupId: groupId,
						groupName: groupName,
						optionId: optionId,
						optionName: optionName,
						optionPrice: optionPrice,
					};

		//first remove previous option
		handleRemoveProductOption(prevOption);
		//then add current option
		handleAddProductOption(option);
		//update to current option
		//so that next time we call, this will be the previous option
		setPrevRadioOption(option)

		//update radio group state to new radio button
		tempChecked[groupId] = optionId
		setRadioState(tempChecked)

		//check number of radios filled by counting how many are selected
		let size = Object.keys(tempChecked).length;
		//if the number of selected radios are the same as the number we need to be filled,
		//then all radios are filled and we can add to cart
		if(size === radioFillCount) {
			setRadioFilled(true);
		}

	}

	return (<>
		{radioLoading && (

			<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />

		)}
		{!radioLoading && (<>

			{productOptgroups.map((group, index) => (
				<>
					{group.max_choices === 1 && (
					<>

					<ListItem key={index} disablePadding sx={{ mt: '16px' }}>
						<Typography variant="h5" className="">
							{group.optgroup_name}
						</Typography>
					</ListItem>
					<ListItem key={index} disablePadding sx={{ mb: '12px' }}>
						<Typography variant="subtitle2" className="">
							Faites 1 choix {group.required ? '*obligatoire' : ''}
						</Typography>
					</ListItem>
					
					{productOptions.map((option, index) => (
						<>
						{option.optgroup_id === group.optgroup_id && (
								<ListItem key={index} disablePadding sx={{ mt: '8px', mb: '8px' }}>
									<Grid container alignItems="center" direction="row">
										<Grid item xs={1}>
											<Radio 
												sx={{ m: 0, p: 0 }} 
												checked={radioState[option.optgroup_id] === option.option_id} 
												onChange={() => handleRadio(option.optgroup_id, group.optgroup_name, group.max_choices, option.option_id, option.option_name, option.option_price)} 
											/>
										</Grid>
										<Grid item xs={9}>
											<Typography variant="subtitle2" sx={{ pl: '12px' }} className="">
												{option.option_name}
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography variant="body2" className="">
												{option.option_price ? (option.option_price).toFixed(2)+'$' : 'inclut'}
											</Typography>
										</Grid>
									</Grid>
								</ListItem>
						)}
						</>
					))}
				</>
				)}
				</>

				
			))}

		</>)}


	</>)

}

export default RadioGroupForm