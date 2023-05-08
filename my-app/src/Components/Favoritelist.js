import FavoriteListCSS from '../Styles/Favoritelist.module.css';
import FavoriteCard from './FavoriteCard';
import { auth } from '../firebase';

function Favoritelist(props) {
    const user = auth.currentUser
    
    // Helper function used to capitalize the first letter of each word in a string 
    const toTitleCase = (phrase) => {
        return phrase
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
    
    
    const makeTable = () => {
        return props.favorites.sort(function(a,b) {
            if(a[0] < b[0]) { return -1; }
            if(a[0] > b[0]) { return 1; }
            return 0;
        })
        .map((favoritesMap, index) => {
            //We want the category for the first column of each row stored in favoritesMap[0]
            //favoritesMap[1] contains the array of hangouts for each category that will be placed in a 2nd column
                        return(
                           <tr key={index}>
                            <td key={index} id={FavoriteListCSS.CategoryName}>{toTitleCase(favoritesMap[0])}:</td>
                                <td>
                                <div className={FavoriteListCSS.FavoriteHangoutContainer}>
                                {
                                    //Table columns for each hangout
                                    favoritesMap[1].sort().map((hangout, index) => {
                                        return(  
                                            <div key={index} className={FavoriteListCSS.FavoriteCard}>
                                            {
                                                <FavoriteCard
                                                    key={index}
                                                    index={index}
                                                    title={hangout.name} 
                                                    image={hangout.image_url} 
                                                    distance={hangout.distance} 
                                                    location={hangout.location.display_address[0]}
                                                    location2={hangout.location.display_address[1]}
                                                    phone={hangout.display_phone}
                                                    category={hangout.category}
                                                    closed={hangout.is_closed}
                                                    details={hangout.details}
                                                    rating={hangout.rating}
                                                >
                                                </FavoriteCard>
                                            }
                                            </div>
                                           
                                        )
                                    }) // End of inner for each loop
                                }
                                </div>
                                </td>
                           </tr> 
                        )
        }) // End of first for each loop
    }

    

    return(
        <div className={FavoriteListCSS.FavoriteContainer}>
            <div className={FavoriteListCSS.FavoriteTitle}>{user?.displayName}'s Top Favorites</div>
            <div className={FavoriteListCSS.TableContainer}>
            <table className={FavoriteListCSS.FavoriteTable}>
                <tbody>
                    {props.favorites && makeTable()}
                </tbody>
            </table>
            </div>
        </div>
        
    );    
}


export default Favoritelist;
