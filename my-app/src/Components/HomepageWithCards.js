import HomepageCSS from '../Styles/Homepage.module.css'
import CardDeckCSS from '../Styles/CardDeck.module.css'
import { useEffect } from 'react';
import CardDeck from './CardDeck';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function HomepageWithCards(props) {

  const navigate = useNavigate();

  // Refreshes page when navigated from login page to force retrieval of props data from app.js 
  useEffect( () => {
    if(props.navigated) {
      navigate(0)
    }
  }, [props.navigated, navigate])

  return (
    <React.Fragment>
      <section id={HomepageCSS.CardDeckContainer}>
        <CardDeck className={CardDeckCSS.Container} location={props.location} categories={props.categories} favoriteHangouts={props.favorites} rangeLimit = {props.rangeLimit} ratingLimit ={props.ratingLimit} mostRecentFavorites={props.mostRecentFavorites}
        />
      </section>
    </React.Fragment>
  );
}
  
export default HomepageWithCards;
