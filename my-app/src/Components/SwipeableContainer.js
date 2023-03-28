import SwipeableContainerCSS from '../Styles/SwipeableContainer.module.css';
import HangoutDetail from './HangoutDetail';

function SwipeableContainer(props) {

    return(
        <div>
            <div className={SwipeableContainerCSS.Container}>
                <img id={SwipeableContainerCSS.Image} src={props.image} alt="hangout-suggestion"></img>
                <div id={SwipeableContainerCSS.Title}>{props.title}</div>
                <div id={SwipeableContainerCSS.Location}>Location: {props.location}, {props.location2}</div>
                <div id={SwipeableContainerCSS.Distance}>Distance: {props.distance.toFixed(2)} km away</div>
            </div>

            <div className={SwipeableContainerCSS.DetailContainer}>
                <HangoutDetail
                    className={SwipeableContainerCSS.DetailContainer} 
                    key={props.index} 
                    title={props.title} 
                    image={props.image} 
                    distance={props.distance}
                    phone={props.phone || "N/A"} 
                    location={props.location}
                    location2={props.location2}
                    details={props.details}
                    rating={props.rating}
                    />
            </div>
            
        </div>
    );    
}

export default SwipeableContainer;