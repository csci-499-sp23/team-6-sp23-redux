import AppNavbarCSS from '../Styles/AppNavbar.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppNavbar({ user }) {
  console.log('AppNavbar user: ', user) // Remove later for production
    return(
        <Navbar className={AppNavbarCSS.colorNavbar} expand="lg">
          <Container>
            <Navbar.Brand href="homepage">
              <img className={AppNavbarCSS.navLogo} src="Images/easyhangoutlogo.png" alt="nav-logo"></img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="homepage">Home</Nav.Link>
                <Nav.Link href="preferences">Preferences</Nav.Link>
                <Nav.Link href="favorites">Favorites</Nav.Link>
                {user ? (
                  <Nav.Link href="profile">Profile</Nav.Link>
                ) : (
                <div id={AppNavbarCSS.LoginContainer}>
                  <Nav.Link href="login">Login</Nav.Link>
                  <span className={AppNavbarCSS.LineSeperator}>|</span>
                  <Nav.Link href="signup">Signup</Nav.Link>
                </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    );
}

export default AppNavbar;