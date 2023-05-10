import FavoriteListCSS from '../Styles/Favoritelist.module.css';
import FavoriteCard from './FavoriteCard';
import { auth } from '../firebase';
import { useState } from 'react';

function Favoritelist(props) {
    const user = auth.currentUser
    const [dragging, setDragging] = useState(false); // Used to toggle whether the favorite card should be clickable or not while dragging

    // Helper function used to capitalize the first letter of each word in a string 
    const toTitleCase = (phrase) => {
        return phrase
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
    
    // Function that makes the scrollable rows draggable
    const slideRow = (selectedRow) => {
        console.log("entered")
        let slider = document.querySelector(`tbody:nth-child(1) tr:nth-child(${selectedRow}) div`)
        let mouseDown = false;
        let startX, scrollLeft;

        let startDragging = function (e) {
            e.preventDefault()
            mouseDown = true
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        let stopDragging = function (e) {
            e.preventDefault()
            mouseDown = false
            setDragging(false)
        };
        
        if(slider) {
            slider.addEventListener('mousemove', (e) => {
                e.preventDefault();
                if(!mouseDown) {return;}
                const x = e.pageX - slider.offsetLeft;
                const scroll = x - startX;
                slider.scrollLeft = scrollLeft - scroll;
                setDragging(true)
            })
            slider.addEventListener('mousedown', startDragging, false);
            slider.addEventListener('mouseup', stopDragging, false);
            slider.addEventListener('mouseleave', stopDragging, false);
            slider.addEventListener('click', (e) => {if(mouseDown) {e.preventDefault()}}, false)
        }
    }
    
    // Removes the added Event Listeners when exiting the row
    const deInitEventListener = (selectedRow) => {
        console.log("exited")
        let slider = document.querySelector(`tbody:nth-child(1) tr:nth-child(${selectedRow}) div`)
        slider.removeEventListener('mousemove', null, false);
        slider.removeEventListener('mousedown', null, false);
        slider.removeEventListener('mouseup', null, false);
        slider.removeEventListener('mouseleave', null, false);
        slider.removeEventListener('click', null, false)
    }

    const makeTable = () => {
        return props.favorites.sort(function(a,b) {
            if(a[0] < b[0]) { return -1; }
            if(a[0] > b[0]) { return 1; }
            return 0;
        })
        .map((favoritesMap, index) => {
            //We want the category for the first column of each row stored in favoritesMap[0]
            //favoritesMap[1] contains the array of hangouts for each category that will be placed in a 2nd column
                        const selectedRow = index + 1
                        return(
                           <tr key={index}>
                            <td key={index} id={FavoriteListCSS.CategoryName}>{toTitleCase(favoritesMap[0])}:</td>
                                <td>
                                <div id={index} className={FavoriteListCSS.FavoriteHangoutContainer} 
                                     onMouseOver={() => slideRow(selectedRow)}
                                     onMouseLeave={() => deInitEventListener(selectedRow)}>
                                {
                                    //Table columns for each hangout
                                    favoritesMap[1].sort().map((hangout, index) => {
                                        return(  
                                            <div id={`FavoriteCard${selectedRow}${index}`} key={index} 
                                                 className={ dragging ? FavoriteListCSS.FavoriteCardDrag : FavoriteListCSS.FavoriteCard}>
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
                                                    url={hangout.url}
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
