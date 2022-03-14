import { usePlacesWidget } from "react-google-autocomplete";
import { Input } from '@mui/material';


function AddressSearchInput() {

	const { ref: autoCompleteRef } = usePlacesWidget({
	    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	    onPlaceSelected: (place, inputRef, autocomplete) => {console.log(place);},
	    options: {
	      componentRestrictions: { country: ["ca"] },
	      fields: ["formatted_address","address_components", "geometry.location"],
	      types: ["address"],
	    },
	    language: "fr-CA",
	  });

	return (
			<Input
				inputRef={autoCompleteRef}
				inputProps={{ style: { textAlign:'center' } }}
			/>
		)
}

export default AddressSearchInput