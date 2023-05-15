import React, { useState } from "react";
import TinderCard from 'react-tinder-card'
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"


function SwipeableCard({saveOnSwipeRight, nextCard, item, ...props}) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    let swipeThresholdValue = screenWidth / 4

    window.addEventListener('resize', () => {
        setScreenWidth(window.innerWidth)
    });
    
    const onSwipe = async (direction, item) => {
        if(props.isTop) {
            if(direction === "right") {
                await saveOnSwipeRight(item)
            }
            nextCard()
        }
    }

    return(
        <TinderCard
        onSwipe={(direction) => onSwipe(direction, item)}
        //onSwipeRequirementFulfilled={(direction) => onSwipeRequirementFulfilled(direction, item)}
        preventSwipe={['up', 'down']}
        swipeRequirementType="position"
        swipeThreshold={swipeThresholdValue}
        className={`${CardCSS.TinderCard} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}`}
        children={<Card {...props} hangoutID={item.id}/>}
        >
        </TinderCard>
    )
    
}

export default SwipeableCard