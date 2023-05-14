import React, { useState, useRef } from 'react';
import CardCSS from '../Styles/Card.module.css';
import { useState, useEffect } from 'react';
import { getNumLikes } from '../Services/LikesService';
import FavoriteDetails from './FavoriteDetails';

function Card(props) {
  const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;
  const [numberOfLikes, setNumberOfLikes] = useState(0);

 useEffect(() => {
    if(props.hangoutID) {
      getNumLikes(props.hangoutID).then((res) => {
        setNumberOfLikes(res)
      })
      .catch((error) => {
        console.log("Error fetching number of likes: ", error)
      })
    }
  }, [props.hangoutID])

  console.log(numberOfLikes)
  //To miles function
  function toMiles(meters) {
    return parseInt(meters) * 0.000621371;
  }


  return (
    <React.Fragment>
      <div className={`${CardCSS.Card} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}`}>
         <div className={CardCSS.HangoutDetail}>
             <FavoriteDetails className={CardCSS.HangoutDetail} {...props}/>
             </div>
        
          <img draggable='false' id={CardCSS.Image} src={props.image} alt="hangout-suggestion"></img>
          
          <div id={CardCSS.Title}>{props.title}</div>
            <div id={CardCSS.BottomContainer}>
            <div id={CardCSS.LocationContainer}>
              <div className={CardCSS.DetailLabel}>Location: </div>
              <div className={CardCSS.Detail}>{locationDetail}</div>

            </div>


            <div className={FavoriteModal.DetailsBox}>
              <div className={FavoriteModal.InfoBox}><span className={FavoriteModal.InfoLabel}>Category</span>
                <span className={FavoriteModal.InfoDetail}>{(toTitleCase(props.category))}</span>
              </div>

              <div className={FavoriteModal.InfoBox}><span className={FavoriteModal.InfoLabel}>Location</span>
                <span className={FavoriteModal.InfoDetail}>{props.location + ' \n' + props.location2}</span>
                <span className={FavoriteModal.InfoDetail}>{"This location is " + isOpen(props.closed)}</span>
                <div className={FavoriteModal.urlDiv}><label className={FavoriteModal.urlBox}>{props.url}</label>
                  <FontAwesomeIcon className={FavoriteModal.ClipboardIcon} icon={faClipboard} onClick={() => navigator.clipboard.writeText(props.url)} /></div>

              </div>

            </div>
            
            
          </div>
        </div>

    </React.Fragment>
  );
};

export default Card;

/*{showCardDetails ?
        <div className={CardCSS.DetailContainer}>
          <HangoutDetail
              className={CardCSS.DetailContainer} 
              title={props.title} 
              image={props.image} 
              distance={props.distance}
              phone={props.phone || "N/A"} 
              location={props.location}
              location2={props.location2}
              details={props.details}
              rating={props.rating}
              price={props.price}
              closed={props.closed}
              latitude={props.latitude}
              longitude={props.longitude}
              userLatitude={props.userLatitude}
              userLongitude={props.userLongitude}
            />
        </div>
        : null
      }*/ 