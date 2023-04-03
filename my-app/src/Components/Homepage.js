import HomepageCSS from '../Styles/Homepage.module.css'
import { useState, useEffect } from 'react';
import SwipeableContainer from './SwipeableContainer';
//import { getHangoutLocations } from '../Services/HangoutService';
import HangoutDataModel from '../DataModels/HangoutDataModel';
import axios from 'axios';

function Homepage(props) {

    const [isShown, setIsShown] = useState(false);    
    const [hangoutData, setHangoutData] = useState([]);

    useEffect( () => {
      // Defining the Get Request Function
      async function getHangoutLocations() {
        try{
            const restaurants = await axios.get(`https://yelp-backend.netlify.app/.netlify/functions/search?location=${props.location}&term=restaurant`, {
              params: {
                _limit: 5
              }
            });
            const theaters = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=theater');
            const parks = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=park');
            const museums = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=museum');
            const clubs = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=club');
            const karaokes = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=karaoke');
            const arcades = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=arcade');
    
            // Combines all the promise requests into a single array
            const hangouts = await Promise.all([restaurants.data.businesses, 
                                                theaters.data.businesses, 
                                                parks.data.businesses, 
                                                museums.data.businesses,
                                                clubs.data.businesses,
                                                karaokes.data.businesses,
                                                arcades.data.businesses]);
            return [].concat.apply([], hangouts);
        }
        catch(error) {
            console.log(error);
            return [];
        }
    }

    // Calling the Get Request and mapping the data to the data model
      getHangoutLocations().then(data => {
        data.forEach(function(hangout){
          setHangoutData(arr => [...arr, new HangoutDataModel(hangout.id, hangout.name, hangout.location, hangout.distance, 
                                                            hangout.image_url, hangout.display_phone, hangout.rating, hangout.price, hangout.categories,
                                                            hangout.coordinates.longitude, hangout.coordinates.latitude)]);
        })
      })
    }, [props.location]);
    return (
      <div className={HomepageCSS.Homepage}>
          <div className={HomepageCSS.InfoButtonContainer} 
               onMouseEnter={() => setIsShown(true)}
               onMouseLeave={() => setIsShown(false)}>
            <img className={HomepageCSS.InfoButton} src="Images/info-button.png" alt="info"/>
            {
              isShown && 
              <div className={`${HomepageCSS.InfoTextContainer} ${HomepageCSS.bubbleBottomRight}`}>
                <li>Swipe Right to Save</li>
                <li>Swipe Left to Reject</li>
                <li>Click to View More Details</li>
              </div>
            }
          </div>
       
          { hangoutData.length > 0 &&
            hangoutData.map(function(data, index){
              return(
                <SwipeableContainer
                  className={HomepageCSS.HangoutContainer}
                  key={index}
                  index={index} 
                  title={data.title} 
                  image={data.image} 
                  distance={data.distance} 
                  location={data.location.display_address[0]}
                  location2={data.location.display_address[1]}
                  phone={data.phone_num}
                  rating={data.rating}
                  price={data.price}
                  details={data.details}
                  />
              )
                
            })
          } 
                 
      </div>
    );
  }
  
  export default Homepage;