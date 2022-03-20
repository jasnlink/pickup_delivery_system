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

function CheckBoxGroupForm({ productOptgroups, productOptions, handleAddProductOption, handleRemoveProductOption }) {
	
	const [checkLoading, setCheckLoading] = useState(true)
	//checkbox group checked state
	const [isChecked, setIsChecked] = useState({})
	//checkbox group disabled state

	useEffect(() => {

		buildCheckBoxState()
		.then((result) => {
			setIsChecked(result)
			setCheckLoading(false)
		})

	}, [])

	//helper function to build initial checkbox group state
	async function buildCheckBoxState() {

		let tempChecked = {}
		let checkMap = {}

		//find all product group options that have more than 1 max choice
		//set all checkboxes to unchecked and not disabled
		for(let group of productOptgroups) {
			if(group.max_choices > 1) {
				for(let option of productOptions) {
					if(option.optgroup_id === group.optgroup_id) {
						checkMap[option.option_id] = {checked: false, disabled: false}
					}

				}
				tempChecked[group.optgroup_id] = checkMap;
			}
		}
		return tempChecked

	}

	//handle checking and unchecking boxes
	function handleChecked(groupId, groupName, groupMax, optionId, optionName, optionPrice) {

		//temp variable to hold current checkbox group state
		//need to use spread operator to create a copy of the old object state
		//because just updating a property inside an object state will not make react rerender checkboxes
		let tempChecked = {...isChecked};

		//current option object to be added to cart
		let option = {
						groupId: groupId,
						groupName: groupName,
						optionId: optionId,
						optionName: optionName,
						optionPrice: optionPrice,
					}

		//reverse check state
		if(tempChecked[groupId][optionId]['checked'] === false) {

			tempChecked[groupId][optionId]['checked'] = true
			handleAddProductOption(option);

		} else if (tempChecked[groupId][optionId]['checked'] === true) {

			tempChecked[groupId][optionId]['checked'] = false
			handleRemoveProductOption(option);

		}

		//count number of boxes checked
		let count = 0
		for(let c in tempChecked[groupId]) {
			if(tempChecked[groupId][c]['checked'] === true) {
				count++;
			}
		}
		//if we reached max boxes checked, disable the rest
		if(count === groupMax) {
			for(let c in tempChecked[groupId]) {
				if(tempChecked[groupId][c]['checked'] === false) {
					tempChecked[groupId][c]['disabled'] = true
				}
			}
		}
		//enable everything back if we are back to below max boxes checked
		else if (count < groupMax) {
			for(let c in tempChecked[groupId]) {
				tempChecked[groupId][c]['disabled'] = false
			}
		}
		setIsChecked(tempChecked)
	}


	return (<>
		{checkLoading && (

			<CircularProgress size={64} style={{position: 'fixed', top: '50%', left:'50%', marginTop: '-32px', marginLeft: '-32px'}} color="inherit" />

		)}
		{!checkLoading && (<>

			{productOptgroups.map((group, index) => (
				<>
					{group.max_choices > 1 && (
					<>

					<ListItem key={index} disablePadding sx={{ mt: '16px' }}>
						<Typography variant="h5" className="">
							{group.optgroup_name}
						</Typography>
					</ListItem>
					<ListItem key={index} disablePadding sx={{ mb: '12px' }}>
						<Typography variant="subtitle2" className="">
							Faites {group.must_select_all ? '' : 'jusqu\'à'} {group.max_choices} choix {group.required ? 'obligatoire' : ''}
						</Typography>
					</ListItem>
					
					{productOptions.map((option, index) => (
						<>
						{option.optgroup_id === group.optgroup_id && (
								<ListItem key={index} disablePadding sx={{ mt: '8px', mb: '8px' }}>
									<Grid container alignItems="center" direction="row">
										<Grid item xs={1}>
											<Checkbox 
												sx={{ m: 0, p: 0 }} 
												checked={isChecked[option.optgroup_id][option.option_id]['checked']} 
												onChange={() => handleChecked(option.optgroup_id, group.optgroup_name, group.max_choices, option.option_id, option.option_name, option.option_price)} 
												disabled={isChecked[option.optgroup_id][option.option_id]['disabled']}
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

export default CheckBoxGroupForm