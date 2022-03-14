import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";

import Welcome from './Welcome';
import TimeSelect from './TimeSelect';
import Account from './Account';
import Login from './Login';
import AddressSearch from './AddressSearch'

function Core() {

	//Application step var
	const [step, setStep] = useState(1);

	//auth token for user login
	const [userToken, setUserToken] = React.useState(null);
	//user verified otp
	const [userVerified, setUserVerified] = React.useState(false)
	//user data aggregate
	const [userData, setUserData] = React.useState(null);

	//user first name
	const [userFirstName, setUserFirstName] = React.useState('');
	//user last name
	const [userLastName, setUserLastName] = React.useState('');
	//user email
	const [userEmail, setUserEmail] = React.useState('');
	//user phone
	const [userPhone, setUserPhone] = React.useState('');
	//user address
	const [userAddress, setUserAddress] = React.useState('');
	//user address2
	const [userAddress2, setUserAddress2] = React.useState('');
	//user city
	const [userCity, setUserCity] = React.useState('');
	//user district
	const [userDistrict, setUserDistrict] = React.useState('');
	//user postal code
	const [userPostalCode, setUserPostalCode] = React.useState('');
	//user geocode
	const [userGeocode, setUserGeocode] = React.useState('');

	//order type
	const [orderType, setOrderType] = React.useState(null);


	switch(step) {
	  case 1:
	    return (
		      <Welcome
		      	setStep={step => setStep(step)}
		      	setOrderType={type => setOrderType(type)}
	      	 />
	      )
	   case 11:
	    return (
				<Login
					setStep={step => setStep(step)}
					userToken={userToken}
					setUserToken={token => setUserToken(token)}
					setUserEmail={email => setUserEmail(email)}
					userVerified={userVerified}
					setUserVerified={verify => setUserVerified(verify)}
					userData={userData}
					setUserData={data => setUserData(data)}
				 />	
	      )
	    case 12:
	    return (
				<Account
					setStep={step => setStep(step)}
				/>
	      )
	    case 13:
	    return (
				<AddressSearch
					setStep={step => setStep(step)}
				 />
	      )
	    case 14:
	    return (
				<TimeSelect
					orderType={orderType}
					setStep={step => setStep(step)}
				/>
	      )

	  }

}

export default Core;