import React, {useRef} from 'react';
import CardCSS from '../Styles/Card.module.css';
import HangoutDetails from './HangoutDetails';
import {toMiles} from './Exports/distanceConverters.js'

function Card(props) {
  const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;
  const cardRef = useRef(null);

 

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
               <HangoutDetails className={CardCSS.HangoutDetail} {...props} hangoutID={props.itemID}/>
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
