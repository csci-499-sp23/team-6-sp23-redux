import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import LoginCSS from '../Styles/Login.module.css';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

//defaultPreferences object for new users
export const defaultPreferences = {
    categories: ['restaurants', 'theaters', 'clubs'],
    userLocation: "",
    rangeLimit: "0",
    ratingLimit: "0",
};

const Signup = (props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Added username state
  const [showPassword, setShowPassword] = useState(false);

  const getGeolocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude},${longitude}`);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get geolocation before signup
      const geolocation = await getGeolocation();

      // Check if user shared location
      if (!geolocation) {
        console.log('Location not shared. Signup denied.');
        return;
      }

      // Attempt to create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed in
      console.log('Authenticated user:', userCredential.user);

      // Check if user is signed in
      if (userCredential.user) {
        // Create user data object containing the user's UID and email
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          username: username,
          preferences: {
            ...defaultPreferences,
            userLocation: geolocation,
          },
        };

        // Update the username in the authentication profile
        try {
        await updateProfile(userCredential.user, { displayName: username });
        } catch (error) {
        return { error: "Error updating the username in the authentication profile." };
        }

        // `doc(db, 'users', userData.uid)` creates a document reference for the 'users' collection,
        // using the user's UID as the document ID.
        // `setDoc()` sets the document to the data specified in userData.
        // If a document with the specified ID does not exist it will be created.
        // If the document does exist, its content will be overwritten with the provided data.

        // Store information in firestore
        await setDoc(doc(db, 'users', userData.uid), userData);

        // Navigate to the homepage after successfully signing in and retrieving user data from Firestore
        props.setNavigated(true)
        navigate('/homepage');
      } else {
        console.log('User is not signed in');
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
      // Get geolocation before signup
      const geolocation = await getGeolocation();

      // Check if user shared location
      if (!geolocation) {
        console.log('Location not shared. Signup denied.');
        return;
      }

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // Create user data object containing the user's UID, email, and generated username
      const username = user.email.split('@')[0]; // Generate a username from the user's email
      
      const userData = {
        uid: user.uid,
        email: user.email,
        username: username,
        preferences: {
          ...defaultPreferences,
          userLocation: geolocation,
        },
      };
  
      // Store information in firestore
      await setDoc(doc(db, 'users', userData.uid), userData);

      // Navigate to the homepage after successfully signing in and retrieving user data from Firestore
      props.setNavigated(true)
      navigate('/homepage');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };


  return (
    <main
      className={LoginCSS.login}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Images/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <header>
          <img id={LoginCSS.AppLogo} src="Images/easyhangoutlogo.png" draggable="false" alt="logo"></img>
        </header>
      <section className={LoginCSS.LoginContainer}>
        <div className={LoginCSS.LoginDiv}>
          <label className={LoginCSS.LoginTitle}>
              Sign up
          </label>
          <div>
            <form onSubmit={onSubmit}>
              <div className={LoginCSS.InputFields}>
                <div>
                  <input
                    type="text"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Username"
                    className={LoginCSS.LoginTextBox}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email address"
                    className={LoginCSS.LoginTextBox}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    label="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className={LoginCSS.LoginTextBox}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className={LoginCSS.PasswordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              
              <button className={LoginCSS.LoginButton} type="submit">
                Sign up
              </button>
            </form>
            <div className={LoginCSS.Separator}>or</div>
            <button className={LoginCSS.GoogleSignInButton} onClick={signInWithGoogle}>
              Sign up with Google
            </button>
            <p className={LoginCSS.TextLogin}>
              
              <NavLink to="/login" className={LoginCSS.LinkLogin}>
                Already have an account?{' '}Log in
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
  
};

export default Signup;