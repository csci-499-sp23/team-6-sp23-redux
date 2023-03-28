import React, { useState } from 'react';
import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const geolocationClick = () => {
    //If geolocation is usable 
    if ("geolocation" in navigator) {
        //Log that location is usable
        console.log("Geolocation Function Available");
        //Obtain user location
        navigator.geolocation.getCurrentPosition(
            function(position) {
                alert("Location successfully updated!") 
                console.log(position);

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



function Preferences() {
    const [value, setValue] = useState([1, 2, 3, 4]);
    const handleChange = (val) => setValue(val);
    return (

        <div className = {PreferencesCSS.PreferencesContainer}>
            <div className = {PreferencesCSS.PreferencesTitle}> Your User Preferences</div>
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
              <form> 
                   <label>
                     Location Range:&nbsp;
                        <select>
                         <option value= "No limit"> No limit </option>
                         <option value = "5 miles"> Less than 5 miles</option>
                         <option value = "10 miles">Less than 10 miles</option>
                     </select>
                      
                   </label>
                </form>

            <br></br>
             <form>
                 <label>
                    Yelp Rating:&nbsp;
                     <select>
                         <option value= "No limit"> No filter </option>
                         <option value = "4 stars"> 4+ Stars</option>
                         <option value = "3 stars"> 3+ Stars</option>
                         <option value = "2 stars"> 2+ Stars</option>
                         <option value = "1 stars"> 1+ Stars</option>
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
                <ToggleButton variant = "outline-warning" id="tbg-btn-1" value={1} className = {PreferencesCSS.customButton}>
                    Restaurants
                </ToggleButton>
                
                &nbsp;&nbsp;&nbsp;
                <ToggleButton variant = "outline-warning" id="tbg-btn-2" value={2} className = {PreferencesCSS.customButton}>
                    Theatres
                </ToggleButton>
                &nbsp;&nbsp;&nbsp;
         
                <ToggleButton variant = "outline-warning" id="tbg-btn-3" value={3} className = {PreferencesCSS.customButton}>
                    Karaoke
                </ToggleButton>

                &nbsp;&nbsp;&nbsp;
                <ToggleButton variant = "outline-warning" id="tbg-btn-4" value={4} className = {PreferencesCSS.customButton}>
                    Clubs
                </ToggleButton>
            </ToggleButtonGroup>
            </div>

            <br></br>
            <div className = {PreferencesCSS.PreferencesButtons}>
            <Button variant = "outline-dark" size = "sm" >
                    Update Preferences
             </Button> 
            </div>
        </div>
        
    );
}



export default Preferences;