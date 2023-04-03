import React, {useState, useEffect, useRef} from 'react';
import HangoutDetail from './HangoutDetail';
import CardCSS from '../Styles/Card.module.css';
import { motion, useMotionValue, useAnimation } from "framer-motion";

function Card({onSwipe, ...props}) {
  const cardElem = useRef(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  const [constrained, setConstrained] = useState(true);
  const [direction, setDirection] = useState();
  const [velocity, setVelocity] = useState();
  const [flyAwayComplete, setFlyAwayComplete] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false)

  const getSwipeResult = (childNode, parentNode) => {
    const childRect = childNode.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();

    // Set swipe result if past limits
    let swipeResult = childRect.right >= parentRect.right ? "right"
      : childRect.left <= parentRect.left ? "left"
      : undefined;
    return swipeResult;
  };

  // Determine direction of swipe based on velocity
  const getDirection = () => {
    return velocity >= 1 ? "right" : velocity <= -1 ? "left" : undefined;
  };

  const getTrajectory = () => {
    if (x.getVelocity() > 0 || x.getVelocity() < 0) {
      setVelocity(x.getVelocity());
      setDirection(getDirection());
    }
  };

  const flyAway = (min) => {
    const flyAwayDistance = (direction) => {
      const parentWidth = cardElem.current.parentNode.getBoundingClientRect()
        .width;
      const childWidth = cardElem.current.getBoundingClientRect().width;
      return direction === "left" ? -parentWidth - childWidth
        : parentWidth + childWidth;
    };

    if (direction && Math.abs(velocity) > min) {
      setConstrained(false);
      controls.start({
        x: flyAwayDistance(direction)
      });
      setFlyAwayComplete(true)
    }
  };

  const onClick = () => setShowCardDetails(true)

  useEffect(() => {
    function handleSwipe() {
      if (cardElem.current) {
        const childNode = cardElem.current;
        const parentNode = cardElem.current.parentNode;
        const swipeResult = getSwipeResult(childNode, parentNode);
        swipeResult !== undefined && flyAwayComplete && onSwipe(swipeResult);
      }
    }

    const unsubscribeX = x.on("change", handleSwipe)

    return () => {
      unsubscribeX()
    }
  }, [x, flyAwayComplete, onSwipe])

  return (
    <div>
      <motion.div
        className={CardCSS.MotionContainer}
        animate={controls}
        dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        ref={cardElem}
        drag='x'
        onDrag={getTrajectory}
        onDragEnd={() => flyAway(100)}
        style={{ x }}
        onClick={onClick}
      >
        <div className={`${CardCSS.Container} ${(props.isTop ? CardCSS.TopCard : '')}`}>
          <img draggable='false' id={CardCSS.Image} src={props.image} alt="hangout-suggestion"></img>
          <div id={CardCSS.Title}>{props.title}</div>
          <div id={CardCSS.Location}>Location: {props.location}, {props.location2}</div>
          <div id={CardCSS.Distance}>Distance: {props.distance.toFixed(2)} km away</div>
        </div>
      </motion.div>

      {showCardDetails ?
        <div className={CardCSS.DetailContainer}>
          <HangoutDetail
              className={CardCSS.DetailContainer} 
              title={props.title} 
              image={props.image} 
              distance={props.distance}
              phone={props.phone || "N/A"} 
              location={props.location}
              location2={props.location2}
              details={props.details}
              rating={props.rating}
            />
        </div>
        : null
      }
    </div>
  );
};

export default Card;