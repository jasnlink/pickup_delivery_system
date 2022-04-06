import React, { useState, useEffect, useRef } from 'react';


function AdminRenderMap({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
	

	const ref = useRef();
	
	useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });



	return (
	<>
		
		<div ref={ref} id="map" />
		
	</>
	)
}

export default AdminRenderMap;