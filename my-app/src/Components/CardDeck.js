import { useState, useEffect } from 'react';
import Card from './Card';
import { getHangoutLocations } from '../Services/HangoutService';
import CardDeckCSS from '../Styles/CardDeck.module.css';

function CardDeck() {

  const [hangoutData, setHangoutData] = useState([]);

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
  
  const handleSwipe = (item, swipeDirection) => {
    // Update the deck
    let newCardDeck = removeCard(hangoutData)
    shuffleDeck(newCardDeck)
    setHangoutData(newCardDeck)

    // TODO: Update function here to save item to favourites
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