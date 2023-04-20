import AppNavbarCSS from '../Styles/AppNavbar.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { signOutUser } from '../firebase';
import { useNavigate } from "react-router-dom";

function AppNavbar({ isAuthenticated }) {
  const navigate = useNavigate();

  const logoutUser = async () => {
    const res = await signOutUser()
    if (!res?.error) {
      // setIsAuthenticated(false)
      sessionStorage.removeItem('userID');
      navigate("/");
    }
  };
  
  const userID = sessionStorage.getItem('userID') // used for when isAuthenticated status is null on initial render
  // The user is logged in
  if (userID || isAuthenticated) {
    return (
      <Navbar className={AppNavbarCSS.colorNavbar} expand="lg">
        <Container>
          <Navbar.Brand>
            <img className={AppNavbarCSS.navLogo} src="Images/easyhangoutlogo.png" alt="nav-logo"></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <div id={AppNavbarCSS.mainContainer}>
                <Nav.Link href="homepage">Home</Nav.Link>
                <Nav.Link href="preferences">Preferences</Nav.Link>
                <Nav.Link href="favorites">Favorites</Nav.Link>
                <Nav.Link href="profile">Profile</Nav.Link>
                <button style={{ margin: "4px", color: "black" }} onClick={logoutUser}>Logout</button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  } // User not logged in yet
  else {
    return (
      <Navbar className={AppNavbarCSS.colorNavbar} expand="lg">
        <Container>
          <Navbar.Brand>
            <img className={AppNavbarCSS.navLogo} src="Images/easyhangoutlogo.png" alt="nav-logo"></img>
            <span id={AppNavbarCSS.welcomeLogo}>Welcome to EasyHangout!</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <div id={AppNavbarCSS.LoginContainer}>
                <Nav.Link href="login">Login</Nav.Link>
                <span className={AppNavbarCSS.LineSeperator}>|</span>
                <Nav.Link href="signup">Signup</Nav.Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default AppNavbar;