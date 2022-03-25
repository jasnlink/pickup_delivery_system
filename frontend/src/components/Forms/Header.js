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
	DialogActions,
	SvgIcon
 } from '@mui/material';



function Header() {
	

	return (


	<Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="regular">
          <Typography variant="h6" color="inherit" component="div">
            Commande en ligne
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
	)
}

export default Header;