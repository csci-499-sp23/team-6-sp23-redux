import HomepageCSS from '../Styles/Homepage.module.css'
import { useState, useEffect } from 'react';
import SwipeableContainer from './SwipeableContainer';
import HangoutDetail from './HangoutDetail';
import { getHangoutLocations } from '../Services/HangoutService';

function Homepage() {

    const [isShown, setIsShown] = useState(false);
    const [showDetail, setShowDetail] = useState(`${HomepageCSS.HangoutDetailInvis}`);
    
    const [hangoutData, setHangoutData] = useState([]);

    useEffect( () => {
      getHangoutLocations().then(data => {
        setHangoutData(data);
        console.log(data);
      })
    }, []);


    const displayHangoutDetails = () => { 
      setShowDetail(`${HomepageCSS.HangoutDetailContainer}`);
    };


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
            hangoutData.map(function(hangoutData, index){
              return(
                <SwipeableContainer
                  className={HomepageCSS.HangoutContainer}
                  key={index}
                  index={index} 
                  title={hangoutData.name} 
                  image={hangoutData.image_url} 
                  distance={hangoutData.distance} 
                  location={hangoutData.location.display_address[0]}
                  location2={hangoutData.location.display_address[1]}
                  phone={hangoutData.display_phone}
                  rating={hangoutData.rating}
                  price={hangoutData.price}
                  details={hangoutData.categories}
                  />
              )
                
            })
          } 
                 
      </div>
    );
  }
  
  export default Homepage;