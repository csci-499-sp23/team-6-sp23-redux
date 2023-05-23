import FavoriteCardCSS from '../Styles/FavoriteCard.module.css';
import HangoutDetails from './HangoutDetails';
import DeleteAlert from './SubComponents/DeleteAlert';
import { auth } from '../firebase';
import { arrayRemove, doc, deleteField, getFirestore, getDoc, updateDoc } from "firebase/firestore";

function FavoriteCard(props) {

    const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;

    //Delete hangout function, requires category and hangout ID to be passed to it
    const deleteHangout = async (category, index, isMostRecent, isCategory) => {
        const db = getFirestore();
        const userID= auth.currentUser?.uid
        const docRef = doc(db, "users", userID)
        const docSnap = await getDoc(docRef);
        const favoriteCategory = `favorites.${category}`
        const mostRecent = 'mostRecentFavorites'
        const favoriteCategoryLength = docSnap.data().favorites[category].length
     
        let hangoutObj;

        if(isMostRecent) {
            hangoutObj = docSnap.data().mostRecentFavorites[index]
        }
        else if(isCategory) {
            hangoutObj = docSnap.data().favorites[category][index]
        }

        const hangoutRef = doc(db, 'hangouts', hangoutObj.id);
        const likedUsers = 'likedUsers'


        //checks if this is the last hangout in the category
        if(favoriteCategoryLength === 1 ) {     
            await updateDoc(docRef, {
                [favoriteCategory]: deleteField(),
                [mostRecent]: arrayRemove(hangoutObj)
            })

            await updateDoc(hangoutRef, {
                [likedUsers]: arrayRemove(userID)
              });
        }
        else {
            await updateDoc(docRef, {
                [favoriteCategory]: arrayRemove(hangoutObj), 
                [mostRecent]: arrayRemove(hangoutObj)                  
            })

            await updateDoc(hangoutRef, {
                [likedUsers]: arrayRemove(userID)
              });
        }

    };

    return(
        <div className={`${props.style} ${FavoriteCardCSS.Container}`}>
            
            <div className={FavoriteCardCSS.FavoriteModal}>
                <HangoutDetails className={FavoriteCardCSS.FavoriteModal} {...props} hangoutID={props.id}/>
            </div>

            <div id={FavoriteCardCSS.CardHeader}>
                <div className={FavoriteCardCSS.Spacer} /> 
                <div id={FavoriteCardCSS.Title}>{props.title}</div>
                <DeleteAlert deleteHangout={deleteHangout}
                             title={props.title} category={props.category} index={props.index} 
                             isMostRecent={props.isMostRecent} isCategory={props.isCategory}
                             style={FavoriteCardCSS.DeleteAlert}>
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