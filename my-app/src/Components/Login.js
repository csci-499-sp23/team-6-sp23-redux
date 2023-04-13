import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginCSS from '../Styles/Login.module.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;

      //Save the user id to local storage for later use in the app when accessing user data
      localStorage.setItem("userId", JSON.stringify(user.uid));


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
      localStorage.setItem("userId", JSON.stringify(user.uid));
      // Check if the user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      // If the user does not exist, create a new user document with the required data
      if (!userDoc.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email
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
      <main className={LoginCSS.login}>
        <section className={LoginCSS.LoginContainer}>
          <div className={LoginCSS.LoginDiv}>
            <form onSubmit={onLogin}> {/* Add onSubmit attribute */}
              <div>
                <label htmlFor="email-address" className={LoginCSS.LoginText}>
                  Email address
                </label>
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

              <div>
                <label htmlFor="password" className={LoginCSS.LoginText}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={LoginCSS.LoginTextBox}
                />
              </div>

              <div>
                <button className={LoginCSS.LoginButton} type="submit">
                  Login
                </button>
              </div>
            </form>
                <button className={LoginCSS.GoogleSignInButton} onClick={signInWithGoogle}>
                  Login with Google
                </button>

            <p className={LoginCSS.LoginText}>
              No account yet?{' '}
              <NavLink to="/signup" className={LoginCSS.LoginLink}>
                Sign up
              </NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;