import React, { useState, useEffect} from 'react';
import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { auth, db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import axios from 'axios';

function Preferences(props) {
    //NOTE: Preferences should not be accessible unless user is logged in
    //NOTE: User category and location preferences should be set during the sign up process
    const userID = auth.currentUser?.uid
    const username = auth.currentUser?.displayName;

    //Used to handle the toggle buttonss, active buttons in the array of useState
    //const [categories, setCategories] = useState([]);
    //To add limit between 1 < x < 3 categories
    const [userLocation, setUserLocation] = useState("");
    const [rangeLimit, setRangeLimit] = useState("");
    const [ratingLimit, setRatingLimit] = useState("");
    const [updatedPreferences, setUpdatedPreferences] = useState(false); // State for when the user updated the preferences successfully
    const buttonVariant = "outline-info"

    // Enum for category values
    const Categories = Object.freeze({
        Restaurant: "restaurants",
        Cafe: "cafes",
        Game: "games",
        Shopping: "shopping",
        Spa: "spa",
        Bowling: "bowling",
        Karaoke: "karaoke",
        Bar: "bars",
        Club: "clubs",
        Billiards: "billiards",
        Theater: "theaters",
        Zoo: "zoo",
        Amusement: "amusement parks",
        Park: "parks",
        Swimming: "beach and pool"
    })

    const [categoriesMap, setCategoriesMap] = useState({
        "restaurants": false,
        "cafes": false,
        "games": false,
        "shopping": false,
        "spa": false,
        "bowling": false,
        "karaoke": false,
        "bars": false,
        "clubs": false,
        "billiards": false,
        "theaters": false,
        "zoo": false,
        "amusement parks": false,
        "parks": false,
        "beach and pool": false
    })

    
    useEffect( () => {
        setUserLocation(props.preferences.userLocation);
        setRangeLimit(props.preferences.rangeLimit);
        setRatingLimit(props.preferences.ratingLimit);

        if(props.preferences.categories) {
            props.preferences.categories.forEach((category) => {
                categoriesMap[category] = true
            })
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    alert("Location recorded! Remember to save preferences.") 
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
            await axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${locationInput.value}&apiKey=${process.env.REACT_APP_GEO_API_KEY}`).then((res) => {
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

    const toggleButton = (e) => {
        let category = e.target.value
        assignCategory(category)
    }

    // Helper Function
    function assignCategory(category) {
        switch (category) {
            case Categories.Restaurant:
                setCategoriesMap({...categoriesMap, restaurants: !categoriesMap[category]})
                break
            case Categories.Cafe:
                setCategoriesMap({...categoriesMap, cafes: !categoriesMap[category]})
                break
            
            case Categories.Game:
                setCategoriesMap({...categoriesMap, games: !categoriesMap[category]})
                break
            
            case Categories.Shopping:
                setCategoriesMap({...categoriesMap, shopping: !categoriesMap[category]})
                break
            case Categories.Spa:
                setCategoriesMap({...categoriesMap, spa: !categoriesMap[category]})
                break
            case Categories.Bowling:
                setCategoriesMap({...categoriesMap, bowling: !categoriesMap[category]})
                break
            case Categories.Karaoke:
                setCategoriesMap({...categoriesMap, karaoke: !categoriesMap[category]})
                break
            
            case Categories.Bar:
                setCategoriesMap({...categoriesMap, bars: !categoriesMap[category]})
                break
            
            case Categories.Club:
                setCategoriesMap({...categoriesMap, clubs: !categoriesMap[category]})
                break
            case Categories.Billiards:
                setCategoriesMap({...categoriesMap, billiards: !categoriesMap[category]})
                break
            case Categories.Theater:
                setCategoriesMap({...categoriesMap, theaters: !categoriesMap[category]})
                break
            case Categories.Zoo:
                setCategoriesMap({...categoriesMap, zoo: !categoriesMap[category]})
                break
            
            case Categories.Amusement:
                setCategoriesMap({...categoriesMap, "amusement parks": !categoriesMap[category]})
                break
            
            case Categories.Park:
                setCategoriesMap({...categoriesMap, parks: !categoriesMap[category]})
                break
            case Categories.Swimming:
                setCategoriesMap({...categoriesMap, "beach and pool": !categoriesMap[category]})
                break
            default:
                console.log("Default")
                break
            }
    }
  
    //Function that is called when the user wants to update their preferences
    //Information in preferencesMap is retrieved and uploaded to firestore using updateDoc
    const updateData = async (e)=> {
        // Bool used to check whether there is at least one category selected
        var categories = []
        for(let category of Object.keys(categoriesMap)){
            if(categoriesMap[category]) {
                categories.push(category)
            }
        }
        console.log(categories)
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
                    }, 1500)
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

            <div className = {PreferencesCSS.PreferencesTitle}> {username}'s Preferences </div>

            <div className={PreferencesCSS.HeaderText}>Location</div>

            <div className={PreferencesCSS.SearchBar} >
                <button id={PreferencesCSS.SearchButton} onClick={getSearchLocation}></button>
                <input id={PreferencesCSS.LocationInput} className={PreferencesCSS.SearchBarFrame} type='search' placeholder='Search a location'></input>
                <button id={PreferencesCSS.GeoLocatorButton} onClick={geolocationClick}></button>
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
            
            <div className = {PreferencesCSS.HeaderText}>Location Range</div>
              <form onClick = {getLocationRange} /*id = "locationForm"*/> 
                   <label className={PreferencesCSS.DropdownLabel}>
                        <select value={rangeLimit} onChange={getLocationRange} className={PreferencesCSS.DropdownSelectFrame}>
                         <option value="0"> No Limit </option>
                         <option value="1">Less than 1 mile</option>
                         <option value="5"> Less than 5 miles</option>
                         <option value="10">Less than 10 miles</option>
                         <option value ="15">Less than 15 miles</option>
                     </select>
                      
                   </label>
                </form>

            <div className = {PreferencesCSS.HeaderText}>Yelp Rating</div>
             <form onClick = {getYelpRating} id = "ratingForm">
                 <label className={PreferencesCSS.DropdownLabel}>
                     <select value={ratingLimit} onChange={getYelpRating} className={PreferencesCSS.DropdownSelectFrame}>
                         <option value="0"> No Filter </option>
                         <option value="4.5"> 4.5+ Stars</option>
                         <option value="4"> 4+ Stars</option>
                         <option value="3.5"> 3.5+ Stars</option>
                         <option value="3"> 3+ Stars</option>
                        </select>        
                    </label>
                </form>

            <div id={PreferencesCSS.CategoriesHeader}>Category Filters</div>
            <br/>
            <div className= {PreferencesCSS.PreferencesSwitches}>

                <div className={PreferencesCSS.ButtonGroup}>
                    <button value={Categories.Restaurant} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Restaurant] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.FirstButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.FirstButton}`} >
                        Restaurants
                    </button>

                    <button value={Categories.Cafe} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Cafe] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Cafes
                    </button>

                    <button value={Categories.Game} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Game] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Games
                    </button>

                    <button value={Categories.Shopping} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Shopping] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Shopping
                    </button>

                    <button value={Categories.Spa} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Spa] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.LastButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.LastButton}`} >
                        Spas
                    </button>
                </div>

                <div className={PreferencesCSS.ButtonGroup}>
                    <button value={Categories.Bowling} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Bowling] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.FirstButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.FirstButton}`} >
                        Bowling
                    </button>

                    <button value={Categories.Karaoke} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Karaoke] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Karaoke
                    </button>

                    <button value={Categories.Bar} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Bar] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Bars
                    </button>

                    <button value={Categories.Club} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Club] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Clubs
                    </button>

                    <button value={Categories.Billiards} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Billiards] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.LastButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.LastButton}`} >
                        Billiards
                    </button>
                </div>

                <div className={PreferencesCSS.ButtonGroup}>
                    <button value={Categories.Theater} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Theater] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.FirstButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.FirstButton}`} >
                        Theaters
                    </button>

                    <button value={Categories.Zoo} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Zoo] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Zoos
                    </button>

                    <button value={Categories.Amusement} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Amusement] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Theme Park
                    </button>

                    <button value={Categories.Park} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Park] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        Parks
                    </button>

                    <button value={Categories.Swimming} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Swimming] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.LastButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.LastButton}`} >
                        Swimming
                    </button>
                </div>
            </div>
            <br></br>

            <div id={PreferencesCSS.SaveButtonContainer}>
            <Button id={PreferencesCSS.SaveButton} variant={buttonVariant} size = "sm" onClick = {updateData} >
                    Save 
             </Button> 
            </div>
            <br></br>
        </div>
        

    );
}



export default Preferences;