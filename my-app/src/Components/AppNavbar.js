import React from 'react';
import AppNavbarCSS from '../Styles/AppNavbar.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { signOutUser } from '../firebase';
import { useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';
import { useEffect } from 'react';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{
      background: "none",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit"
    }}
  >
    {children}
  </button>
));


function AppNavbar({ isAuthenticated }) {
  const navigate = useNavigate();

  const logoutUser = async () => {
    const res = await signOutUser()
    if (!res?.error) {
      sessionStorage.removeItem('userID');
      navigate("/");
    }
  };
  
  const userID = sessionStorage.getItem('userID')
  const user = auth.currentUser
  const storage = getStorage();
  const profileURLPath = `images/${user?.uid}/profile.jpeg`;
  const pathReference = ref(storage, profileURLPath);
  const profileImage = document.getElementById(`${AppNavbarCSS.ProfilePicture}`);

   // Set the profile image from firebase if the user uploaded one
   useEffect(() => {
    if (profileImage !== null) {
      getDownloadURL(pathReference)
      .then((url) => {
        profileImage.setAttribute('src', url);
      })
      .catch((error) => {
        console.log(`Error downloading profile image ${error}`)
      });
    }
   
  }, [profileImage, pathReference]);

  if (userID || isAuthenticated) {
    return (
      <Navbar id={AppNavbarCSS.Navbar} expand="lg">
        <Container>
          <Navbar.Brand>
            <img className={AppNavbarCSS.navLogo} src="Images/easyhangoutlogo.png" alt="nav-logo"></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className={AppNavbarCSS.NavbarCollapse}>
            <Nav className="me-auto">
              <div id={AppNavbarCSS.RoutesContainer}>
                <Nav.Link className={AppNavbarCSS.Link} href="homepage"><h4 className={AppNavbarCSS.LinkText}>Home</h4></Nav.Link>
                <Nav.Link className={AppNavbarCSS.Link} href="preferences"><h4 className={AppNavbarCSS.LinkText}>Preferences</h4></Nav.Link>
                <Nav.Link className={AppNavbarCSS.Link} href="favorites"><h4 className={AppNavbarCSS.LinkText}>Favorites</h4></Nav.Link>
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                  <div id={AppNavbarCSS.ProfileDropdownContainer}>
                    <img src="https://via.placeholder.com/150" alt="Profile Avatar" width={50} height={50} className="rounded-circle" id={AppNavbarCSS.ProfilePicture} />
                    <div id={AppNavbarCSS.NavbarUsername}>{user?.displayName}</div>
                    <img src="http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png" alt="Dropdown"></img>
                  </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={AppNavbarCSS.DropdownMenu} align={"end"}>
                    <Dropdown.Item className={AppNavbarCSS.DropdownItem} href="profile"><div className={AppNavbarCSS.ItemTitle}>Profile</div></Dropdown.Item>
                    <Dropdown.Item className={AppNavbarCSS.DropdownItem} onClick={logoutUser}><div className={AppNavbarCSS.ItemTitle}>Logout</div></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  } else {
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