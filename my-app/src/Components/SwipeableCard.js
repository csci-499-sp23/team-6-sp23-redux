import React, { useState, useRef } from "react";
import TinderCard from 'react-tinder-card'
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"

function SwipeableCard({ handleSwipe, nextCard, item, ...props }) {
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

    const onSwipeRequirementFulfilled = (direction, item) => {
        handleSwipe(item, direction)
        nextCard()
        clearInterval(intv)
        setIsLeft(false);
        setIsRight(false);
        setIsDragging(false)
    }

    const handleChangePositon = (x, width,) => {
        let screenW = window.innerWidth
        let halfScreenWidth = (screenW / 2);

        if (x > (halfScreenWidth)) {
            setIsLeft(false);
            setIsRight(true);
            setIsDragging(true)

        } else if (x < (halfScreenWidth - width)) {
            setIsLeft(true);
            setIsRight(false);
            setIsDragging(true)

        } else {
            setIsLeft(false);
            setIsRight(false);
            setIsDragging(false)
        }

    }

    const handleIntervalUpdate = (interval) => {
        setIntv(interval)
    }


    /*const onCardLeftScreen = (direction, item) => {
        //nextCard()
    }*/

    return (
        <TinderCard
            onSwipeRequirementUnfulfilled={() => {
                setIsLeft(false);
                setIsRight(false);
                clearInterval(intv)
                setIsDragging(false)
            }}
            onSwipeRequirementFulfilled={(direction) => onSwipeRequirementFulfilled(direction, item)}
            //onCardLeftScreen={(direction) => onCardLeftScreen(direction, item)}
            preventSwipe={['up', 'down']}
            swipeRequirementType="position"
            swipeThreshold={swipeThresholdValue}
            className={`${CardCSS.TinderCard} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}   ${isRight && isDragging ? CardCSS.MockRight : ''}  ${isLeft && isDragging ? CardCSS.MockLeft : ''}`}
            children={<Card {...props} handleChangePositon={handleChangePositon} handleIntervalUpdate={handleIntervalUpdate} />}

        >
        </TinderCard>
    )

}

export default SwipeableCard
