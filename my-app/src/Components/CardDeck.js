import { useState, useEffect } from 'react';
import Card from './Card';
import { getHangoutLocations } from '../Services/HangoutService';
import { doc, serverTimestamp, writeBatch, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';


function CardDeck() {

  const [hangoutData, setHangoutData] = useState([]);
  const id = localStorage.getItem("userId");
  const userId = JSON.parse(id) != null ? JSON.parse(id) : "";

  useEffect( () => {
    getHangoutLocations("40.712742, -74.013382", "restaurant", "park", "museum").then(data => {
      console.log(data)
      // Start with a shuffled deck
      shuffleDeck(data)
      setHangoutData(data);
    })
  }, []);
  

  // return new array with last item removed
  const removeCard = (array) => {
    return array.filter((_, index) => {
      return index < array.length - 1
    })
    }
  
  const shuffleDeck = (deck) => {
    for(let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  }

  const saveOnSwipeRight = async(item) => {
    const batch = writeBatch(db);
    const hangoutRef = doc(db, 'favorites', item.id);
    const userRef = doc(db, 'users', userId); 

    batch.set(hangoutRef, item, {
      createdAt: serverTimestamp()
    });
    batch.update(userRef, {"favorites": arrayUnion(hangoutRef.id)});
    await batch.commit(); 
}
  
  const handleSwipe = (item, swipeDirection) => {
    //Save item to favourites on swipe right
    if(swipeDirection === "right") {
      saveOnSwipeRight(item)
    }

    // Update the deck
    let newCardDeck = removeCard(hangoutData)
    shuffleDeck(newCardDeck)
    setHangoutData(newCardDeck)
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
                >
                </Card>
              )
            })
          }
        </div>
    );
  }
  
  export default CardDeck;