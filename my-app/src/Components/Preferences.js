import React, { useState, useEffect} from 'react';
import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { auth, db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import axios from 'axios';
import { defaultPreferences } from './Signup';

function Preferences(props) {
    //NOTE: Preferences should not be accessible unless user is logged in
    //NOTE: User category and location preferences should be set during the sign up process
    const userID = auth.currentUser?.uid

    //Used to handle the toggle buttonss, active buttons in the array of useState
    const [categories, setCategories] = useState([]);
    //To add limit between 1 < x < 3 categories
    const handleChange = ((val) => setCategories(val) ) ;
    const [userLocation, setUserLocation] = useState("");
    const [rangeLimit, setRangeLimit] = useState("");
    const [ratingLimit, setRatingLimit] = useState("");
    const [updatedPreferences, setUpdatedPreferences] = useState(false); // State for when the user updated the preferences successfully


    useEffect( () => {
        setCategories(Object.keys(defaultPreferences).filter(category => defaultPreferences[category]));
        setCategories(props.preferences.categories);
        setUserLocation(props.preferences.userLocation);
        setRangeLimit(props.preferences.rangeLimit);
        setRatingLimit(props.preferences.ratingLimit);
    }, [props])


    //Function that obtains the current geolocation and logs it as latitude and longitude 
    const geolocationClick = () => {
        //If geolocation is usable 
        if ("geolocation" in navigator) {
            //Log that location is usable
            console.log("Geolocation Function Available");
            //Obtain user location
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    alert("Location successfully updated!") 
                    var latitude = position.coords.latitude;

                    var longitude = position.coords.longitude;

                    setUserLocation(latitude + ", " + longitude);
    
                },
                function(error) {
                    alert ("Failed to obtain access to location. Check your access settings.")
                    console.error("Error#" + error.code + ", " + error.message);
                }
            );
          } else {
            console.log("Not Available");
          }
    };

    const getSearchLocation = async (e) => {
        // Get input values for location and region
        let locationInput = document.getElementById(PreferencesCSS.LocationInput);
        let regionInput = document.getElementById(PreferencesCSS.RegionInput);
        if(locationInput.value !== "" && regionInput.value !== "") {
            await axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${locationInput.value}&qq=city=${regionInput.value}&apiKey=${process.env.REACT_APP_GEO_API_KEY}`).then((res) => {
                const { lat, lng } = res.data.items[0].position
                setUserLocation(lat + ", " + lng);
            }).catch(error => {
                console.log(error)
                alert("Location could not be found")
            }) 
        }
        else {
            alert("Please enter a valid location and region")
        }
        
    }
    
    //Function that handles drop down functionality for location range preference
    const getLocationRange = (e) => {
        setRangeLimit(e.target.value);
    }

    //Function that handles drop down functionality for yelp rating preferences
    const getYelpRating = (e) => {
        setRatingLimit(e.target.value);
    }

    //Function that is called when the user wants to update their preferences
    //Information in preferencesMap is retrieved and uploaded to firestore using updateDoc
    const updateData = async (e)=> {

        if (categories.length > 0) {

            const userRef = doc(db, 'users', userID);
            try {
                await updateDoc (userRef, 
                    {
                        preferences: 
                        {
                            categories, 
                            userLocation,
                            rangeLimit,
                            ratingLimit
                        }
                    })
                    setUpdatedPreferences(true)
                    setTimeout(() => {
                        setUpdatedPreferences(false)
                    }, 2000)
            }
            catch (error) {
                alert("Error updating preferences! Please try again...")
                console.log(`Error saving user preferences: ${error}`)
                setUpdatedPreferences(false)
            }
        }
        else {
            alert("Must select at least one category")
        }


    }
    /*M100,150 165,180 245, 40 stroke: 250/250*/
    return (

        <div className = {PreferencesCSS.PreferencesContainer}>

            <div className = {PreferencesCSS.PreferencesTitle}> Your User Preferences </div>
            <br></br>

            <div className = {PreferencesCSS.PreferencesHeader}>
                Search Location:
            </div>

            <div className = {PreferencesCSS.PreferencesButtons}>
                <Button variant = "outline-dark" size = "sm" onClick = {geolocationClick} className = {PreferencesCSS.PreferencesButtons}> 
                    My Location
                </Button>
            </div>

            <div className={PreferencesCSS.Text}>or</div>

            <div className={PreferencesCSS.SearchBar}>
                <input id={PreferencesCSS.LocationInput} type='search' placeholder='Enter a location'></input>
                <input id={PreferencesCSS.RegionInput}placeholder='Region'></input>
                <button id={PreferencesCSS.SearchButton} onClick={getSearchLocation}></button>
            </div>

            <div id={updatedPreferences ? PreferencesCSS.ShowShadowLayer : PreferencesCSS.HideShadowLayer} />
            {
                updatedPreferences ?
                <div id={PreferencesCSS.PopoverContainer}>
                   <div id={PreferencesCSS.PopoverTitle}>Changes Saved!</div>
                   <div id={PreferencesCSS.CheckmarkContainer}>
                        <svg width="310" height="310">
                            <path id={PreferencesCSS.check} d="M60,120 125,180 400, -10"/>
                        </svg>  
                   </div>     
                </div>
                :
                null
            }
            
        <div className = {PreferencesCSS.PreferencesHeader}>
                Filter Preferences:
         </div>


         <div className = {PreferencesCSS.PreferencesForms} >
              <form onClick = {getLocationRange} id = "locationForm" > 
                   <label>
                     Location Range:&nbsp;
                        <select value={rangeLimit} onChange={getLocationRange}>
                         <option value="0"> No limit </option>
                         <option value="1">Less than 1 mile</option>
                         <option value="5"> Less than 5 miles</option>
                         <option value="10">Less than 10 miles</option>
                         <option value ="15">Less than 15 miles</option>
                     </select>
                      
                   </label>
                </form>

            <br></br>
             <form onClick = {getYelpRating} id = "ratingForm">
                 <label>
                    Yelp Rating:&nbsp;
                     <select value={ratingLimit} onChange={getYelpRating}>
                         <option value="-1"> No filter </option>
                         <option value="4"> 4+ Stars</option>
                         <option value="3"> 3+ Stars</option>
                         <option value="2"> 2+ Stars</option>
                         <option value="1"> 1+ Stars</option>
                        </select>        
                    </label>
                </form>
 

                <br></br>


            </div>

            <br></br>
            <div className = {PreferencesCSS.PreferencesHeader}>
            Filter Categories:
            </div>

            <div className= {PreferencesCSS.PreferencesSwitches}>
            <br></br>

            <ToggleButtonGroup type="checkbox" value={categories} onChange={handleChange}> 
                <ToggleButton variant = "outline-warning" id="restaurants" value={"restaurants"} className = {PreferencesCSS.customButton} >
                    Restaurants
                </ToggleButton>
                
                &nbsp;&nbsp;&nbsp;
                <ToggleButton variant = "outline-warning" id="theaters" value={"theaters" } className = {PreferencesCSS.customButton}>
                    Theaters
                </ToggleButton>
                &nbsp;&nbsp;&nbsp;
         
                <ToggleButton variant = "outline-warning" id="karaoke" value={"karaoke"} className = {PreferencesCSS.customButton}>
                    Karaoke
                </ToggleButton>

                &nbsp;&nbsp;&nbsp;
                <ToggleButton variant = "outline-warning" id="clubs" value={"clubs" } className = {PreferencesCSS.customButton}>
                    Clubs
                </ToggleButton>
            </ToggleButtonGroup>
            </div>

            <br></br>
            <div className = {PreferencesCSS.PreferencesButtons}>
            <Button className={PreferencesCSS.SaveButton} variant = "outline-dark" size = "sm" onClick = {updateData} >
                    Save Preferences
             </Button> 
            </div>
            <br></br>
        </div>
        

    );
}



export default Preferences;