import { useState, useEffect } from 'react';
import Card from './Card';
import { getHangoutLocations } from '../Services/HangoutService';
import { doc, serverTimestamp, writeBatch, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';

function CardDeck(props) {
  
  const [hangoutData, setHangoutData] = useState([]);
  const id = localStorage.getItem("userId");
  //const userId = JSON.parse(id) !== null && JSON.parse(id) !== "undefined" ? JSON.parse(id) : "";
  const userId = id !== null && id !== "undefined" ? JSON.parse(id) : ""; // remove after test.
  
  useEffect( () => {
    if(props.location) {
      getHangoutLocations(props.location, props.categories).then(data => {
        // Start with a shuffled deck
        let deck = shuffleDeck(data)
        setHangoutData(deck);
      })
    }
  }, [props.location, props.categories]);

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
    const batch = writeBatch(db);
    const hangoutRef = doc(db, 'favorites', item.id);
    const userRef = doc(db, 'users', userId); 
    const favoriteCategory = `favorites.${item.category}`

    batch.set(hangoutRef, item, {
      createdAt: serverTimestamp()
    });

    batch.update(userRef, {
      [favoriteCategory]: arrayUnion(hangoutRef.id)
    });

    await batch.commit(); 
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