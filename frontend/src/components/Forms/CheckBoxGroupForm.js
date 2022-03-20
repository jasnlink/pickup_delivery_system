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

function CheckBoxGroupForm({ productOptgroups, productOptions }) {
	
	const [checkLoading, setCheckLoading] = useState(true)
	//checkbox group checked state
	const [isChecked, setIsChecked] = useState({})

	useEffect(() => {

		buildCheckBoxState()
		.then((result) => {
			console.log(result)
			setIsChecked(result)
			setCheckLoading(false)
		})

	}, [])


	async function buildCheckBoxState() {

		let tempChecked = {}
		let checkMap = {}

		for(let group of productOptgroups) {
			if(group.max_choices > 1) {
				for(let option of productOptions) {
					if(option.optgroup_id === group.optgroup_id) {
						checkMap[option.option_id] = false
					}

				}
				tempChecked[group.optgroup_id] = checkMap;
			}
		}
		return tempChecked

	}

	function handleChecked(group, id) {

		let tempChecked = {...isChecked};
		tempChecked[group][id] = !tempChecked[group][id]
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
											<Checkbox sx={{ m: 0, p: 0 }} checked={isChecked[option.optgroup_id][option.option_id]} onChange={() => handleChecked(option.optgroup_id, option.option_id)} />
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