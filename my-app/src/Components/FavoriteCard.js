import FavoriteCardCSS from '../Styles/FavoriteCard.module.css';
import FavoriteDetails from './FavoriteDetails';

function FavoriteCard(props) {

    const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;

    return(
        <div className={FavoriteCardCSS.Container}>
            
            <img id={FavoriteCardCSS.Image} src={props.image} alt="hangout-suggestion"></img>
         
            <div id={FavoriteCardCSS.Title} >{props.title}</div>
          
            <div id={FavoriteCardCSS.BottomContainer}>

                <div id={FavoriteCardCSS.LocationContainer}>
                    <div className={FavoriteCardCSS.DetailLabel}>Location: </div>
                    <div className={FavoriteCardCSS.Detail}>{locationDetail}</div>
                </div>
                
                <div id={FavoriteCardCSS.DistanceContainer}>
                    <div className={FavoriteCardCSS.DetailLabel}>Distance: </div>
                    <div className={FavoriteCardCSS.Detail}>{props.distance.toFixed(2)} km away</div>
                </div>
                <FavoriteDetails {...props}/>

            </div>
            
            
            
        </div>
    )
}

export default FavoriteCard;