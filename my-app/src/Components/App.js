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
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";

// Just a comment to make a commit/delete later
function App() {
  const userID = auth.currentUser?.uid
  const [navigated, setNavigated] = useState(false); // check to see if navigated from login
  const [location, setLocation] = useState(""); // user location
  const [preferences, setPreferences] = useState([]); // preferences data
  const [favorites, setFavorites] = useState([]); // list of hangouts the user liked
  const [categories, setCategories] = useState([]); // category preferences
  const [isAuthenticated, setIsAuthenticated] = useState(false); // check if user is authenticated
  
  // will mount
  useEffect( () => {
    var unsubscribe;
    // Event handler used to listen for any changes to user document and return it
    if(userID) {
      unsubscribe = onSnapshot(doc(db, 'users', userID), (doc) => {
          var dataArray = Object.entries(doc.data())
          
          dataArray.forEach((data) => {
            switch(data[0]) {
              case "preferences":
                setPreferences(data[1])
                setLocation(data[1].userLocation)
                setCategories(data[1].categories)
                return
              case "favorites":
                setFavorites(Object.entries(data[1]))
                return
              default:
                return 
            }
          })
      }  
    )};
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
      if (unsubscribe) {
        unsubscribe();
      }
      authUnsubscribe();
    };
  }, [userID]);

  return (
    <div className="App">
      <AppNavbar isAuthenticated={isAuthenticated}/>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login setNavigated={setNavigated}/>}/>
          <Route exact path="/homepage" element={<HomepageWithCards location={location} navigated={navigated} categories={categories}/>}/>
          <Route exact path="/favorites" element={<Favoritelist favorites={favorites} />}/>
          <Route exact path = "/login" element = {<Login setNavigated={setNavigated}/>}/>
          <Route exact path = "/signup" element = {<SignUp/>}/>
          <Route exact path="/preferences" element={<Preferences preferences={preferences}/>}/>
          <Route exact path="/profile" element={<Profile/>} />
        </Routes>
      </Router>    
    </div>
  );
}
export default App;
