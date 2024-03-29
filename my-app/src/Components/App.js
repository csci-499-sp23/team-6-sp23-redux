import '../Styles/App.css';
import Favoritelist from './Favoritelist';
import AppNavbar from './AppNavbar';
import Login from './Login';
import SignUp from './Signup';
import HomepageWithCards from './HomepageWithCards'
import Preferences from './Preferences';
import Profile from './Profile';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";
import PageTitle from './PageTitle';
import ForgotPassword from './ForgotPassword';
import React from 'react';

function App() {
  const userID = auth.currentUser?.uid
  const [navigated, setNavigated] = useState(false); // check to see if navigated from login
  const [location, setLocation] = useState(""); // user location
  const [preferences, setPreferences] = useState([]); // preferences data
  const [favorites, setFavorites] = useState([]); // list of hangouts the user liked
  const [mostRecentFavorites, setMostRecentFavorites] = useState([]); // list of the most recent favorited hangouts;
  const [categories, setCategories] = useState([]); // category preferences
  const [isAuthenticated, setIsAuthenticated] = useState(false); // check if user is authenticated
  const [rangeLimit, setRangeLimit] = useState("");
  const [ratingLimit, setRatingLimit] = useState("")
  const [username, setUsername] = useState('');
  
  const memoizedPreferences = useMemo(() => preferences, [preferences]);
  const memoizedFavorites = useMemo(() => favorites, [favorites]);
  const memoizedMostRecentFavorites = useMemo(() => mostRecentFavorites, [mostRecentFavorites]);
  const memoizedCategories = useMemo(() => categories, [categories]);

  // will mount
  useEffect( () => {
    var unsubscribeUser;
    // Event handler used to listen for any changes to user document and return it
    if(userID) {
      unsubscribeUser = onSnapshot(doc(db, 'users', userID), (doc) => {
          var dataArray = Object.entries(doc.data())
          
          dataArray.forEach((data) => {
            switch(data[0]) {
              case "preferences":
                setPreferences(data[1])
                setLocation(data[1].userLocation)
                setCategories(data[1].categories)
                setRangeLimit(data[1].rangeLimit)
                setRatingLimit(data[1].ratingLimit)
                return
              case "favorites":
                setFavorites(Object.entries(data[1]))
                return
              case "mostRecentFavorites":
                let mostRecentFavorites = data[1].reverse()
                mostRecentFavorites = mostRecentFavorites.slice(0, 20) // gets up to the top 20 most recent favorited hangouts
                setMostRecentFavorites(mostRecentFavorites)
                return
              default:
                return 
            }
          })
      })
  };
    // Check if user is authenticated
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('userID', JSON.stringify(user.uid))
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    // unmount 
    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }

      authUnsubscribe();
    };
  }, [userID]);

  return (
    <>
      <Router>
        <div id="App">
          <header id="AppHeader">
            <AppNavbar isAuthenticated={isAuthenticated} username={username} setNavigated={setNavigated} />
            <PageTitle />
          </header>
          <section id="AppBody">
            <Routes>
            {
              isAuthenticated &&
              <Route exact path="/" element={<HomepageWithCards location={location} navigated={navigated} categories={memoizedCategories} favorites={memoizedFavorites} rangeLimit={rangeLimit} ratingLimit={ratingLimit} mostRecentFavorites={memoizedMostRecentFavorites}/>}/>
            }
            {
              !isAuthenticated &&
              <Route exact path="/" element={<Login setUsername={setUsername} setNavigated={setNavigated}/>}/>
            }
            <Route exact path="/homepage" element={<HomepageWithCards location={location} navigated={navigated} categories={memoizedCategories} favorites={memoizedFavorites} rangeLimit={rangeLimit} ratingLimit={ratingLimit} mostRecentFavorites={memoizedMostRecentFavorites}/>}/>
            <Route exact path="/favorites" element={<Favoritelist favorites={memoizedFavorites} mostRecentFavorites={memoizedMostRecentFavorites} userLocation={location}/>}/>
            <Route exact path = "/login" element = {<Login setUsername={setUsername} setNavigated={setNavigated}/>}/>
            <Route exact path = "/signup" element = {<SignUp setNavigated={setNavigated}/>}/>
            <Route exact path="/preferences" element={<Preferences preferences={memoizedPreferences}/>}/>
            <Route exact path="/profile" element={<Profile preferences={memoizedPreferences} isAuthenticated={isAuthenticated} userLocation={location}/>} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
           </Routes>
          </section>
        </div>
      </Router>    
    </>
  );
}
export default App;
