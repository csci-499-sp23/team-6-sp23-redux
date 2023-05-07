import Button from 'react-bootstrap/Button';
import FavoriteCardCSS from '../Styles/FavoriteCard.module.css';
import FavoriteDetails from './FavoriteDetails';
import { auth } from '../firebase';
import { arrayRemove, doc, deleteField, getFirestore, getDoc, updateDoc } from "firebase/firestore";

function FavoriteCard(props) {

    const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;
        //Delete hangout function, requires category and hangout ID to be passed to it
        const deleteHangout = async (category,hangoutID) => {
            //console.log(auth.currentUser?.uid)
            //console.log(hangoutID)
            //console.log(category)
    
            const db = getFirestore();
    
            const userID= auth.currentUser?.uid
            
            const docRef = doc(db, "users", userID)
    
            const docSnap = await getDoc(docRef);
    
            console.log(docSnap.data().favorites[category][0]);
    
            const hangoutObj = docSnap.data().favorites[category][0]  
            
            var delCatorHangout = arrayRemove(hangoutObj);
            
            //checks if this is the last hangout in the category
            if(docSnap.data().favorites[category].length === 1 ){
                
                delCatorHangout = deleteField()
            }
             
            await updateDoc(docRef, {
                //[`favorites.${category}`]: arrayRemove(hangoutObj)
                [`favorites.${category}`]: delCatorHangout
                
            })
            
    
            //db.collection('users').doc(auth.currentUser?.uid)
        
        };

        //To miles function
    function toMiles(meters)
    {
     return parseInt(meters) * 0.000621371;
    }
        
    

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
                    <div className={FavoriteCardCSS.Detail}>{toMiles(props.distance).toFixed(2)} miles away</div>
                    <div className={FavoriteCardCSS.FavoriteModal}>
                    <FavoriteDetails className={FavoriteCardCSS.FavoriteModal} {...props}/>
                    <Button size="sm" onClick={() => deleteHangout(props.category,props.id)} >Delete</Button></div>
                </div>
                
                

            </div>
            
            
            
            
        </div>
    )
}

export default FavoriteCard;