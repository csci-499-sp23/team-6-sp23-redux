import React from "react";
import TinderCard from 'react-tinder-card'
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from '../firebase';

function SwipeableCard(props) {
    let screenWidth = window.screen.availWidth
    let swipeThresholdValue = screenWidth / 2.5 
    const userID = auth.currentUser?.uid

    const onSwipe = (direction) => {
        console.log("entered")
    }

    const onSwipeRequirementFulfilled = (direction, item) => {
        console.log(direction)
        console.log(item)

        if(direction === "right") {
            saveOnSwipeRight(item)
        }

        let newCardDeck = removeCard(props.hangoutData)
        let shuffledDeck = shuffleDeck(newCardDeck)
        props.setHangoutData(shuffledDeck)
        //when deck is about to run out, display the empty deck
        console.log(props.hangoutData)
        if (props.hangoutData.length === 1)
        {
            props.setDisplayEmptyDeck(true);
        }
    }

    const onCardLeftScreen = (myIdentifier) => {
    }

    // MARK: - Helper Functions

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

    return(
        <TinderCard
        onSwipe={onSwipe}
        onSwipeRequirementFulfilled={(direction) => onSwipeRequirementFulfilled(direction, props.item)}
        onCardLeftScreen={ () => onCardLeftScreen(props.item)}
        preventSwipe={['up', 'down']}
        swipeRequirementType="position"
        swipeThreshold={swipeThresholdValue}
        className={`${CardCSS.TinderCard} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}`}
        children={<Card {...props}/>}
        >
         </TinderCard>
    )
    
}

export default SwipeableCard