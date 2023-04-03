import '../Styles/App.css';
import Favoritelist from './Favoritelist';
import AppNavbar from './AppNavbar';
import Login from './Login';
import SignUp from './Signup';
import HomepageWithCards from './HomepageWithCards'
import Preferences from './Preferences';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="App">
      <AppNavbar/>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomepageWithCards/>}/>
          <Route exact path="/homepage" element={<HomepageWithCards/>}/>
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
