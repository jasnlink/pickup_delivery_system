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

function CheckBoxGroupForm({ productOptgroups, productOptions, handleAddProductOption, handleRemoveProductOption, setCheckFilled }) {
	
	const [checkLoading, setCheckLoading] = useState(true)
	//checkbox group checked state
	const [isChecked, setIsChecked] = useState({})
	//number of checkbox groups needed filled to enable add to cart
	const [checkFillCount, setCheckFillCount] = useState(0)
	//current number of checkbox groups that are required that are filled
	const [checkCurrentFillCount, setCheckCurrentFillCount] = useState(0)

	useEffect(() => {
		buildCheckBoxState()
		.then((result) => {
			setIsChecked(result)
			setCheckLoading(false)
		})

	}, [])

	//helper function to build initial checkbox group state
	async function buildCheckBoxState() {

		//check group object map to contain individual checks 
		let tempChecked = {}
		//individual checks map
		let checkMap = {}
		//count the number of groups of checks that are required to be filled in the form
		let reqCount = 0;

		//find all product group options that have more than 1 max choice
		//set all checkboxes to unchecked and not disabled
		for(let group of productOptgroups) {
			if(group.max_choices >= 1) {
				if(group.required && group.max_choices > 1) {
					reqCount++;
				}
				//loop through each checkbox and initialise as not checked and not disabled
				for(let option of productOptions) {
					if(option.optgroup_id === group.optgroup_id) {
						checkMap[option.option_id] = {checked: false, disabled: false}
					}

				}
				//assign all individual checks to the group
				tempChecked[group.optgroup_id] = checkMap;

				//add a prevMax flag, this is used to check if we have checked all checkboxes previously
				//so can know if we are specifically unchecking our first box after checking all boxes
				tempChecked[group.optgroup_id].prevMax = 0;
			}
		}
		//if there are boxes that are required
		if(reqCount > 0) {
			setCheckFilled(false);
			setCheckFillCount(reqCount)
		} else {
		//if there are not required boxes
			setCheckFilled(true);
		}
		return tempChecked

	}

	//handle checking and unchecking boxes
	function handleChecked(groupId, groupName, groupMax, optionId, optionName, optionPrice, required) {

		//temp variable to hold current checkbox group state
		//need to use spread operator to create a copy of the old object state
		//because just updating a property inside an object state will not make react rerender checkboxes
		let tempChecked = {...isChecked};
		//temp number of groups of required checkboxes that are filled
		let tempCheckCurrentFillCount = checkCurrentFillCount
		

		//current option object to be added to cart
		let option = {
						groupId: groupId,
						groupName: groupName,
						optionId: optionId,
						optionName: optionName,
						optionPrice: optionPrice,
					}


		//if the current checkbox is not checked, then set it to checked
		//then add the selected option to cart
		if(tempChecked[groupId][optionId]['checked'] === false) {

			tempChecked[groupId][optionId]['checked'] = true
			handleAddProductOption(option);

		} else if (tempChecked[groupId][optionId]['checked'] === true) {
		//if current check box is checked, then set it to unchecked
		//then remove the selected option from cart

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
		//if we reached max boxes checked, then disable all other unchecked checkboxes
		if(count === groupMax) {

			//set the prevMax flag because we just checked all boxes and the next box we uncheck will be the first box we uncheck after checking them all
			tempChecked[groupId]['prevMax'] = 1

			for(let c in tempChecked[groupId]) {
				if(tempChecked[groupId][c]['checked'] === false) {
					tempChecked[groupId][c]['disabled'] = true

				}
			}
			//if checkboxes are required, then we checked all boxes needed
			//so we increment the number of groups of checkboxes required filled count by 1
			if(required) {
				tempCheckCurrentFillCount++
				setCheckCurrentFillCount(tempCheckCurrentFillCount)
			}
		}
		//enable everything back if we are back to below max boxes checked
		else if (count < groupMax && tempChecked[groupId]['prevMax'] === 1) {

			//we unset the prevMax flag because we are no longer unchecking our first box after checking them all
			tempChecked[groupId]['prevMax'] = 0

			for(let c in tempChecked[groupId]) {
				if(tempChecked[groupId][c]['disabled'] === true) {
					tempChecked[groupId][c]['disabled'] = false
				}
			}

			//if the current checkbox group is a required one and we just unchecked out first checkbox after checking them all
			//we decrement the number of groups of checkboxes required filled count by 1
			if(required) {
				tempCheckCurrentFillCount--
				setCheckCurrentFillCount(tempCheckCurrentFillCount)
			}
		}
		//all checkbox groups required have been checked, we can now add item to cart
		if(tempCheckCurrentFillCount === checkFillCount) {
			setCheckFilled(true)
		} else {
			setCheckFilled(false)
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
					{((group.max_choices > 1) || (group.max_choices === 1 && group.required === 0)) && (
					<>

					<ListItem key={index} disablePadding sx={{ mt: '16px' }}>
						<Typography variant="h5" className="">
							{group.optgroup_name}
						</Typography>
					</ListItem>
					<ListItem key={index} disablePadding sx={{ mb: '12px' }}>
						<Typography variant="subtitle2" className="">
							{group.required ? 'Faites' : ''} {group.max_choices} choix {group.required ? '*obligatoire' : 'maximum'}
						</Typography>
					</ListItem>
					
					{productOptions.map((option, index) => (
						<>
						{option.optgroup_id === group.optgroup_id && (
								<ListItem key={index} disablePadding sx={{ mt: '8px', mb: '8px' }}>
									<Grid container alignItems="center" direction="row">
										<Grid item xs={1}>
											<Checkbox 
												classes={{
													root: 'checkbox-root',
													checked: 'checkbox-checked',
													disabled: 'checkbox-disabled'
												}}
												sx={{ m: 0, p: 0 }} 
												checked={isChecked[option.optgroup_id][option.option_id]['checked']} 
												onChange={() => handleChecked(option.optgroup_id, group.optgroup_name, group.max_choices, option.option_id, option.option_name, option.option_price, group.required)} 
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