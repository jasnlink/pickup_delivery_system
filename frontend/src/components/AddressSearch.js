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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
 } from '@mui/material';

import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';

import { usePlacesWidget } from "react-google-autocomplete";

function AddressSearch({ setStep, storeLat, storeLng, deliveryZones }) {

	//google places autocomplete ref used by search input
	const { ref: autoCompleteRef } = usePlacesWidget({
	    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	    onPlaceSelected: (place, inputRef, autocomplete) => handlePlaceSelected(place),
	    options: {
	      componentRestrictions: { country: ["ca"] },
	      fields: ["formatted_address","address_components","geometry"],
	      types: ["address"],
	    },
	    language: "fr-CA",
	    libraries: ["places","geometry"],
	  });

	//Furthest delivery range
	const [maxRange, setMaxRange] = useState(0);

	//get store delivery zones and populate into state
	useEffect(() => {
		if(deliveryZones) {
			let totalMax = 0

			deliveryZones.map((zone) => {
				let curMax = zone.delivery_zone_range
				totalMax = Math.max(curMax, totalMax);
			})

			setMaxRange(totalMax)
		}
	}, [deliveryZones])



	//Harversine formula to calculate distance between two points on earth
	function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
	}

	//currently selected lat
	const [selectLat, setSelectLat] = useState(0);
	//currently selected long
	const [selectLng, setSelectLng] = useState(0);

	//submit button toggle if address is validated
	const [isAddress, setIsAddress] = useState(false);
	//submit button loading
	const [submitLoading, setSubmitLoading] = useState(false);
	//delivery too far error
	let [error, setError] = useState(false);

	//handle place selected from autocomplete
	function handlePlaceSelected(place) {
		setSearchValue(place.formatted_address);
		setSelectLat(place.geometry.location.lat());
		setSelectLng(place.geometry.location.lng());
		setIsAddress(true);
	}
	//handle submit button
	function handleSubmit() {
		
		setSubmitLoading(true);

		const distanceFromStore = distance(storeLat, storeLng, selectLat, selectLng, 'K');

		if(distanceFromStore <= maxRange) {
			console.log('in range!')
			setStep(14)
		} else {
			setError(true);
			setIsAddress(false);
		}
		console.log(distanceFromStore)

		//data coming back too fast, wait 1 second
		setTimeout(() => {setSubmitLoading(false);}, 1000)
	}

	
	//submit button toggle
	const [searchValue, setSearchValue] = useState('');

	return (<>
		<Box sx={{ flexGrow: 1 }}>
	      <AppBar position="static">
	        <Toolbar variant="regular">
	          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setStep(1)}>
	            <ArrowBackIcon />
	          </IconButton>
	          <Typography variant="h6" color="inherit" component="div">
	            Livraison
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </Box>
		<Container maxWidth='sm'>
			<Dialog open={error} maxWidth="xs" fullWidth onClose={() => setError(false)}>
				<Box style={{ padding: '16px 8px' }}>
					<DialogTitle style={{display:'flex', justifyContent:'center', paddingBottom: 24}}>
						<ErrorIcon color="error" style={{fontSize:108}} />
					</DialogTitle>
					<DialogContent style={{display:'flex', justifyContent:'center'}}>
						<Typography align="center" variant="h4">Cet adresse est hors de notre zone de livraison.</Typography>
					</DialogContent>
					<DialogActions style={{display:'flex', justifyContent:'center', paddingTop: 8}}>
						<Button variant="contained" size="large" fullWidth onClick={() => setError(false)}>
							OK
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
			<List sx={{ mt: '24px' }}>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Quel adresse?</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{marginTop: 24, display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard" fullWidth>
						<Input
							inputRef={autoCompleteRef}
							inputProps={{ style: { textAlign:'center' } }}
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</FormControl>
				</ListItem>
				<ListItem style={{marginTop: 48, display:'flex', justifyContent:'center'}}>
					<LoadingButton variant="contained" size="large" fullWidth loading={submitLoading} disabled={!isAddress} onClick={handleSubmit}>Continuer</LoadingButton>
				</ListItem>
			</List>
		</Container>

		</>)


}

export default AddressSearch;