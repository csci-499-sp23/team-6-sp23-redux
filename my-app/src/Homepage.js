import './Homepage.css'
import SwipeableContainer from './SwipeableContainer';

function Homepage() {
    return (
      <div className="Homepage">
          <img className="InfoButton" src="info-button.png" alt="info"></img>
          <div className="HangoutContainer">
            <SwipeableContainer></SwipeableContainer>
          </div>
      </div>
    );
  }
  
  export default Homepage;