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
	const [step, setStep] = useState(13);

	//user handling vars
	//auth token for user login
	const [userToken, setUserToken] = React.useState(null);
	//user verified otp
	const [userVerified, setUserVerified] = React.useState(false)
	//registered user data aggregate from DB
	const [userData, setUserData] = React.useState(null);

	//user data for new users
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
	//user latitude
	const [userLat, setUserLat] = React.useState('');
	//user longitude
	const [userLng, setUserLng] = React.useState('');

	//order type
	const [orderType, setOrderType] = React.useState(null);

	//store data from DB
	//store name
	const [storeName, setStoreName] = React.useState('');
	//store address
	const [storeAddress, setStoreAddress] = React.useState('');
	//store address2
	const [storeAddress2, setStoreAddress2] = React.useState('');
	//store city
	const [storeCity, setStoreCity] = React.useState('');
	//store district
	const [storeDistrict, setStoreDistrict] = React.useState('');
	//store postal code
	const [storePostalCode, setStorePostalCode] = React.useState('');
	//store latitude
	const [storeLat, setStoreLat] = React.useState('');
	//store longitude
	const [storeLng, setStoreLng] = React.useState('');


	//store delivery zones
	const [deliveryZones, setDeliveryZones] = React.useState();


	//get store details and populate into state
	useEffect(() => {

		Axios.post("http://localhost:3500/api/store/detail")
		.then((response) => {

			response = response.data[0];

			setStoreName(response.store_name);
			setStoreAddress(response.store_address);
			setStoreAddress2(response.store_address2);
			setStoreCity(response.store_city);
			setStoreDistrict(response.store_district);
			setStorePostalCode(response.store_postal_code);
			setStoreLat(response.store_lat);
			setStoreLng(response.store_lng);

		})
		.catch((err) => {
	       	console.log("error ", err)});


		Axios.post("http://localhost:3500/api/store/zones")
		.then((response) => {
			setDeliveryZones(response.data);
		})
		.catch((err) => {
	       	console.log("error ", err)});


	}, [])


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
					storeLat={storeLat}
					storeLng={storeLng}
					deliveryZones={deliveryZones}
					setUserAddress={address => setUserAddress(address)}
					setUserCity={city => setUserCity(city)}
					setUserDistrict={district => setUserDistrict(district)}
					setUserPostalCode={postalcode => setUserPostalCode(postalcode)}
					setUserLat={lat => setUserLat(lat)}
					setUserLng={lng => setUserLng(lng)}
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