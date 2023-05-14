import React, { useState, useRef } from "react";
import TinderCard from 'react-tinder-card'
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"
import SwipeFeedback from "./SubComponents/SwipeFeedback.js";

function SwipeableCard({saveOnSwipeRight, nextCard, item, ...props}) {
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isLeft, setIsLeft] = useState(false);
    const [isRight, setIsRight] = useState(false);
    const [intv, setIntv] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const cardRef = useRef(null)

    let swipeThresholdValue = screenWidth / 2.9

    window.addEventListener('resize', () => {
        setScreenWidth(window.innerWidth)
    });
    
    const onSwipe = async (direction, item) => {
        if(props.isTop) {
            if(direction === "right") {
                await saveOnSwipeRight(item)
                setAccepted(true)
            }
            else if(direction === "left") {
                setRejected(true)
            }
            setTimeout(() => {
                nextCard()
            }, 1500)
        }
    }

    return(
    <>
        <TinderCard
        onSwipe={(direction) => onSwipe(direction, item)}
        preventSwipe={['up', 'down']}
        swipeRequirementType="position"
        swipeThreshold={swipeThresholdValue}
        className={`${CardCSS.TinderCard} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}`}
        children={<Card {...props} hangoutID={item.id}/>}
       />
        {accepted && <SwipeFeedback accepted={true}/>}
        {rejected && <SwipeFeedback accepted={false}/>}
    </>
    )

}

export default SwipeableCard
