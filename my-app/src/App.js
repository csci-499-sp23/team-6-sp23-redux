import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from './containers/navbar'
import HomePage from "./containers/homepage"
import Login from './containers/Login';
import SignUp from './containers/signup';

function App() {
  return (
    <div className="App">
        <NavBar/>
        <Router>
          <Routes>
            <Route exact path = "/Login" element = {<Login/>}/>
            <Route exact path = "/homepage" element = {<HomePage/>}/>
            <Route exact path = "/Signup" element = {<SignUp/>}/>
            </Routes>
        </Router>
        
      
    </div>
  );
}

export default App;
