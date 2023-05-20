import FavoriteListCSS from '../Styles/Favoritelist.module.css';
import FavoriteCard from './FavoriteCard';
import SegmentedControl from './SubComponents/SegmentedControl';
import { auth } from '../firebase';
import React, { useState } from 'react';
import { toTitleCase } from '../Exports/Functions';
import HorizontalSlider from './SubComponents/HorizontalSlider';

function Favoritelist({favorites, mostRecentFavorites, userLocation}) {
    const user = auth.currentUser
    const [selectedSegment, setSelectedSegment] = useState(0);

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
                        let cards = []
                        return(
                           <div key={index} className={FavoriteListCSS.CategoryRowContainer}>
                            <div key={index} className={FavoriteListCSS.CategoryName}>{toTitleCase(favoritesMap[0])}</div>
                            {
                                //Table columns for each hangout
                                favoritesMap[1].sort().forEach((hangout, index) => {
                                    cards.push(  
                                            <FavoriteCard
                                                style={FavoriteListCSS.FavoriteCard}
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
                                        )
                                }) // End of inner for each loop
                            }
                            <HorizontalSlider id={`HorizontalSlider${selectedRow}`} 
                                              style={FavoriteListCSS.CategoryRow} 
                                              items={cards}
                                              gap={1}
                                              gapUnit='em'
                            /> 
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
                                    <FavoriteCard
                                        style={FavoriteListCSS.MostRecentFavoriteCard}
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
                                )
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
