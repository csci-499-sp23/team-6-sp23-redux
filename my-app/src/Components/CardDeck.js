import { useState, useEffect } from 'react';
import Card from './Card';
import { getHangoutLocations } from '../Services/HangoutService';
import { doc, serverTimestamp, writeBatch, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';


function CardDeck() {

  const [hangoutData, setHangoutData] = useState([]);
  const [userId, setUserId] = useState(() => {
    const id = localStorage.getItem("userId");
    const value = JSON.parse(id);
    return value || "";
  });

  useEffect( () => {
    getHangoutLocations().then(data => {
      setHangoutData(data);
    })
  }, []);
  
  // Start with a shuffled deck
  const initializeDeck = () => {
    let deck = hangoutData;
      console.log(deck)
      shuffleDeck(deck);
      setHangoutData(deck);
  }

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
    // TODO: Update function here to save item to favourites
    if(swipeDirection == "right") {
      saveOnSwipeRight(item)
    }

    // Update the deck
    let newCardDeck = removeCard(hangoutData)
    shuffleDeck(newCardDeck)
    setHangoutData(newCardDeck)

  }

    return (
        <div>
          { initializeDeck && hangoutData.length > 0 &&
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
                >
                </Card>
              )
            })
          }
        </div>
    );
  }
  
  export default CardDeck;