import React, {useRef} from 'react';
import CardCSS from '../Styles/Card.module.css';
import { useState, useEffect } from 'react';
import { getNumLikes } from '../Services/LikesService';
import HangoutDetails from './HangoutDetails';
import {toMiles} from './Exports/distanceConverters.js'

function Card(props) {
  const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const cardRef = useRef(null);

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

  const onPositionChange = () => {
    let i = setInterval(() => {
      if(cardRef.current){
        let width = cardRef.current.getBoundingClientRect().width
        let x = cardRef.current.getBoundingClientRect().x
        props.handleChangePositon(x, width)
      }
    }, 500)

    props.handleIntervalUpdate(i)
  }
  console.log(numberOfLikes)

  return (
    <React.Fragment>
      <div 
        ref={cardRef}
        draggable
        onDragStart={(e) => {
          e.preventDefault()
          onPositionChange()
        }}
      className={`${CardCSS.Card} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}`}>
        
          <img draggable='false' id={CardCSS.Image} src={props.image} alt="hangout-suggestion"></img>
          
          <div id={CardCSS.Title}>{props.title}</div>
            <div id={CardCSS.BottomContainer}>
             <div className={CardCSS.HangoutDetail}>
               <HangoutDetails className={CardCSS.HangoutDetail} {...props}/>
             </div>
            <div id={CardCSS.LocationContainer}>
              <div className={CardCSS.DetailLabel}>Location: </div>
              <div className={CardCSS.Detail}>{locationDetail}</div>

            </div>
            
            <div id={CardCSS.DistanceContainer}>
              <div className={CardCSS.DetailLabel}>Distance: </div>
              <div className={CardCSS.Detail}>{toMiles(props.distance).toFixed(2)} miles away</div>
            </div>
            
            
          </div>
        </div>

    </React.Fragment>
  );
};

export default Card;
