import React, { useState, useEffect} from 'react';
import PreferencesCSS from '../Styles/Preferences.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Alert from './SubComponents/Alert';
import { auth, db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import axios from 'axios';
import {categoryList} from '../Exports/categoryList.js';

function Preferences(props) {
    //NOTE: Preferences should not be accessible unless user is logged in
    //NOTE: User category and location preferences should be set during the sign up process
    const userID = auth.currentUser?.uid
    const username = auth.currentUser?.displayName;

    
    //To add limit between 1 < x < 3 categories
    const [userLocation, setUserLocation] = useState("");
    const [rangeLimit, setRangeLimit] = useState("");
    const [ratingLimit, setRatingLimit] = useState("");
    const [updatedPreferences, setUpdatedPreferences] = useState(false); // State for when the user updated the preferences successfully
    const [showAlert, setShowAlert] = useState({
        show: false,
        title: "",
        message: ""
    });
    const [isHovered, setIsHovered] = useState(null);

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

    //Used to handle the toggle buttonss, active buttons in the array of useState
    const [categoriesMap, setCategoriesMap] = useState(() => {
        let map = {}
        categoryList.forEach((category) => {
            map[category] = false
        })
        return map
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

    // Adds an event listen for the search location field 
    useEffect(() => {
        let searchLocationInput = document.getElementById(`${PreferencesCSS.LocationInput}`);

        if(searchLocationInput) {
            searchLocationInput.addEventListener("keydown", function(e) {
                // Checks to see if the user pressed enter after typing input into the field
                if (e.code === "Enter") {
                    getSearchLocation()
                }
            });
        }
    }, [])

    //Function that obtains the current geolocation and logs it as latitude and longitude 
    const geolocationClick = () => {
        //If geolocation is usable 
        if ("geolocation" in navigator) {
            //Log that location is usable
            console.log("Geolocation Function Available");
            //Obtain user location
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var latitude = position.coords.latitude;

                    var longitude = position.coords.longitude;
                    setUserLocation(latitude + ", " + longitude);
                    setShowAlert({show: true, title: "Current Location", message: "Location recorded! Remember to save preferences."})
                },
                function(error) {
                    setShowAlert({show: true, title: "Current Location", message: "Failed to obtain access to location. Check your access settings."})
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
        if(locationInput.value !== "") {
            await axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${locationInput.value}&apiKey=${process.env.REACT_APP_GEO_API_KEY}`).then((res) => {
                const { lat, lng } = res.data.items[0].position
                setUserLocation(lat + ", " + lng);
                setShowAlert({show: true, title: `Location: ${locationInput.value}`, message: "Location recorded! Remember to save preferences."})
            }).catch(error => {
                console.log(error)
                setShowAlert({show: true, title: `Location: ${locationInput.value}`, message: "Location could not be found!"})
            }) 
        }
        else {
            setShowAlert({show: true, title: "Invalid Location", message: "Please enter a valid location."})
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

    // Function used to toggle the category button and update the map accordingly
    const toggleButton = (e) => {
        let category = e.currentTarget.value
        setCategoriesMap({...categoriesMap ,[category]: !categoriesMap[category]})
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

    const handleMouseOver = (e) => {
        switch(e.currentTarget.id) {
            case "1":
                setIsHovered(1)
                break
            case "2":
                setIsHovered(2)
                break
            default:
                break
        }
    }

    return (

        <div className = {PreferencesCSS.PreferencesContainer}>

            <div className = {PreferencesCSS.PreferencesTitle}> {username}'s Preferences </div>

            <div className={PreferencesCSS.HeaderText}>Location</div>

            <div className={PreferencesCSS.SearchBar} >
                <input id={PreferencesCSS.LocationInput} className={PreferencesCSS.SearchBarFrame} type='search' placeholder='Search a Location'></input>
                <div id={1} className={PreferencesCSS.SearchIcon} onMouseOver={handleMouseOver} onMouseOut={() => setIsHovered(null)}></div>
                <div className={PreferencesCSS.Separator}></div>
                <button id={2} className={PreferencesCSS.GeoLocatorButton} onClick={geolocationClick} 
                        onMouseOver={handleMouseOver} onMouseOut={() => setIsHovered(null)}></button>
                {isHovered && isHovered === 1 ? <div id={PreferencesCSS.SearchIdentifier}>Search Location</div> : null}
                {isHovered && isHovered === 2 ? <div id={PreferencesCSS.GeoLocatorIdentifier}>Current Location</div> : null}
            </div>

            {
                showAlert.show ? <Alert title={showAlert.title} message={showAlert.message} setShowAlert={setShowAlert}></Alert> : null
            }

            <div id={updatedPreferences ? PreferencesCSS.ShowShadowLayer : PreferencesCSS.HideShadowLayer} />
            {
                updatedPreferences ?
                <div id={PreferencesCSS.PopoverContainer}>
                   <div id={PreferencesCSS.PopoverTitleContainer}><h4 id={PreferencesCSS.PopoverTitle}>Changes Saved!</h4></div>
                   <div id={PreferencesCSS.CheckmarkContainer}>
                        <svg width="100%" height="100%">
                            <path id={PreferencesCSS.check} d="M40,130 105,190 300, 0" pathLength={"1"}/>
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
                       <div className={PreferencesCSS.ButtonInfoContainer}> 
                            <img src = "Images/restaurant.png" alt = "restaurant-icon" className={ categoriesMap[Categories.Restaurant] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>
                            <div className={PreferencesCSS.ButtonText}>Restaurants</div> 
                       </div>
                    </button>

                    <button value={Categories.Cafe} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Cafe] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/cafe.png" alt = "cafe-icon" className={ categoriesMap[Categories.Cafe] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img> 
                            <div className={PreferencesCSS.ButtonText}>Cafes</div>
                        </div>
                    </button>

                    <button value={Categories.Game} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Game] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/game.png" alt = "game-icon" className={ categoriesMap[Categories.Game] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img> 
                            <div className={PreferencesCSS.ButtonText}>Games</div>
                        </div>
                    </button>

                    <button value={Categories.Shopping} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Shopping] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/shopping.png" alt = "shopping-icon" className={ categoriesMap[Categories.Shopping] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img> 
                            <div className={PreferencesCSS.ButtonText}>Shopping</div>
                        </div>
                    </button>

                    <button value={Categories.Spa} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Spa] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.LastButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.LastButton}`} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/spa.png" alt = "spa-icon" className={ categoriesMap[Categories.Spa] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>   
                            <div className={PreferencesCSS.ButtonText}>Spas</div>
                        </div>
                    </button>
                </div>

                <div className={PreferencesCSS.ButtonGroup}>
                    <button value={Categories.Bowling} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Bowling] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.FirstButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.FirstButton}`} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/bowling.png" alt = "bowling-icon" className={ categoriesMap[Categories.Bowling] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>  
                            <div className={PreferencesCSS.ButtonText}>Bowling</div>
                        </div>
                    </button>

                    <button value={Categories.Karaoke} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Karaoke] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/karaoke.png" alt = "karaoke-icon" className={ categoriesMap[Categories.Karaoke] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>      
                            <div className={PreferencesCSS.ButtonText}>Karaoke</div>
                        </div>
                    </button>

                    <button value={Categories.Bar} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Bar] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                          <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/bar.png" alt = "baricon" className={ categoriesMap[Categories.Bar] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>    
                            <div className={PreferencesCSS.ButtonText}>Bars</div>
                          </div>
                    </button>

                    <button value={Categories.Club} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Club] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/club.png" alt = "club-icon" className={ categoriesMap[Categories.Club] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>    
                            <div className={PreferencesCSS.ButtonText}>Clubs</div>
                        </div>
                    </button>

                    <button value={Categories.Billiards} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Billiards] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.LastButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.LastButton}`} >
                         <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/pool.png" alt = "pool-icon" className={ categoriesMap[Categories.Billiards] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>                        
                            <div className={PreferencesCSS.ButtonText}>Billiards</div>
                         </div>
                    </button>
                </div>

                <div className={PreferencesCSS.ButtonGroup}>
                    <button value={Categories.Theater} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Theater] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.FirstButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.FirstButton}`} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/theater.png" alt = "theater-icon" className={ categoriesMap[Categories.Theater] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img> 
                            <div className={PreferencesCSS.ButtonText}>Theaters</div>
                        </div>
                    </button>

                    <button value={Categories.Zoo} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Zoo] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/zoo.png" alt = "zoo-icon" className={ categoriesMap[Categories.Zoo] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>       
                            <div className={PreferencesCSS.ButtonText}>Zoos</div>
                        </div>
                    </button>

                    <button value={Categories.Amusement} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Amusement] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/coaster.png" alt = "coaster-icon" className={ categoriesMap[Categories.Amusement] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>      
                            <div className={PreferencesCSS.ButtonText}>Amusement</div>
                         </div>
                    </button>

                    <button value={Categories.Park} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Park] ? PreferencesCSS.customButtonActive : PreferencesCSS.customButton} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/park.png" alt = "park-icon" className={ categoriesMap[Categories.Park] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>      
                            <div className={PreferencesCSS.ButtonText}>Parks</div>
                        </div>
                    </button>

                    <button value={Categories.Swimming} onClick={toggleButton} id={PreferencesCSS.ButtonInsets}
                    className={ categoriesMap[Categories.Swimming] ? `${PreferencesCSS.customButtonActive} ${PreferencesCSS.LastButton}` : `${PreferencesCSS.customButton} ${PreferencesCSS.LastButton}`} >
                        <div className={PreferencesCSS.ButtonInfoContainer}>
                            <img src = "Images/swimming.png" alt = "swimming-icon" className = { categoriesMap[Categories.Swimming] ? PreferencesCSS.customButtonActiveImage : PreferencesCSS.customButtonImage}></img>    
                            <div className={PreferencesCSS.ButtonText}>Swimming</div>
                        </div>
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