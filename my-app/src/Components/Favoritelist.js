import FavoriteListCSS from '../Styles/Favoritelist.module.css';
import FavoriteCard from './FavoriteCard';
import SegmentedControl from './SubComponents/SegmentedControl';
import { auth } from '../firebase';
import React, { useState } from 'react';
import { toTitleCase } from '../Exports/Functions';

function Favoritelist({favorites, mostRecentFavorites, userLocation}) {
    const user = auth.currentUser
    const [dragging, setDragging] = useState(false); // Used to toggle whether the favorite card should be clickable or not while dragging
    const [selectedSegment, setSelectedSegment] = useState(0);
    const [swipeStart, setSwipeStart] = useState(null);
    const [swipeEnd, setSwipeEnd] = useState(null);
    const minSwipeDistance = 50
    
    // Used to check if the browser is mobile or web for slide/swipe events
    const [mobileCheck] = useState(() => {
        let check = false;
        // eslint-disable-next-line
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    })
    
    /* MARK: - Sliding Functions */
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

    /* MARK: - Swiping Functions */

    // Function that makes the scrollable rows draggable
    const startSwipe = (e) => {
        setSwipeEnd(null)
        setSwipeStart(e.targetTouches[0].clientX)
    }

    const endSwipe = (e, selectedRow) => {
        e.preventDefault()
        if(!swipeStart || !swipeEnd) return
        const distance = swipeStart - swipeEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if(isLeftSwipe || isRightSwipe) {
            let slider = document.getElementById(`FavoriteListCSS.CategoryRow${selectedRow}`)
            slider.scrollLeft = distance;
        }
    }

    const swipe = (e) => {
        setSwipeEnd(e.targetTouches[0].clientX)
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
                                 onMouseOver={() => {if(!mobileCheck) slideRow(selectedRow)}}
                                 onMouseLeave={() => {if(!mobileCheck) deInitEventListener(selectedRow)}}
                                 onTouchStart={(e) => {if(mobileCheck) startSwipe(e)}}
                                 onTouchEnd={(e) => {if(mobileCheck) endSwipe(e, selectedRow)}}
                                 onTouchMove={(e) => {if(mobileCheck) swipe(e)}}>
                            {
                                //Table columns for each hangout
                                favoritesMap[1].sort().map((hangout, index) => {
                                    return(  
                                        <div id={`FavoriteCard${selectedRow}${index}`} key={index} 
                                             className={ dragging ? FavoriteListCSS.FavoriteCardDrag : FavoriteListCSS.FavoriteCard}>
                                        {
                                            <FavoriteCard
                                                key={hangout.id}
                                                id={hangout.id}
                                                index={index}
                                                title={hangout.name} 
                                                image={hangout.image_url} 
                                                distance={hangout.distance} 
                                                location={hangout.location.display_address[0]}
                                                location2={hangout.location.display_address[1]}
                                                latitude={hangout.coordinates.latitude}
                                                longitude={hangout.coordinates.longitude}
                                                userLatitude={parseFloat(userLocation.split(',')[0])}
                                                userLongitude={parseFloat(userLocation.split(',')[1])}
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
    const makeMostRecentTable = (columns) => {
        // Generate a 2D table object to display the hangouts in a tabular format
        const numColumns = columns // # of hangouts displayed per row
        const numRows = Math.ceil(mostRecentFavorites.length / numColumns)
        const table = []
        
        let r = 0
        let tableIndex = 0

        while(r < mostRecentFavorites.length && tableIndex < numRows) {
            let row = mostRecentFavorites.slice(r, r + numColumns)
            table.push(row)
            r += numColumns
            tableIndex += 1
        }

        // The index for each card in the database is reversed so we need to set the correct index for deleting the object
        var i = mostRecentFavorites.length
        return(
        <section id={FavoriteListCSS.MostRecentTable}>
                {
                    table.map((row, index) => {
                        return(
                        <div key={index} className={FavoriteListCSS.MostRecentFavoriteCardRow}>
                        {   
                            row.map((hangout) => {
                                i -= 1
                                return(
                                <div key={hangout.id} className={FavoriteListCSS.MostRecentFavoriteCard}>
                                {
                                    <FavoriteCard
                                        key={hangout.id}
                                        id={hangout.id}
                                        index={i}
                                        title={hangout.name} 
                                        image={hangout.image_url} 
                                        distance={hangout.distance} 
                                        location={hangout.location.display_address[0]}
                                        location2={hangout.location.display_address[1]}
                                        latitude={hangout.coordinates.latitude}
                                        longitude={hangout.coordinates.longitude}
                                        userLatitude={parseFloat(userLocation.split(',')[0])}
                                        userLongitude={parseFloat(userLocation.split(',')[1])}
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
                                </div>)
                            })
                        }
                        </div>)
                    })
                }
        </section>)
    }

    return(
        <React.Fragment>
            <header>
                <div id={FavoriteListCSS.PageTitle}>{user?.displayName}'s Top Favorites</div>
                
                <div id={FavoriteListCSS.SegmentedControlContainer}>
                    <SegmentedControl buttonNames={["Most Recent", "Categories"]} selectedSegment={setSelectedSegment}/>
                </div>
            </header>

            {mostRecentFavorites && selectedSegment === 0 && makeMostRecentTable(3)}
            {favorites && selectedSegment === 1 && makeCategoriesTable()}
            
        </React.Fragment>
        
    );    
}


export default Favoritelist;
