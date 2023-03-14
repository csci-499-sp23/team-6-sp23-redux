import './App.css';
import Homepage from './Homepage';
import AppNavbar from './AppNavbar';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="App">
      <AppNavbar/>
      <header className="App-header">
        <Homepage/>  
      </header>
    </div>
  );
}

export default App;
