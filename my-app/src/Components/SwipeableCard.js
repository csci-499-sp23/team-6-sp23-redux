import React, {useState} from "react";
import SwipeableComponent from "./SubComponents/SwipeableComponent.js";
import Card from './Card.js'
import CardCSS from "../Styles/Card.module.css"
import SwipeFeedback from "./SubComponents/SwipeFeedback.js";

function SwipeableCard({saveOnSwipeRight, nextCard, item, ...props}) {
    const [showFeedback, setShowFeedback] = useState({show: false, accept: null});
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
                setShowFeedback({show: true, accept: true})
            }
            else if(direction === "left") {
                setShowFeedback({show: true, accept: false})
            }
            
            setTimeout(() => {
                clearInterval(intv)
                setIsLeft(false);
                setIsRight(false);
                setIsDragging(false)
                nextCard()
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

    const onTap = () => {
    }
     
    return(
    <>
      <SwipeableComponent 
        onSwipe={(direction) => onSwipe(direction, item)}
        onTap={onTap}
        swipeThreshold={swipeThresholdValue}
        child={<Card {...props} handleChangePositon={handleChangePositon} handleIntervalUpdate={handleIntervalUpdate} 
                     itemID={item.id} dragStyle={(isRight && isDragging) ? CardCSS.MockRight : (isLeft && isDragging) ? CardCSS.MockLeft : null}/>}
      />
      { showFeedback.show && <SwipeFeedback hide={setShowFeedback} accept={showFeedback.accept} style={CardCSS.Feedback}/>}
    </>
        
    )

}

export default SwipeableCard

