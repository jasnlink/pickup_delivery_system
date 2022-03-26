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


function Admin() {

	const [sidebarOpen, setSidebarOpen] = useState(0);

	function handleSidebarSelect(sId) {

		if(sidebarOpen === sId) {
			setSidebarOpen(0);
			return;
		} else {
			setSidebarOpen(sId);
		}

	}

	return (
	<>
	
		<Grid container>
			<Grid item xs={2}>
				<Paper sx={{ minHeight: '100vh' }} elevation={4} square>
					<List disablePadding>
						<ListItem sx={{ pl: 1 }}>
							<ListItemText primary={<Typography variant="h6" style={{ fontWeight: '500' }}>Commandes</Typography>} />
						</ListItem>
						<ListItemButton sx={{ pl: 4 }} selected>
							<ListItemText primary={<Typography style={{ fontWeight: 'bold' }} variant="subtitle1">Actives</Typography>} />
						</ListItemButton>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemText primary={<Typography variant="subtitle1">Passées</Typography>} />
						</ListItemButton>
						<Divider />

						<ListItem sx={{ pl: 1 }}>
							<ListItemText primary={<Typography variant="h6" style={{ fontWeight: '500' }}>Gestion</Typography>} />
						</ListItem>
						<ListItemButton onClick={() => handleSidebarSelect(1)}>
							<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Menu</Typography>} />
							{sidebarOpen === 1 ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>

							<Collapse in={sidebarOpen === 1} unmountOnExit>
								<List disablePadding>
									<ListItemButton sx={{ pl: 4 }}>
											<ListItemText primary="Produits" />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Catégories" />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Options de produits" />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Groupes d'options" />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Horaires" />
									</ListItemButton>
								</List>
							</Collapse>

						<ListItemButton>
							<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Rapports finances</Typography>} />
						</ListItemButton>
						<ListItemButton onClick={() => handleSidebarSelect(2)}>
							<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Emplacement</Typography>} />
							{sidebarOpen === 2 ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>

							<Collapse in={sidebarOpen === 2} unmountOnExit>
								<List disablePadding>
									<ListItemButton  sx={{ pl: 4 }}>
										<ListItemText primary="Adresse" />
									</ListItemButton>
									<ListItemButton  sx={{ pl: 4 }}>
										<ListItemText primary="Zones de livraison" />
									</ListItemButton>
									<ListItemButton  sx={{ pl: 4 }}>
										<ListItemText primary="Heures" />
									</ListItemButton>
								</List>
							</Collapse>

						<ListItemButton onClick={() => handleSidebarSelect(3)}>
							<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: '500' }}>Intégrations</Typography>} />
							{sidebarOpen === 3 ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>

							<Collapse in={sidebarOpen === 3} unmountOnExit>
								<List disablePadding>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Caisses POS" />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Plateformes" />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }}>
										<ListItemText primary="Paiements" />
									</ListItemButton>
								</List>
							</Collapse>

					</List>
				</Paper>
			</Grid>
		

			<Grid item xs={10}>
				<Container maxWidth="sm" sx={{ pt: 6 }}>
					<Typography variant="h4">
						Neuves
					</Typography>
					<Stack spacing={2} sx={{ pt: '12px', pb: '24px' }}>
						<Card>
							<CardActionArea onClick={() => console.log("Card clicked")} sx={{ p: '12px' }}>
								<Grid container alignItems="center">
									<Grid direction="column" container item xs={3}>
										<Grid item>
											<Typography style={{ color: 'green' }} variant="h6">
												UberEats
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="body1">
												#FE54Y15
											</Typography>
										</Grid>
									</Grid>
									<Grid direction="column" container item xs={3}>
										<Grid item>
											<Typography variant="h6">
												Livraison
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="body1">
												Lilian L.
											</Typography>
										</Grid>
									</Grid>
									<Grid item xs={3}>
										<Typography variant="h6">
											Pour 10:43
										</Typography>
									</Grid>
									<Grid item xs={3}>
										<Button size="large"  
												variant="contained" 
												disableElevation
												onMouseDown={event => event.stopPropagation()}
												onTouchStart={(event) => event.stopPropagation()} 
												onClick={event => {
									              event.stopPropagation();
									              event.preventDefault();
									              console.log("Button clicked");
									            }}>
											Accepter
										</Button>
									</Grid>
								</Grid>
							</CardActionArea>
						</Card>
						<Card>
							<CardActionArea onClick={() => console.log("Card clicked")} sx={{ p: '12px' }}>
								<Grid container alignItems="center">
									<Grid direction="column" container item xs={3}>
										<Grid item>
											<Typography style={{ color: 'red' }} variant="h6">
												Doordash
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="body1">
												#A56FA15
											</Typography>
										</Grid>
									</Grid>
									<Grid direction="column" container item xs={3}>
										<Grid item>
											<Typography variant="h6">
												Livraison
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="body1">
												Bob L.
											</Typography>
										</Grid>
									</Grid>
									<Grid item xs={3}>
										<Typography variant="h6">
											Pour 11:05
										</Typography>
									</Grid>
									<Grid item xs={3}>
										<Button size="large" 
												variant="contained" 
												disableElevation
												onMouseDown={event => event.stopPropagation()}
												onTouchStart={(event) => event.stopPropagation()} 
												onClick={event => {
									              event.stopPropagation();
									              event.preventDefault();
									              console.log("Button clicked");
									            }}>
											Accepter
										</Button>
									</Grid>
								</Grid>
							</CardActionArea>
							<Collapse in={true}>
								<Container>
									dkjnaskndsakjn
								</Container>
							</Collapse>
						</Card>
					</Stack>
					<Typography variant="h4">
						En préparation
					</Typography>
					<Typography variant="h4">
						Prêtes
					</Typography>
					<Typography variant="h4">
						Complétées
					</Typography>
				</Container>
			</Grid>
		</Grid>
	</>
	)
}

export default Admin;