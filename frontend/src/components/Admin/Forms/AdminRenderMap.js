import React, { useState, useEffect, useRef } from 'react';
import {Map, InfoWindow, Marker, Circle, GoogleApiWrapper} from 'google-maps-react';
import { Typography } from '@mui/material';


function AdminRenderMap(props) {


  return (
  <>
  	<Map 
        google={props.google}
        style={{width: '100%', height: '100%'}}
        containerStyle={{position: 'relative', width: '100%', height: '84vh'}}
        initialCenter={{
          lat: props.storeLat,
          lng: props.storeLng
        }}
        zoom={14}
        scrollWheel={false}
        draggable={false}
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
        <Circle
	        radius={(props.range*1000)}
	        center={{
	          lat: props.storeLat,
	          lng: props.storeLng
	        }}
	        onMouseover={() => console.log('mouseover')}
	        onClick={() => console.log('click')}
	        onMouseout={() => console.log('mouseout')}
	        strokeColor='transparent'
	        strokeOpacity={0}
	        strokeWeight={5}
	        fillColor='#FF0000'
	        fillOpacity={0.2}
	      />
    </Map>
  </>
  )
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY),
})(AdminRenderMap)