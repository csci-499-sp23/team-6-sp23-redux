import HomepageCSS from '../Styles/Homepage.module.css'
import { useState } from 'react';
import SwipeableContainer from './SwipeableContainer';
import HangoutDetail from './HangoutDetail';

function Homepage() {

    const [isShown, setIsShown] = useState(false);
    const [showDetail, setShowDetail] = useState(`${HomepageCSS.HangoutDetailInvis}`);
    const [toggleHangout, setToggleHangout] = useState(`${HomepageCSS.HangoutContainer}`);
    
    const displayHangoutDetails = () => { 
      setShowDetail(`${HomepageCSS.HangoutDetailContainer}`);
      setToggleHangout(`${HomepageCSS.HangoutContainerInvis}`);
    };

    const displayHangoutContainer = () => {
      setShowDetail(`${HomepageCSS.HangoutDetailInvis}`);
      setToggleHangout(`${HomepageCSS.HangoutContainer}`);
    }

    return (
      <div className={HomepageCSS.Homepage}>
          <div className={HomepageCSS.InfoButtonContainer} 
               onMouseEnter={() => setIsShown(true)}
               onMouseLeave={() => setIsShown(false)}>
            <img className={HomepageCSS.InfoButton} src="Images/info-button.png" alt="info"/>
            {
              isShown && 
              <div className={`${HomepageCSS.InfoTextContainer} ${HomepageCSS.bubbleBottomRight}`}>
                <li>Swipe Right to Save</li>
                <li>Swipe Left to Reject</li>
                <li>Click to View More Details</li>
              </div>
            }
          </div>
          
          

          <div className={toggleHangout} onClick={displayHangoutDetails}>
            <SwipeableContainer />     
          </div>
          <div className={showDetail}>
                <HangoutDetail />
                <button className={HomepageCSS.HangoutDetailBackButton}
                        onClick={displayHangoutContainer}>
                  <img id={HomepageCSS.BackButtonImage} src="Images/back-button.png" alt="back"/>
                </button>
          </div>
          
      </div>
    );
  }
  
  export default Homepage;