import FavoriteCardCSS from '../Styles/FavoriteCard.module.css';
import FavoriteDetails from './FavoriteDetails';
import DeleteAlert from './SubComponents/DeleteAlert';
import { auth } from '../firebase';
import { arrayRemove, doc, deleteField, getFirestore, getDoc, updateDoc } from "firebase/firestore";

function FavoriteCard(props) {

    const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;
        //Delete hangout function, requires category and hangout ID to be passed to it
    const deleteHangout = async (category, index) => {
    
        const db = getFirestore();
        const userID= auth.currentUser?.uid
        const docRef = doc(db, "users", userID)
        const docSnap = await getDoc(docRef);
        const hangoutObj = docSnap.data().favorites[category][index]  
                        
            //checks if this is the last hangout in the category
        if(docSnap.data().favorites[category].length === 1 ){
                
            await updateDoc(docRef, {
                [`favorites.${category}`]: deleteField()
            })
        }
        else {
            await updateDoc(docRef, {
                [`favorites.${category}`]: arrayRemove(hangoutObj)                    
            })
        }
    };
        
    return(
        <div className={FavoriteCardCSS.Container}>
            
            <div className={FavoriteCardCSS.FavoriteModal}>
                <FavoriteDetails className={FavoriteCardCSS.FavoriteModal} {...props}/>
            </div>

            <div id={FavoriteCardCSS.CardHeader}>
                <div className={FavoriteCardCSS.Spacer} /> 
                <div id={FavoriteCardCSS.Title}>{props.title}</div>
                <DeleteAlert id={FavoriteCardCSS.DeleteAlert} deleteHangout={deleteHangout}
                              title={props.title} category={props.category} index={props.index} >
                </DeleteAlert> 
            </div>

            <img id={FavoriteCardCSS.Image} src={props.image} alt="hangout-suggestion"></img>
            
            <div id={FavoriteCardCSS.BottomContainer}>
                <div id={FavoriteCardCSS.LocationContainer}>
                    <div className={FavoriteCardCSS.Detail}>{locationDetail}</div>
                </div>
                
            </div> 
            
        </div>
    )
}

export default FavoriteCard;
 /*<button className={FavoriteCardCSS.DeleteCardButton} size="sm" 
                        onClick={() => <DeleteAlert deleteHangout={deleteHangout}></DeleteAlert> deleteHangout(props.category,props.index)} >
                        <div className={FavoriteCardCSS.DeleteButtonImage}></div>
                        </button>*/   