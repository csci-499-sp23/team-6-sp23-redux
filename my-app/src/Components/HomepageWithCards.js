import HomepageCSS from '../Styles/Homepage.module.css'
import CardDeckCSS from '../Styles/CardDeck.module.css'
import { useState } from 'react';
import CardDeck from './CardDeck';

function HomepageWithCards(props) {

  const [isShown, setIsShown] = useState(false);    

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
      <CardDeck className={CardDeckCSS.Container} location={props.location}>
      </CardDeck>
    </div>
  );
}
  
export default HomepageWithCards;