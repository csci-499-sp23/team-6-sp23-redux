import './App.css';
import Favoritelist from './Favoritelist';
import Homepage from './Homepage';
import AppNavbar from './AppNavbar';
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <div className="App">
      <AppNavbar/>
      <header className="App-header">
        <Homepage/>  
        
        <Favoritelist/>
      </header>
    </div>
  );
}
///Kamil, you gotta delete the favoritelist, we just put it here so the bot wouldn't complain -Jordan told me to do it (David)
export default App;
