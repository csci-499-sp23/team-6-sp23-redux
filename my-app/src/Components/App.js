import '../Styles/App.css';
import Favoritelist from './Favoritelist';
import AppNavbar from './AppNavbar';
import Login from './Login';
import SignUp from './Signup';
import HomepageWithCards from './HomepageWithCards'
import Preferences from './Preferences';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect} from 'react';
import { getUserData } from '../Services/UserService';


function App() {

  // TO DO: - Add a state for location and terms to pass as props to Homepage. Get state data from database preferences
  const [location, setLocation] = useState("");
  
  useEffect(() => {
    getUserData().then(data => {
      let userLocation = data.preferences.userLocation
      setLocation(userLocation)
    })
  }, [])

  return (
    <div className="App">
      <AppNavbar/>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomepageWithCards location={location}/>}/>
          <Route exact path="/homepage" element={<HomepageWithCards location={location}/>}/>
          <Route exact path="/favorites" element={<Favoritelist/>}/>
          <Route exact path = "/login" element = {<Login/>}/>
          <Route exact path = "/signup" element = {<SignUp/>}/>
          <Route exact path="/preferences" element={<Preferences/>}/>
        </Routes>
      </Router>    
    </div>
  );
}
export default App;
