import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";

import Welcome from './Welcome';
import Pickup from './Pickup';
import Delivery from './Delivery';
import Login from './Login';

function Core() {

	//Application step var
	const [step, setStep] = useState(1);
	//auth token for user login
	const [userToken, setUserToken] = React.useState(null);


	switch(step) {
	  case 1:
	    return (
	      <Welcome
	      	setStep={step => setStep(step)}
	      	 />
	      )
	   case 11:
	    return (
	      <Pickup
	      	setStep={step => setStep(step)}
	      	 />
	      )
	    case 21:
	    return (
	      <Delivery
	      	setStep={step => setStep(step)}
	      	 />
	      	
	      )
	    case 100:
	    return (
	      <Login
	      	setStep={step => setStep(step)}
	      	userToken={userToken}
	      	setUserToken={token => setUserToken(token)}
	      	 />	
	      	
	      )
	  }

}

export default Core;