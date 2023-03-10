import './SwipeableContainer.css';

function SwipeableContainer() {
    return(
        <div className="Container">
            <img id="Container-Image" src="SwipeableContainerImage.jpeg" alt="hangout-suggestion"></img>
            <div id="Container-Title">Brooklyn Bridge</div>
            <div id="Location">Location: Williamsburg Brooklyn</div>
            <div id="Distance">Distance: 5km away</div>
        </div>
    );    
}

export default SwipeableContainer;