import React from "react";
import TinderCard from 'react-tinder-card'
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"

function SwipeableCard(props) {
    let screenWidth = window.screen.availWidth
    let swipeThresholdValue = screenWidth / 2.5 

    const onSwipe = (direction) => {
        console.log("entered")
    }

    const onSwipeRequirementFulfilled = (direction, item) => {
        props.handleSwipe(item, direction)
    }

    return(
        <TinderCard
        onSwipe={onSwipe}
        onSwipeRequirementFulfilled={(direction) => onSwipeRequirementFulfilled(direction, props.item)}
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