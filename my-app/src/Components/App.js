import '../Styles/App.css';
import Favoritelist from './Favoritelist';
import Homepage from './Homepage';
import AppNavbar from './AppNavbar';
import Login from './Login';
import SignUp from './Signup';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <div className="App">
      <AppNavbar/>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="/homepage" element={<Homepage/>}/>
          <Route exact path="/favorites" element={<Favoritelist/>}/>
          <Route exact path = "/login" element = {<Login/>}/>
          <Route exact path = "/signup" element = {<SignUp/>}/>
        </Routes>
      </Router>    
    </div>
  );
}
export default App;
