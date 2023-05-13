import FavoriteListCSS from '../Styles/Favoritelist.module.css';
import FavoriteCard from './FavoriteCard';
import SegmentedControl from './SubComponents/SegmentedControl';
import { auth } from '../firebase';
import React, { useState } from 'react';

function Favoritelist({favorites, mostRecentFavorites}) {
    const user = auth.currentUser
    const [dragging, setDragging] = useState(false); // Used to toggle whether the favorite card should be clickable or not while dragging
    const [selectedSegment, setSelectedSegment] = useState(0);

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
        let slider = document.getElementById(`FavoriteListCSS.CategoryRow${selectedRow}`)
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
        let slider = document.getElementById(`FavoriteListCSS.CategoryRow${selectedRow}`)
        slider.removeEventListener('mousemove', null, false);
        slider.removeEventListener('mousedown', null, false);
        slider.removeEventListener('mouseup', null, false);
        slider.removeEventListener('mouseleave', null, false);
        slider.removeEventListener('click', null, false)
    }

    const makeCategoriesTable = () => {
       return( 
       <section id={FavoriteListCSS.FavoriteCardTable}>
        {favorites.sort(function(a,b) {
            if(a[0] < b[0]) { return -1; }
            if(a[0] > b[0]) { return 1; }
            return 0;
        })
        .map((favoritesMap, index) => {
            //We want the category for the first column of each row stored in favoritesMap[0]
            //favoritesMap[1] contains the array of hangouts for each category that will be placed in a 2nd column
                        const selectedRow = index + 1
                        return(
                           <div key={index} className={FavoriteListCSS.CategoryRowContainer}>
                            <div key={index} className={FavoriteListCSS.CategoryName}>{toTitleCase(favoritesMap[0])}</div>
                            <div id={`FavoriteListCSS.CategoryRow${selectedRow}`} className={FavoriteListCSS.CategoryRow} 
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
                                                key={hangout.id}
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
                                                isMostRecent={false}
                                                isCategory={true}
                                            />
                                        }
                                        </div>
                                           
                                        )
                                }) // End of inner for each loop
                            }
                            </div> 
                           </div> 
                        )
        }) // End of first for each loop
        }
        </section>)
    }
    const makeMostRecentTable = () => {
        // The index for each card in the database is reversed so we need to set the correct index for deleting the object
        var i = mostRecentFavorites.length
            return(
                <table id={FavoriteListCSS.MostRecentTable}>
                <tbody>
                <tr className={FavoriteListCSS.MostRecentFavoriteCardRow}>
                {   
                    mostRecentFavorites.map((hangout) => {
                        i -= 1
                        return(
                            <td key={i} className={FavoriteListCSS.MostRecentFavoriteCard}>
                            {
                                <FavoriteCard
                                key={hangout.id}
                                index={i}
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
                                isMostRecent={true}
                                isCategory={false}
                                />
                            }
                            </td>
                        )
                    })
                }
            </tr>
            </tbody>
            </table>
            )
    }
    
    return(
        <React.Fragment>
            <header>
                <div id={FavoriteListCSS.PageTitle}>{user?.displayName}'s Top Favorites</div>
                
                <div id={FavoriteListCSS.SegmentedControlContainer}>
                    <SegmentedControl buttonNames={["Most Recent", "Categories"]} selectedSegment={setSelectedSegment}/>
                </div>
            </header>

            {mostRecentFavorites && selectedSegment === 0 && makeMostRecentTable()}
            {favorites && selectedSegment === 1 && makeCategoriesTable()}
            
        </React.Fragment>
        
    );    
}


export default Favoritelist;
