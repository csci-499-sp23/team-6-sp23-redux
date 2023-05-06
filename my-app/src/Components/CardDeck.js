import { useState, useEffect } from 'react';
import Card from './Card';
import EmptyDeck from './EmptyDeck';
import { getHangouts } from '../Services/HangoutService';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from '../firebase';

function CardDeck(props) {
  
  const [hangoutData, setHangoutData] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [displayEmptyDeck, setDisplayEmptyDeck] = useState (false);
  const userID = auth.currentUser?.uid

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
      })
    } 
    
  }, [props, empty]);

  // return new array with last item removed
  const removeCard = (array) => {
    return array.filter((_, index) => {
      return index < array.length - 1
    })
    }
  
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

  const saveOnSwipeRight = async(item) => {
    const userRef = doc(db, 'users', userID); 
    const favoriteCategory = `favorites.${item.category}`

    await updateDoc(userRef, {
      [favoriteCategory]: arrayUnion(item)
    });
}
  
  const handleSwipe = (item, swipeDirection) => {
    //Save item to favourites on swipe right
    if(swipeDirection === "right") {
      saveOnSwipeRight(item)
    }

    // Update the deck
    let newCardDeck = removeCard(hangoutData)
    let shuffledDeck = shuffleDeck(newCardDeck)
    setHangoutData(shuffledDeck)

    //when deck is about to run out, display the empty deck
    if (hangoutData.length === 1)
    {
      setDisplayEmptyDeck(true);
    }
  }

    if (displayEmptyDeck) {
      return (
        <div>
          <EmptyDeck setEmpty = {setEmpty}></EmptyDeck>
        </div>
      )
    }

    return (
      <div>
        { hangoutData.length > 0 &&
          hangoutData.map(function(item, index){
            let isTop = index === hangoutData.length - 1
            return (
              <Card
                key={item.key || index}
                onSwipe={(swipeDirection) => handleSwipe(item, swipeDirection)}
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
              </Card>
            )
          })
        }
      </div>
    );
  }
  
  export default CardDeck;