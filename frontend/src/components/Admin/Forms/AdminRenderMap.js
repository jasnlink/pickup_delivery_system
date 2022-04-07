import React, { useState, useEffect, useRef } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { Typography } from '@mui/material';


function AdminRenderMap(props) {


  return (
  <>
  	<Map 
        google={props.google}
        style={{width: '100%', height: '100%'}}
        containerStyle={{position: 'relative', width: '100%', height: '80vh'}}
        initialCenter={{
          lat: props.storeLat,
          lng: props.storeLng
        }}
        zoom={14}
        scrollWheel={false}
        draggable={true}
        keyboardShortcuts={false}
        disableDoubleClickZoom
        zoomControl={true}
        mapTypeControl={false}
        scaleControl={false}
        streetViewControl={false}
        panControl={false}
        rotateControl={false}
        fullscreenControl={false}
    >

    	<Marker />
        
    </Map>
  </>
  )
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY),
})(AdminRenderMap)