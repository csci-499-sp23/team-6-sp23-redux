import {React, useState, useRef} from 'react';
import {  GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, MarkerF} from '@react-google-maps/api';

function Map(props) {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    })

    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [directionsRequested, setDirectionsRequested] = useState(false);

    const containerStyle = {
        width: '100%',
        height: '100%'
    };
    const userLocation = {
        lat: 40.712742,
        lng: -74.013382
    };

    const hangoutDestination = {
        name: props.destination,
        coordinates: {
            lat: props.destinationLatitude,
            lng: props.destinationLongitude
        }
    };

    // Center the map based on the average between the user and destination 
    const mapCenter = {
        lat: (userLocation.lat + hangoutDestination.coordinates.lat) / 2,
        lng: (userLocation.lng + hangoutDestination.coordinates.lng) / 2
    }

    // Directions Service and Render Methods
    let count = useRef(0)
    var delay = 0;
    const directionsCallback = (response, status) =>{
        setDirectionsRequested(true)
        if(status === "OK" && response != null && count.current < 1) {
            count.current += 1
            //console.log(`Success: ${JSON.stringify(response)}`)

            const duration = response.routes.at(0).legs.at(0).duration.text;
            const instructions = response.routes.at(0).legs.at(0).steps;
            setDirectionsResponse(response)
            props.handleCallback(duration, instructions)
        }
        else if (status === "OVER_QUERY_LIMIT") {
            console.log(status)
            delay++;
            setTimeout(function() {
                directionsCallback(response, status);
            }, delay * 1000);
        }
        else {
            count.current = 0
            console.log(`Failure: ${JSON.stringify(response)}`);
        }
    };

    const directionsServiceOptions = {
        origin: userLocation,
        destination: hangoutDestination.coordinates,
        travelMode: props.travelMode,
    };

    if (!isLoaded) {
        return <div>Loading Map Failed!</div>
    }
   
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
            key={props.mapKey}
        >   

            <MarkerF position={userLocation} 
                    title="My Location" 
                     label={{
                        text: "My Location",
                        color: 'black',
                        fontSize: '16px',
                        fontWeight: 'bold',
                     }} 
                     visible={!directionsRequested}
                     icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillOpacity: 1,
                        strokeWeight: 2,
                        fillColor: '#5384ED',
                        strokeColor: '#ffffff',
                        labelOrigin: {x: 0, y: -2}
                     }}>
            </MarkerF>
            <MarkerF position={hangoutDestination.coordinates} 
                     title={props.destination}
                     label={{
                        text: props.destination,
                        color:'black',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                     visible={!directionsRequested}
                     icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillOpacity: 1,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        strokeColor: '#ffffff',
                        labelOrigin: {x: 0, y: -2},
                     }}>
            </MarkerF>
            {
                props.travelMode &&
                 <DirectionsService
                 options={directionsServiceOptions}
                 callback={directionsCallback}
                />
            }
           
        
            
            {directionsResponse && 
            <DirectionsRenderer
                options={{
                    directions: directionsResponse
                }}
            />
            }
            
        </GoogleMap>
    )
};

export default Map;