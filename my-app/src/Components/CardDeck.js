import { useState, useEffect} from 'react';
import SwipeableCard from './SwipeableCard';
import EmptyDeck from './EmptyDeck';
import { getHangouts } from '../Services/HangoutService';
import CardDeckCSS from '../Styles/CardDeck.module.css'

function CardDeck(props) {
  
  const [hangoutData, setHangoutData] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [displayEmptyDeck, setDisplayEmptyDeck] = useState (false);
  const [loading, setLoading] = useState(true);

  function toMeters(miles)
  {
    return parseInt(Math.floor(parseInt(miles) * 1609.34));
  }


  useEffect( () => {
    // Initialize a set with the ids of all of the user's favorited hangout locations
    const favoritesSet = new Set(); 
    const initializeFavorites = () => {
      props.favoriteHangouts.forEach((map) => {
        map[1].forEach((hangout) => {
          favoritesSet.add(hangout.id)
        })
      })
    }

    initializeFavorites()
    
    if(props.location && props.categories && empty){
      getHangouts(props.location, props.categories, toMeters(props.rangeLimit)).then((data) => {
        // Filter the data to remove any locations the user has already liked

        var filteredDeck = data.filter((hangout) => {
          return !favoritesSet.has(hangout.id)
        })

       //Filter based on hangout.rating for yelp rating
       if (props.ratingLimit > 0)
       {
        filteredDeck = filteredDeck.filter ((hangout) => hangout.rating >= props.ratingLimit);
       }

        // Start with a shuffled deck
        let deck = shuffleDeck(filteredDeck)
        setHangoutData(deck);

        setEmpty(false);
        setDisplayEmptyDeck(false);
        setLoading(false);
      })
    } 
    
  }, [props, empty]);

  
  const shuffleDeck = (deck) => {
    let newDeck = deck.slice()
    for(let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newDeck[i];
      newDeck[i] = newDeck[j];
      newDeck[j] = temp;
    }
    return newDeck
  }

    //Display for waiting on the fetch request
    if (loading) {
      return (
        <div className= {CardDeckCSS.loader_container}>
          <div className={CardDeckCSS.loader}></div>
          <div className={CardDeckCSS.loader_text}> 
            Loading
          <br></br>
            <div className={CardDeckCSS.loader_subtext}>If loading is slow, try less categories.</div>
          </div>
        </div>
      )
    }

    //Display for when no cards left
    if (displayEmptyDeck) {
      return (
        <div>
          <EmptyDeck setEmpty = {setEmpty} setLoading = {setLoading}></EmptyDeck>
        </div>
      )
    }

    return (
      <div className={CardDeckCSS.CardDeckContainer}>
        { hangoutData.length > 0 &&
          hangoutData.map(function(item, index){
            let isTop = index === hangoutData.length - 1
            return (
              <SwipeableCard
                key={item.key || index}
                item={item}
                hangoutData={hangoutData}
                setHangoutData={setHangoutData}
                setDisplayEmptyDeck={setDisplayEmptyDeck}
                title={item.name} 
                image={item.image_url} 
                distance={item.distance} 
                location={item.location.display_address[0]}
                location2={item.location.display_address[1]}
                phone={item.display_phone}
                rating={item.rating}
                price={item.price}
                details={item.categories}
                isTop={isTop}
                category={item.category}
                closed={item.is_closed}
                latitude={item.coordinates.latitude}
                longitude={item.coordinates.longitude}
                userLatitude={parseFloat(props.location.split(',')[0])}
                userLongitude={parseFloat(props.location.split(',')[1])}
              >
              </SwipeableCard>
            )
          })
        }
      </div>
    );
  }
  
  export default CardDeck;