import React, { useState, useEffect} from 'react';
import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";


function Preferences() {

    //Use localStorage to keep track of current logged in user
    //NOTE: Preferences should not be accessible unless user is logged in
    const id = localStorage.getItem("userId");
    const userId = JSON.parse(id) != null ? JSON.parse(id) : "";


    //Used to handle the toggle buttonss, active buttons in the array of useState
    const [value, setValue] = useState([]);
    const handleChange = ((val) => setValue(val) ) ;

    const [userLocation, setUserLocation] = useState("");

    const [rangeLimit, setRangeLimit] = useState("");
    const [ratingLimit, setRatingLimit] = useState("");

    //Run retrievePreferences when page is loaded
    useEffect( () => {

        //Function that retrieves the user preferences from firestore
        //Sets the corresponding buttons to active based on preferences and sets preferencesMaps based on preexisting preferences
        const retrievePreferences = async (e) => {

            //Reference to the document for users based on the userID
            const userRef = doc(db, 'users', userId);
    
            try {
                //Use getDoc to load the document for user, and retrieve the preferences field
                await getDoc(userRef).then( (docData) => {
                    //Retrieve preferences for user location
                    setUserLocation(docData.data().preferences.userLocation);
                    
                    //Retrieve preferences for the dropdown settings
                    setRangeLimit(docData.data().preferences.rangeLimit);

                    setRatingLimit(docData.data().preferences.ratingLimit);
                    
                    //Retrieve categorical preferences
                    const loadedPrefs = docData.data().preferences.value;

                    //Information from preferences field is stored in preloadedPrefs, and is used to set the state of the active buttons
                    var preloadedPrefs = [];

                    //Since the preference field is stored as an object, use .entries to store the information in an array
                    const arr = Object.entries(loadedPrefs);

                    //Iterate through the array, each category will be an array with index 0 being the index in that 2d array and index 1 being the value
                    arr.forEach((category ) => {
                        preloadedPrefs.push(category[1]);
                    })


                    setValue (preloadedPrefs);

                }

                )
                

            }
            catch (error) {
                console.log("No such document!");
            }

        }

        retrievePreferences();

    }, [userId]);

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

        const userRef = doc(db, 'users', userId);

        await updateDoc (userRef, 
            {
                preferences: 
                {
                    value, 
                    userLocation,
                    rangeLimit,
                    ratingLimit
                }
            });

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


         <div className = {PreferencesCSS.PreferencesForms}>
              <form onClick = {getLocationRange} id = "locationForm"> 
                   <label>
                     Location Range:&nbsp;
                        <select>
                         <option value= "No limit" > No limit </option>
                         <option value = "5 miles"> Less than 5 miles</option>
                         <option value = "10 miles">Less than 10 miles</option>
                     </select>
                      
                   </label>
                </form>

            <br></br>
             <form onClick = {getYelpRating} id = "ratingForm">
                 <label>
                    Yelp Rating:&nbsp;
                     <select>
                         <option value= "No limit"> No filter </option>
                         <option value = "4"> 4+ Stars</option>
                         <option value = "3"> 3+ Stars</option>
                         <option value = "2"> 2+ Stars</option>
                         <option value = "1"> 1+ Stars</option>
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

            <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}> 
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