import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { 	
	Typography,
	ListItem,
	ListItemText,
	Select,
	MenuItem,
	FormControl,
	InputLabel
 } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function TimeSelectForm() {


	return (<>

				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<ListItemText primary={<Typography variant="h2">Pour quand?</Typography>} style={{display:'flex', justifyContent:'center'}} />
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard">
						<InputLabel />
						<Select value="10"
							sx={{ 
								fontSize: '32px',
							    height: 64,
							    width: '100%',
							    padding: '0 12px', 
							}}>
							<MenuItem value={10}>Aujourd'hui</MenuItem>
							<MenuItem value={20}>Demain</MenuItem>
							<MenuItem value={30}>Mer 16</MenuItem>
							<MenuItem value={30}>Jeu 17</MenuItem>
						</Select>
					</FormControl>
				</ListItem>
				<ListItem style={{display:'flex', justifyContent:'center'}}>
					<FormControl variant="standard">
						<InputLabel />
						<Select value="10"
							sx={{ 
								fontSize: '32px',
							    height: 64,
							    width: '100%',
							    padding: '0 12px', 
							}}>
							<MenuItem value={10}>11:00</MenuItem>
							<MenuItem value={20}>11:30</MenuItem>
							<MenuItem value={30}>12:00</MenuItem>
						</Select>
					</FormControl>
				</ListItem>

		</>)


}

export default TimeSelectForm;