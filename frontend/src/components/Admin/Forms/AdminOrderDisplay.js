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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactsIcon from '@mui/icons-material/Contacts';


function AdminOrderDisplay({ order }) {

	const [orderDetail, setOrderDetail] = useState([])
	const [orderLoading, setOrderLoading] = useState(true)

	useEffect(() => {

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/admin/order/fetch/selected", {
			orderId: order.order_id,
		})
		.then((response) => {
			setOrderDetail(response.data)
			setOrderLoading(false)
		})
		.catch((err) => {
   			console.log("error ", err)});

	}, [])

	return (
	<>
		{orderLoading && (
			<CircularProgress size={48} style={{position: 'relative', left:'50%', marginTop: '-24px', marginLeft: '-24px', paddingTop: '64px', paddingBottom: '64px'}} color="inherit" />
		)}
		{!orderLoading && (
		<Container sx={{ pt: '24px', pb: '16px' }}>
			<div style={{ textAlign:'center'}}>
				<List style={{ display: 'inline-block', textAlign:'center', paddingBottom: '24px'}}>
					<Grid container alignItems="center">
					{order.order_type === "DELIVERY" && (
		        	<>
		        		<Grid item xs={3} sx={{ pr: 2 }}>
		        			<LocationOnIcon />
		        		</Grid>
		        		<Grid item xs={9}>
			            	<ListItem disablePadding>
								<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>{order.order_address}</Typography>} style={{ margin: 0 }} />
							</ListItem>
							<ListItem disablePadding>
								<ListItemText primary={<Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>{order.order_city}, {order.order_district} {order.order_postal_code}</Typography>} style={{ margin: 0 }} />
							</ListItem>
						</Grid>

					</>
					)}

		        		<Grid item xs={3} sx={{ pr: 2 }}>
		        			<ContactsIcon />
		        		</Grid>
		        		<Grid item xs={9}>
							<ListItem disablePadding>
								<ListItemText primary={<Typography variant="subtitle1">{order.user_email}</Typography>} style={{ margin: 0 }} />
							</ListItem>
							<ListItem disablePadding>
								<ListItemText primary={<Typography variant="subtitle1">{order.user_phone}</Typography>} style={{ margin: 0 }} />
							</ListItem>
						</Grid>
					</Grid>
					
				</List>
			</div>

			<List>
			{orderDetail.map((item, index) => (
            	<>
                <ListItem key={item.rowId}>
                    <Grid container alignItems="center" direction="row" justifyContent="space-between">
                        <Grid item xs={9}>
                            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                                <Grid item xs={3}>
                                    <Chip label={item.productQty} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="subtitle2" color="textPrimary">
                                    	{item.productName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Grid container justifyContent="flex-end">
                                <Typography variant="subtitle1" color="textPrimary">
                                    {item.productSubtotal.toFixed(2)}$
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </ListItem>
                {!!item['productOptions'].length && (
                	<>
                	<List sx={{ mt: '-16px', pt: 0, pl: 2 }}>
                		<ListItem sx={{ pb: '2px', pt: '2px' }}>
                		<Grid container>
	                		<Grid item xs ={2}>
	                        	<div></div>
	                        </Grid>
	                        <Grid item xs={8}>
			                	{item['productOptions'].map((group, index) => (
			                		<>
			                		<Typography sx={{ pr: '8px' }} variant="body2">{group.groupName+':'}</Typography> 

				                	{group['groupOptions'].map((option, index) => (
					                	<>
					                		<Chip sx={{ mt:'4px' ,mr: '4px' }} variant="filled" size="small" color="default" label={option.optionName} />
					                	</>
					                ))}
				                	</>
			                	))}
		                	</Grid>
		                	<Grid item xs ={2}>
	                        	<div></div>
	                        </Grid>
		                </Grid>
	                	</ListItem>

                	</List>
                	</>
                )}
            </>
            ))}
            <Divider sx={{ pt: '16px' }} />
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                Sous-total
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                {order.order_subtotal}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                	<ListItem>
		                    <Grid container alignItems="center" justifyContent="space-between">
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                Pourboire
		                            </Typography>
		                        </Grid>
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                {order.order_tip}$
		                            </Typography>
		                        </Grid>
		                    </Grid>
		                </ListItem>
		            {order.order_type === "DELIVERY" && (
		            <>
		                <ListItem>
		                    <Grid container alignItems="center" justifyContent="space-between">
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                Frais de Livraison
		                            </Typography>
		                        </Grid>
		                        <Grid item>
		                            <Typography variant="subtitle1" color="textPrimary">
		                                {order.order_delivery_fee === 0 ? 'Gratuit' : order.order_delivery_fee.toFixed(2)+'$'}
		                            </Typography>
		                        </Grid>
		                    </Grid>
		                </ListItem>
		            </>
	            	)}
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                TPS 5%
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                {order.order_gst}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                TVQ 9.975%
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography variant="subtitle1" color="textPrimary">
	                                {order.order_qst}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	                <ListItem>
	                    <Grid container alignItems="center" justifyContent="space-between">
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                Total
	                            </Typography>
	                        </Grid>
	                        <Grid item>
	                            <Typography style={{ fontWeight: "bold" }} variant="subtitle1" color="textPrimary">
	                                {order.order_total}$
	                            </Typography>
	                        </Grid>
	                    </Grid>
	                </ListItem>
	               </List>
		</Container>
		)}
	</>
	)
}
export default AdminOrderDisplay;