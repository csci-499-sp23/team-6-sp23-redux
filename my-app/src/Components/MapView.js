import MapViewCSS from '../Styles/MapView.module.css';
import Map from './Map';
import { useState, useCallback } from 'react';

function MapView(props) {

    // States for Google Maps information
    const [travelMode, setTravelMode] = useState("");
    const [travelModeChanged, setTravelModeChanged] = useState(0); // Forces map to rerender when changing travel mode based on key
    const [duration, setDuration] = useState("");
    const [instructions, setInstructions] = useState(null);

    const pickTravelMode = (e) => {
        setTravelModeChanged(travelModeChanged + 1) // causes the map to rerender with the key property
        setTravelMode(e.target.value)
    }

    // Map Callback Function(s)
    const mapCallBack = useCallback((durationData, instructionsData) => {
        if(durationData != null && instructionsData!= null) {
            setDuration(durationData)
            setInstructions(instructionsData)
        }
        console.log(instructionsData)
    }, [setDuration, setInstructions]);

    return(
        <div className={MapViewCSS.Container}>
                
                    <div id={MapViewCSS.MapDetailsContainer}>
                        <div className={MapViewCSS.TransitOptions}>
                            <button className={MapViewCSS.WalkingButton} value={"WALKING"} onClick={pickTravelMode}>Travel</button>
                            <button className={MapViewCSS.TransitButton} value={"TRANSIT"} onClick={pickTravelMode}>Travel</button>
                            <button className={MapViewCSS.BicyclingButton} value={"BICYCLING"} onClick={pickTravelMode}>Travel</button>
                            <button className={MapViewCSS.DrivingButton} value={"DRIVING"} onClick={pickTravelMode}>Travel</button>
                        </div>
                        
                        {duration && instructions &&
                        <div>
                            <div className={MapViewCSS.MapDuration}> Travel Time: {duration} </div>
                            {instructions.map(function(data, index){
                                // removes any parsed html code
                                var instruction = data.instructions.replace(/<\/?[^>]+>/gi, '')
                                if(data.transit){
                                    return(
                                        <div key={index} className={MapViewCSS.MapInstructions}>{index+1}: {data.transit.line.short_name} {instruction}</div>
                                    )
                                }
                                else {
                                    return(
                                        <div key={index} className={MapViewCSS.MapInstructions}>{index+1}: {instruction}</div>
                                    )
                                }
                            })}
                        </div>
                        }
                    </div>

                    <div id={MapViewCSS.Map}>
                        <Map destination={props.title} 
                            destinationLatitude={props.latitude} 
                            destinationLongitude={props.longitude}
                            travelMode={travelMode}
                            mapKey={travelModeChanged}
                            durationDetail={duration}
                            handleCallback={mapCallBack}
                            userLatitude={props.userLatitude}
                            userLongitude={props.userLongitude}
                        />
                    </div>
        </div>
    );
}

export default MapView;