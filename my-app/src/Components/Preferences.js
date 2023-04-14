import React, { useState, useEffect} from 'react';
import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { auth, db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";


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


    useEffect( () => {
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

            await updateDoc (userRef, 
                {
                    preferences: 
                    {
                        categories, 
                        userLocation,
                        rangeLimit,
                        ratingLimit
                    }
                });
        }
        else {
            alert("Must select at least one category")
        }


    }



    return (

        <div className = {PreferencesCSS.PreferencesContainer}>

            <div className = {PreferencesCSS.PreferencesTitle}> Your User Preferences </div>
            <br></br>

            <div className = {PreferencesCSS.PreferencesHeader}>
                Location:
            </div>

            <div className = {PreferencesCSS.PreferencesButtons}>
                <Button variant = "outline-dark" size = "sm" onClick = {geolocationClick} className = {PreferencesCSS.PreferencesButtons}> 
                Update User Location
                </Button>
            </div>

            <br></br>

        <div className = {PreferencesCSS.PreferencesHeader}>
                Preferences:
         </div>


         <div className = {PreferencesCSS.PreferencesForms} >
              <form onClick = {getLocationRange} id = "locationForm" > 
                   <label>
                     Location Range:&nbsp;
                        <select value={rangeLimit}>
                         <option value="No limit" > No limit </option>
                         <option value="5 miles"> Less than 5 miles</option>
                         <option value="10 miles">Less than 10 miles</option>
                     </select>
                      
                   </label>
                </form>

            <br></br>
             <form onClick = {getYelpRating} id = "ratingForm">
                 <label>
                    Yelp Rating:&nbsp;
                     <select value={ratingLimit}>
                         <option value="No limit"> No filter </option>
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
            Filtered Categories:
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
            <Button variant = "outline-dark" size = "sm" onClick = {updateData} >
                    Update Preferences
             </Button> 
            </div>
        </div>
        

    );
}



export default Preferences;