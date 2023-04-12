import '../Styles/App.css';
import Favoritelist from './Favoritelist';
import AppNavbar from './AppNavbar';
import Login from './Login';
import SignUp from './Signup';
import HomepageWithCards from './HomepageWithCards';
import Preferences from './Preferences';
import Profile from './Profile';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';

function App() {

  // TO DO: - Add a state for location and terms to pass as props to Homepage. Get state data from database preferences 

  // Add a state to store the user object
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (userData) => {
    console.log('updateUser: ', userData); // userData is the user object - Remove later for production
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const onSignup = (userData) => {
    console.log('onSignup: ', userData); // userData is the user object - Remove later for production
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <div className="App">
      <Router>
      <AppNavbar user={user}/>
        <Routes>
          <Route exact path="/" element={<HomepageWithCards/>}/>
          <Route exact path="/homepage" element={<HomepageWithCards/>}/>
          <Route exact path="/favorites" element={<Favoritelist/>}/>
          <Route exact path = "/login" element = {<Login updateUser={updateUser}/>}/>
          <Route exact path = "/signup" element = {<SignUp onSignup={onSignup}/>}/>
          <Route exact path="/preferences" element={<Preferences/>}/>
          <Route exact path="/profile" element={<Profile user={user}/>}/>
        </Routes>
      </Router>    
    </div>
  );
}
export default App;
