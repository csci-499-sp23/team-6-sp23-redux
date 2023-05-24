import React, { useState, useRef } from 'react';
import Styles from '../../Styles/SwipeableComponent.module.css';
import propTypes from 'prop-types';
import { isMobileDevice } from '../../Exports/Functions';


function SwipeableComponent({ onSwipe = () => {}, onTap = () => {}, swipeThreshold = isMobileDevice() ? (window.innerWidth / 3) : (window.innerWidth / 4), child }) {
    const componentRef = useRef(null);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [initialPosition, setInitialPosition] = useState({x:0, y:0});
    const [position, setPosition] = useState({x:0, y:0});

    const [mousePressed, setMousePressed] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    /* MARK: - Mobile Events */

    const handleTouchStart = (e) => {
        if (!isMobileDevice()) {
            return
        }
        
        const touch = e.touches[0];
        setStartX(touch.clientX);
        setStartY(touch.clientY);

        // Get the starting positions to calculate swipe based on position
        const component = componentRef.current;
        component.style.transition = 'none'
        const { left, top, width, height } = component.getBoundingClientRect();

        setInitialPosition((prevPosition) => ({
            x: prevPosition.x + left + width/2,
            y: prevPosition.y + top + height/2
        }))

    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        setStartX(touch.clientX);
        setStartY(touch.clientY);
        setPosition((prevPosition) => ({
            x: prevPosition.x + deltaX,
            y: prevPosition.y + deltaY,
        }))
    };

    const handleTouchEnd = (e) => {
        // Did not move the component
        if(position.x === 0 && position.y === 0) {
            onTap()
            return
        }
        let component = componentRef.current
        let swipeX = initialPosition.x - startX
        if( swipeX > swipeThreshold) {
            let direction = 'left';
            component.style.display = 'none';
            onSwipe(direction);
            
        }
        else if (swipeX < -swipeThreshold) {
            let direction = 'right';
            component.style.display = 'none';
            onSwipe(direction);
        }
        else {
            component.style.transition = 'transform 0.75s ease-out';
            setPosition({x:0, y:0});
            setInitialPosition({x:0, y:0});
        }
    };

    /* MARK: - Browser Events */

    const handleMouseDown = (e) => {
        if(isMobileDevice()) {
            return
        }

        e.preventDefault();
    
        // Get the starting positions to calculate swipe based on position
        const component = componentRef.current;
        component.style.transition = 'none'
        const { left, top, width, height } = component.getBoundingClientRect();
        
        setMouseX(e.clientX)
        setMouseY(e.clientY)
        
        setInitialPosition((prevPosition) => ({
            x: prevPosition.x + left + width/2,
            y: prevPosition.y + top + height/2
        }))

        setMousePressed(true);
    }

    const handleMouseMove = (e) => {
        if(!mousePressed) {
            return;
        }
 
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
      
        setMouseX(e.clientX)
        setMouseY(e.clientY)

        setPosition((prevPosition) => ({
            x: prevPosition.x + deltaX,
            y: prevPosition.y + deltaY,
        }));
        
        let swipeX = initialPosition.x - mouseX
        let component = componentRef.current

        if( swipeX > swipeThreshold && deltaX < 0) {
            let direction = 'left';
            component.style.display = 'none';
            onSwipe(direction);
        }
        else if (swipeX < -swipeThreshold && deltaX > 0) {
            let direction = 'right';
            component.style.display = 'none';
            onSwipe(direction);
        }

    }

    const handleMouseUp = () => {
        setMousePressed(false);
        setInitialPosition({x: 0, y:0});
        setMouseX(0);
        setMouseY(0);

        if(position.x === 0 && position.y === 0) {
            onTap()
            return
        }

        let component = componentRef.current
        component.style.transition = 'transform 0.75s ease-out'
        setPosition({x:0, y:0});
    }

    return (
        <div className={Styles.Container}
           ref={componentRef}
           onTouchStart={handleTouchStart} 
           onTouchMove={handleTouchMove}
           onTouchEnd={handleTouchEnd}
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           style={{
            position: 'relative',
            transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.075}deg)`,
            touchAction: 'none',
           }}
        >
            {child}
        </div>
    )
}

SwipeableComponent.propTypes = {
    onSwipe: propTypes.func,
    onTap: propTypes.func,
    swipeThreshold: propTypes.number,
    child: propTypes.element
}

export default SwipeableComponent;