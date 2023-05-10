import React, { useState } from "react";
import TinderCard from 'react-tinder-card'
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"

function SwipeableCard({handleSwipe, nextCard, item, ...props}) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    let swipeThresholdValue = screenWidth / 2.9

    window.addEventListener('resize', () => {
        setScreenWidth(window.innerWidth)
    });
    

    const onSwipeRequirementFulfilled = (direction, item) => {
        handleSwipe(item, direction)
        nextCard()
    }


    /*const onCardLeftScreen = (direction, item) => {
        //nextCard()
    }*/

    return(
        <TinderCard
        onSwipeRequirementFulfilled={(direction) => onSwipeRequirementFulfilled(direction, item)}
        //onCardLeftScreen={(direction) => onCardLeftScreen(direction, item)}
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