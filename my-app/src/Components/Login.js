import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginCSS from '../Styles/Login.module.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;

      // Retrieve user information from firestore
      // `doc(db, 'users', user.uid)` creates a document reference for the 'users' collection,
      // using the user's UID as the document ID.
      const userDocRef = doc(db, 'users', user.uid);

      // `getDoc()` retrieves the document with the specified document reference.
      // If the document exists, it returns a DocumentSnapshot containing the data;
      // otherwise, the DocumentSnapshot will indicate that the document does not exist.
      const userDoc = await getDoc(userDocRef);

      // Extract the data from the DocumentSnapshot and store it in userData
      const userData = userDoc.data();
      console.log(userData);

      props.setUsername(userData.username); // Pass the username to the parent component

      // Navigate to the homepage after successfully signing in and retrieving user data from Firestore
      props.setNavigated(true)
      navigate('/homepage');
      console.log(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    // Create a new GoogleAuthProvider instance
    const provider = new GoogleAuthProvider();
  
    try {
      // Sign in with the GoogleAuthProvider using signInWithPopup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if the user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      // If the user does not exist, create a new user document with the required data
      if (!userDoc.exists()) {
        const username = user.email.split('@')[0]; // Generate a username from the user's email
  
        const userData = {
          uid: user.uid,
          email: user.email,
          username: username
        };
  
        // Store information in Firestore
        await setDoc(doc(db, 'users', userData.uid), userData);
  
      }
  
      // Navigate to the homepage after successfully signing in and retrieving user data from Firestore
      props.setNavigated(true)
      navigate('/homepage')
    } catch (error) {
      console.log(error.code, error.message);
    }
  };   
  

  return (
    <>
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
              Login
            </label>
            <form onSubmit={onLogin}> {/* Add onSubmit attribute */}
            <div className={LoginCSS.InputFields}>
              <div>
                  <input
                    className={LoginCSS.LoginTextBox}
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={LoginCSS.LoginTextBox}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye} 
                    className={LoginCSS.PasswordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              
              <div className={LoginCSS.ForgotPasswordWrapper}>
                <NavLink to="/forgot-password" className={LoginCSS.LinkLogin}>
                  Forgot password?
                </NavLink>
              </div>

              <div>
                <button className={LoginCSS.LoginButton} type="submit">
                  Login
                </button>
              </div>
            </form>
            <div className={LoginCSS.Separator}>or</div>
                <button className={LoginCSS.GoogleSignInButton} onClick={signInWithGoogle}>
                </button>

            <p className={LoginCSS.TextLogin}>
              
              <NavLink to="/signup" className={LoginCSS.LinkLogin}>
                No account yet?{' '}Register here
              </NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;