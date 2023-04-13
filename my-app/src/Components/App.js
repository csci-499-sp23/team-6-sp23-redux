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
  const id = localStorage.getItem("userId");
  const userId = JSON.parse(id) !== null ? JSON.parse(id) : "";
  const [navigated, setNavigated] = useState(false); // check to see if navigated from login
  const [location, setLocation] = useState(""); // user location
  const [preferences, setPreferences] = useState([]); // preferences data
  const [favorites, setFavorites] = useState([]); // list of hangouts the user liked
  const [categories, setCategories] = useState([]); // category preferences
  
  // will mount
  useEffect( () => {
    var unsubscribe;
    // Event handler used to listen for any changes to user document and return it
    if(userId !== "" && userId !== "undefined" && userId !== null) {
      unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
          var dataArray = Object.entries(doc.data())
          
          dataArray.forEach((data) => {
            switch(data[0]) {
              case "preferences":
                setPreferences(data[1])
                setLocation(data[1].userLocation)
                setCategories(data[1].categories)
                return
              case "favorites":
                setFavorites(data[1])
                return
              default:
                return 
            }
          })
    }
     
      
    )};
    // unmount 
    return () => {
      unsubscribe()
    }
}, [userId])

  // TO DO: - Add a state for location and terms to pass as props to Homepage. Get state data from database preferences 

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
