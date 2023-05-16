import React, {useState} from "react";
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

    let swipeThresholdValue = screenWidth / 4

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
                clearInterval(intv)
                setIsLeft(false);
                setIsRight(false);
                setIsDragging(false)
            }, 1500)

            
        }
    }

    const handleIntervalUpdate = (interval) => {
        setIntv(interval)
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
    
    return(
    <>
        <TinderCard
        onSwipeRequirementUnfulfilled={() => {
            setIsLeft(false);
            setIsRight(false);
            clearInterval(intv)
            setIsDragging(false)
        }}
        onSwipe={(direction) => onSwipe(direction, item)}
        preventSwipe={['up', 'down']}
        swipeRequirementType="position"
        swipeThreshold={swipeThresholdValue}
        className={`${CardCSS.TinderCard} ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}   ${isRight && isDragging ? CardCSS.MockRight : ''}  ${isLeft && isDragging ? CardCSS.MockLeft : ''}`}
        children={<Card {...props} handleChangePositon={handleChangePositon} handleIntervalUpdate={handleIntervalUpdate} itemID={item.id} />}
       />
        {accepted && <SwipeFeedback accepted={true}/>}
        {rejected && <SwipeFeedback accepted={false}/>}
    </>
        
    )

}

export default SwipeableCard
