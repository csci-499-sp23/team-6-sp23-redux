import React, { useState, useLayoutEffect } from 'react';
import ZStack from './SubComponents/ZStack';
import SwipeableCard from './SwipeableCard';
import Loading from './Loading';
import EmptyDeck from './EmptyDeck';
import { getHangouts } from '../Services/HangoutService';
import { doc, updateDoc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from '../firebase';
import CardDeckCSS from '../Styles/CardDeck.module.css'
import {toMeters} from "../Exports/Functions.js"

function CardDeck(props) {

  const [hangoutData, setHangoutData] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [displayEmptyDeck, setDisplayEmptyDeck] = useState(false);
  const [loading, setLoading] = useState(true);

  const userID = auth.currentUser?.uid


  useLayoutEffect(() => {
    // Initialize a set with the ids of all of the user's favorited hangout locations
    const favoritesSet = new Set();
    const initializeFavorites = () => {
      props.favoriteHangouts.forEach((map) => {
        map[1].forEach((hangout) => {
          favoritesSet.add(hangout.id)
        })
      })
    }
    
    if(props.location && props.categories && empty){
      initializeFavorites()
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

        // Remove potential duplicates that appear from overlapping categories
        const deck = removeDuplicates(filteredDeck)

        // Start with a shuffled deck
        shuffleDeck(deck)

        setEmpty(false);
        setDisplayEmptyDeck(false);
        setLoading(false);
      })
    }

  }, [props.favoriteHangouts, props.location, props.categories, props.rangeLimit, props.ratingLimit, empty]);

  const removeDuplicates = (array) => {
    let set = new Set();
    let newArray = []
    array.forEach((object) => {
      if(set.has(object.id) === false) {
        newArray.push(object)
      }
      set.add(object.id)
    })
    return newArray
  }

  // return new array with last item removed
  const removeCard = () => {
      const cardDeck = hangoutData.slice(0, -1);
      return cardDeck
    }
  

  const shuffleDeck = (deck) => {
    let newDeck = deck.slice()
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newDeck[i];
      newDeck[i] = newDeck[j];
      newDeck[j] = temp;
    }
    setHangoutData(newDeck)
  }

  const saveOnSwipeRight = async (item) => {
    const userRef = doc(db, 'users', userID);
    const favoriteCategory = `favorites.${item.category}`
    const mostRecentFavorites = 'mostRecentFavorites'

    const hangoutRef = doc(db, 'hangouts', item.id);
    const likedUsers = 'likedUsers'
    
    if (props.mostRecentFavorites && props.mostRecentFavorites.length >= 20) {
      props.mostRecentFavorites.pop() // Removes the last item in the array which is the least recently used item and returns it
      let newArray = props.mostRecentFavorites.reverse()
      newArray.push(item)

      await updateDoc(userRef, {
        // Cannot call arrayUnion and arrayRemove simultaneously on the same field unless using a batch request
        [favoriteCategory]: arrayUnion(item),
        [mostRecentFavorites]: newArray
      });

      const hangoutSnap = await getDoc(hangoutRef);
      // Check to see if the document exists or not
      if (hangoutSnap.exists()) {
        await updateDoc(hangoutRef, {
          [likedUsers]: arrayUnion(userID)
        });
      }
      else {
        await setDoc(hangoutRef, {
          [likedUsers]: arrayUnion(userID)
        });
      }

    }
    else {
      await updateDoc(userRef, {
        [favoriteCategory]: arrayUnion(item),
        [mostRecentFavorites]: arrayUnion(item)
      });

      const hangoutSnap = await getDoc(hangoutRef);
      // Check to see if the document exists or not
      if (hangoutSnap.exists()) {
        await updateDoc(hangoutRef, {
          [likedUsers]: arrayUnion(userID)
        });
      }
      else {
        await setDoc(hangoutRef, {
          [likedUsers]: arrayUnion(userID)
        });
      }
    }
}

const nextCard = () => {
  // Update the deck
  const deck = removeCard()
  shuffleDeck(deck)

  //when deck is about to run out, display the empty deck
  if (hangoutData.length === 1)
  {
    setDisplayEmptyDeck(true);
  }
}


const loadDeck = () => {
  let deck = []
  hangoutData.forEach(function(item, index){
    let isTop = index === hangoutData.length - 1
    deck.push (
      <SwipeableCard
        style={CardDeckCSS.Card}
        key={item.key || index}
        item={item}
        saveOnSwipeRight={saveOnSwipeRight}
        nextCard={nextCard}
        title={item.name} 
        image={item.image_url} 
        distance={item.distance} 
        location={item.location.display_address[0]}
        location2={item.location.display_address[1]}
        phone={item.display_phone}
        rating={item.rating}
        price={item.price}
        url={item.url}
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
  return deck
}

return (
      <>
       { hangoutData.length > 0 ?
          <ZStack style={CardDeckCSS.CardDeckContainer} items={loadDeck()}/>
          :
        //Display for waiting on the fetch request
         loading ?
          <Loading/>
         :
         //Display for when no cards left
         displayEmptyDeck ?
          <EmptyDeck setEmpty={setEmpty} setLoading={setLoading}/>
         :
         null
       }
      </>
    );
}
  
  export default CardDeck;
