import SwipeableContainerCSS from '../Styles/SwipeableContainer.module.css';

function SwipeableContainer() {
    return(
        <div className={SwipeableContainerCSS.Container}>
            <img id={SwipeableContainerCSS.Image} src="Images/SwipeableContainerImage.jpeg" alt="hangout-suggestion"></img>
            <div id={SwipeableContainerCSS.Title}>Brooklyn Bridge</div>
            <div id={SwipeableContainerCSS.Location}>Location: Williamsburg Brooklyn</div>
            <div id={SwipeableContainerCSS.Distance}>Distance: 5km away</div>
        </div>
    );    
}

export default SwipeableContainer;