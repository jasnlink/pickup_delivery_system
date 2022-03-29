import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { DateTime } from "luxon";

import Welcome from './Welcome';
import TimeSelect from './TimeSelect';
import Account from './Account';
import Login from './Login';
import AddressSearch from './AddressSearch'
import Menu from './Menu'
import Checkout from './Checkout'
import OrderStatus from './OrderStatus'

import Admin from './Admin/Admin'
import AdminProductManager from './Admin/AdminProductManager'

function Core() {

	//Application step var
	const [step, setStep] = useState(1);
	//order cart
	const [cart, setCart] = useState([]);

	//user handling vars
	//auth token for user login
	const [userAuth, setUserAuth] = useState({ accessType: null, accessEmail: null, accessToken: null, accessOtp: null });
	//user verified otp
	const [userVerified, setUserVerified] = useState(false)


	//user data
	//user id
	const [userId, setUserId] = useState('');
	//user first name
	const [userFirstName, setUserFirstName] = useState('');
	//user last name
	const [userLastName, setUserLastName] = useState('');
	//user email
	const [userEmail, setUserEmail] = useState('');
	//user phone
	const [userPhone, setUserPhone] = useState('');
	//user address
	const [userAddress, setUserAddress] = useState('');
	//user address2
	const [userAddress2, setUserAddress2] = useState('');
	//user city
	const [userCity, setUserCity] = useState('');
	//user district
	const [userDistrict, setUserDistrict] = useState('');
	//user postal code
	const [userPostalCode, setUserPostalCode] = useState('');
	//user latitude
	const [userLat, setUserLat] = useState('');
	//user longitude
	const [userLng, setUserLng] = useState('');

	//order type, delivery or takeout
	const [orderType, setOrderType] = useState(null);
	//order date to be delivered or collected 
	const [orderDate, setOrderDate] = useState(null);
	//order time to be delivered or collected 
	const [orderTime, setOrderTime] = useState(null);
	//order tip amount 
	const [orderTip, setOrderTip] = useState(0);
	//order GST amount 
	const [orderGst, setOrderGst] = useState(0);
	//order QST amount 
	const [orderQst, setOrderQst] = useState(0);
	//order amount subtotal 
	const [orderSubtotal, setOrderSubtotal] = useState(0);
	//order amount total 
	const [orderTotal, setOrderTotal] = useState(0);

	//store data from DB
	//store name
	const [storeName, setStoreName] = useState('');
	//store address
	const [storeAddress, setStoreAddress] = useState('');
	//store address2
	const [storeAddress2, setStoreAddress2] = useState('');
	//store city
	const [storeCity, setStoreCity] = useState('');
	//store district
	const [storeDistrict, setStoreDistrict] = useState('');
	//store postal code
	const [storePostalCode, setStorePostalCode] = useState('');
	//store latitude
	const [storeLat, setStoreLat] = useState('');
	//store longitude
	const [storeLng, setStoreLng] = useState('');


	//store hours from time groups
	const [storeTimeHours, setStoreTimeHours] = useState();

	//store delivery zones
	const [deliveryZones, setDeliveryZones] = useState();


	async function setUser(userData) {
		try {
			setUserId(userData.user_id)
			setUserFirstName(userData.user_first_name)
			setUserLastName(userData.user_last_name)
			setUserEmail(userData.user_email)
			setUserPhone(userData.user_phone)
			setUserAddress(userData.user_address)
			setUserAddress2(userData.user_address2)
			setUserCity(userData.user_city)
			setUserDistrict(userData.user_district)
			setUserPostalCode(userData.user_postal_code)
			setUserLat(userData.user_lat)
			setUserLng(userData.user_lng)
		} finally {
			return;
		}
		
	}


	//get store details and populate into state
	useEffect(() => {

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/store/detail")
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

		//get store delivery zones
		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/store/zones")
		.then((response) => {
			setDeliveryZones(response.data);
		})
		.catch((err) => {
	       	console.log("error ", err)});


		//get store hours
		const currentWeekday = DateTime.now().setZone("America/Toronto").get('weekday');

		Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/timegroup/hours/operation", {
			day: currentWeekday,
		})
		.then((response) => {
			setStoreTimeHours(response.data)
		})
		.catch((err) => {
	       	console.log("error ", err)});

		//check if user has auth object
		//get user auth from localStorage
		if(localStorage.getItem('accessType') === 'jwt') {

			setUserAuth({	
							accessType: localStorage.getItem('accessType'), 
							accessEmail: localStorage.getItem('accessEmail'), 
							accessToken: localStorage.getItem('accessToken')
						});

			//check saved auth token
			Axios.post(process.env.REACT_APP_PUBLIC_URL+"/api/login/jwt/auth", {
				userAuth: {	
							accessType: localStorage.getItem('accessType'), 
							accessEmail: localStorage.getItem('accessEmail'), 
							accessToken: localStorage.getItem('accessToken')
						},
			})
			.then((response) => {
				if(response.data.status === 1) {
				//user is authenticated, set user data
					setUser(response.data.userInfo);
					setUserVerified(true)
				} else {
				//user is not authenticated
					setUserVerified(false)
				}
				
			})
			.catch((err) => {
		       	console.log("error ", err)});

		}

	}, [])


	switch(step) {
	  case 1:
	    return (
	    		<Router basename="/app">
					<Routes>
						<Route exact path="/" element={ 
							<Welcome
								setStep={step => setStep(step)}
								setOrderType={type => setOrderType(type)}
							/>} />
						<Route exact path="admin" element={<Admin setStep={step => setStep(step)} />} />
					</Routes>
				</Router>
	      )
	   case 11:
	    return (
				<Login
					setStep={step => setStep(step)}
					orderType={orderType}
					userAuth={userAuth}
					setUserAuth={auth => setUserAuth(auth)}
					userVerified={userVerified}
					setUserVerified={verify => setUserVerified(verify)}

					setUserId={id => setUserId(id)}
					setUserFirstName={first => setUserFirstName(first)}
					setUserLastName={last => setUserLastName(last)}
					setUserEmail={email => setUserEmail(email)}
					setUserPhone={phone => setUserPhone(phone)}
					setUserAddress={address => setUserAddress(address)}
					setUserAddress2={address2 => setUserAddress2(address2)}
					setUserCity={city => setUserCity(city)}
					setUserDistrict={district => setUserDistrict(district)}
					setUserPostalCode={postalcode => setUserPostalCode(postalcode)}
					setUserLat={lat => setUserLat(lat)}
					setUserLng={lng => setUserLng(lng)}
				 />	
	      )
	    case 12:
	    return (
				<AddressSearch
					setStep={step => setStep(step)}
					storeLat={storeLat}
					storeLng={storeLng}
					deliveryZones={deliveryZones}
					userId={userId}
					setUserAddress={address => setUserAddress(address)}
					setUserCity={city => setUserCity(city)}
					setUserDistrict={district => setUserDistrict(district)}
					setUserPostalCode={postalcode => setUserPostalCode(postalcode)}
					setUserLat={lat => setUserLat(lat)}
					setUserLng={lng => setUserLng(lng)}
					userAuth={userAuth}
					setUserVerified={verify => setUserVerified(verify)}
				 />
	      )
	    case 13:
	    return (
				<TimeSelect
					orderType={orderType}
					setStep={step => setStep(step)}
					storeTimeHours={storeTimeHours}
					setOrderDate={setOrderDate}
					setOrderTime={setOrderTime}
					userAuth={userAuth}
					setUserVerified={verify => setUserVerified(verify)}
				/>
	      )
	    case 14:
	    return (
				<Menu
					setStep={step => setStep(step)}
					cart={cart}
					setCart={cart => setCart(cart)}
					orderType={orderType}
					orderDate={orderDate}
					orderTime={orderTime}
					userAuth={userAuth}
					setUserVerified={verify => setUserVerified(verify)}
				/>
	      )
	    case 15:
	    return (
				<Checkout
					setStep={step => setStep(step)}
					cart={cart}
					setCart={cart => setCart(cart)}
					orderType={orderType}
					orderDate={orderDate}
					orderTime={orderTime}

					userId={userId}
					userFirstName={userFirstName}
					userLastName={userLastName}
					userEmail={userEmail}
					userPhone={userPhone}

					userAddress={userAddress}
					userCity={userCity}
					userDistrict={userDistrict}
					userPostalCode={userPostalCode}
					userLat={userLat}
					userLng={userLng}

					setUserFirstName={first => setUserFirstName(first)}
					setUserLastName={last => setUserLastName(last)}
					setUserEmail={email => setUserEmail(email)}
					setUserPhone={phone => setUserPhone(phone)}

					storeName={storeName}
					storeAddress={storeAddress}
					storeCity={storeCity}
					storeDistrict={storeDistrict}
					storePostalCode={storePostalCode}
					storeLat={storeLat}
					storeLng={storeLng}

					deliveryZones={deliveryZones}

					userAuth={userAuth}
					setUserVerified={verify => setUserVerified(verify)}
				/>
	      )
	    case 16:
	    return (
				<OrderStatus 
					orderType={orderType}
					orderDate={orderDate}
					orderTime={orderTime}

					userFirstName={userFirstName}
					userLastName={userLastName}
					userAddress={userAddress}
					userCity={userCity}
					userDistrict={userDistrict}
					userPostalCode={userPostalCode}

					storeName={storeName}
					storeAddress={storeAddress}
					storeCity={storeCity}
					storeDistrict={storeDistrict}
					storePostalCode={storePostalCode}

				/>
	      )
	    case 21:
	    return (
				<Account
					setStep={step => setStep(step)}
					userFirstName={userFirstName}
					userLastName={userLastName}
					userEmail={userEmail}
					userPhone={userPhone}
					userAddress={userAddress}
					userAddress2={userAddress2}
					userCity={userCity}
					userDistrict={userDistrict}
					userPostalCode={userPostalCode}
					userAuth={userAuth}
					setUserVerified={verify => setUserVerified(verify)}

					setUserId={id => setUserId(id)}
					setUserFirstName={first => setUserFirstName(first)}
					setUserLastName={last => setUserLastName(last)}
					setUserEmail={email => setUserEmail(email)}
					setUserPhone={phone => setUserPhone(phone)}
					setUserAddress={address => setUserAddress(address)}
					setUserAddress2={address2 => setUserAddress2(address2)}
					setUserCity={city => setUserCity(city)}
					setUserDistrict={district => setUserDistrict(district)}
					setUserPostalCode={postalcode => setUserPostalCode(postalcode)}
					setUserLat={lat => setUserLat(lat)}
					setUserLng={lng => setUserLng(lng)}
				/>
	      )
	    case 1001:
	    return (
				<Admin
					setStep={step => setStep(step)}
				/>
	      )
	    case 1011:
	    return (
				<AdminProductManager
					setStep={step => setStep(step)}
				/>
	      )

	  }

}

export default Core;