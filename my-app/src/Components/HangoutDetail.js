import HangoutDetailCSS from '../Styles/HangoutDetail.module.css';
import Map from './Map';
import { useState, useCallback } from 'react';

function HangoutDetail(props) {

    // States for Google Maps information
    const [travelMode, setTravelMode] = useState("");
    const [travelModeChanged, setTravelModeChanged] = useState(0); // Forces map to rerender when changing travel mode based on key
    const [duration, setDuration] = useState("");
    const [instructions, setInstructions] = useState(null);

    if(props.details)
    {
        var detailsList = props.details.map(function(detail, index) {
            return(
                <li key={index} >
                    <span className={HangoutDetailCSS.Details}>{detail.title}</span>
                </li>
            )
        });
    }

    var closedDetail = props.closed === false ? "This location is currently open." : "This location is currently closed.";
    var locationDetail = props.location2 ? props.location + ", " + props.location2 : props.location;

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
            <div id={HangoutDetailCSS.Title}>{props.title}</div>
            <div id={HangoutDetailCSS.Location}>{locationDetail}</div>
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
                        >
                    </Map>
                </div>
            </div>
            <div className={HangoutDetailCSS.ExtraInformation}>
                <div>{closedDetail}</div>
                <div className={HangoutDetailCSS.Rating}>Rating: {props.rating}</div>
                <div className={HangoutDetailCSS.ContactInfo}>Contact Information: {props.phone}</div>
                <div id={HangoutDetailCSS.Description}>
                    { props.details &&
                        detailsList
                    }
                </div>
            </div>
            
        </div>
    );
}

export default HangoutDetail;