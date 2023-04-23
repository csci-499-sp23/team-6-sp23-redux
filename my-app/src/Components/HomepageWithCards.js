import HomepageCSS from '../Styles/Homepage.module.css'
import CardDeckCSS from '../Styles/CardDeck.module.css'
import { useState, useEffect } from 'react';
import CardDeck from './CardDeck';
import { useNavigate } from 'react-router-dom';

function HomepageWithCards(props) {

  const [isShown, setIsShown] = useState(false);    
  const navigate = useNavigate();

  // Refreshes page when navigated from login page to force retrieval of props data from app.js 
  useEffect( () => {
    if(props.navigated) {
      navigate(0)
    }
  }, [props.navigated, navigate])

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
      <CardDeck className={CardDeckCSS.Container} location={props.location} categories={props.categories} favoriteHangouts={props.favorites} rangeLimit = {props.rangeLimit} >
      </CardDeck>
    </div>
  );
}
  
export default HomepageWithCards;