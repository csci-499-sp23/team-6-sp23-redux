import './AppNavbar.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppNavbar() {
    return(
        <Navbar className="color-navbar" expand="lg">
          <Container>
            <Navbar.Brand href="#home">
              <img className="nav-logo" src="easyhangoutlogo.png" alt="nav-logo"></img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#preferences">Preferences</Nav.Link>
                <Nav.Link href="#favorites">Favorites</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    );
}

export default AppNavbar;