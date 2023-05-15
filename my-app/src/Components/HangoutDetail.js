import HangoutDetailCSS from '../Styles/HangoutDetail.module.css';
import Map from './Map';
import { useState, useCallback } from 'react';

function HangoutDetail(props) {

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
        <div className={HangoutDetailCSS.Container}>
            <div id={HangoutDetailCSS.DescriptionContainer}>
                <img id={HangoutDetailCSS.Image} src={props.image} alt="hangout-suggestion"></img>
                <div className={HangoutDetailCSS.HangoutDestinationMap}>
                    <div id={HangoutDetailCSS.MapDetailsContainer}>
                        <button className={HangoutDetailCSS.WalkingButton} value={"WALKING"} onClick={pickTravelMode}>Travel</button>
                        <button className={HangoutDetailCSS.TransitButton} value={"TRANSIT"} onClick={pickTravelMode}>Travel</button>
                        <button className={HangoutDetailCSS.BicyclingButton} value={"BICYCLING"} onClick={pickTravelMode}>Travel</button>
                        <button className={HangoutDetailCSS.DrivingButton} value={"DRIVING"} onClick={pickTravelMode}>Travel</button>
                        {duration && instructions &&
                        <div>
                            <div className={HangoutDetailCSS.MapDuration}> Travel Time: {duration} </div>
                            {instructions.map(function(data, index){
                                // removes any parsed html code
                                var instruction = data.instructions.replace(/<\/?[^>]+>/gi, '')
                                if(data.transit){
                                    return(
                                        <div key={index} className={HangoutDetailCSS.MapInstructions}>{index+1}: {data.transit.line.short_name} {instruction}</div>
                                    )
                                }
                                else {
                                    return(
                                        <div key={index} className={HangoutDetailCSS.MapInstructions}>{index+1}: {instruction}</div>
                                    )
                                }
                            })}
                        </div>
                        }
                    </div>
                   
                    <Map destination={props.title} 
                        destinationLatitude={props.latitude} 
                        destinationLongitude={props.longitude}
                        travelMode={travelMode}
                        mapKey={travelModeChanged}
                        durationDetail={duration}
                        handleCallback={mapCallBack}
                        userLatitude={props.userLatitude}
                        userLongitude={props.userLongitude}
                        >
                    </Map>
                </div>
            </div>
            
        </div>
    );
}

export default HangoutDetail;