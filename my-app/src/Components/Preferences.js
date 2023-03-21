import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';

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
    return (
        
        <div className = {PreferencesCSS.PreferencesContainer}>
            <div className = {PreferencesCSS.PreferencesTitle}> Your User Preferences</div>
            <br></br>
            <div className = {PreferencesCSS.PreferencesHeader}>
                Location:
            </div>

            <div className = {PreferencesCSS.PreferencesButtons}>
                <Button variant = "outline-dark" size = "sm" onClick = {geolocationClick}> 
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
                        Location Range:
                        <select>
                            <option value= "No limit"> No limit </option>
                            <option value = "5 miles"> Less than 5 miles</option>
                            <option value = "10 miles">Less than 10 miles</option>
                        </select>
                        
                    </label>
                </form>

                <form>
                    <label>
                        Yelp Rating 
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

                <Button variant = "outline-dark" size = "sm" >
                    Update Preferences
                </Button> 

            </div>

        </div>
        
    );
}



export default Preferences;