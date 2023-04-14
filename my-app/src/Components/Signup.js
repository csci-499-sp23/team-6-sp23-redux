import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import LoginCSS from '../Styles/Login.module.css';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt to create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed in
      console.log('Authenticated user:', userCredential.user); // Log the authenticated user object

      // Check if user is signed in
      if (userCredential.user) {
        // Create user data object containing the user's UID and email
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email
        };

        // `doc(db, 'users', userData.uid)` creates a document reference for the 'users' collection,
        // using the user's UID as the document ID.
        // `setDoc()` sets the document to the data specified in userData.
        // If a document with the specified ID does not exist it will be created.
        // If the document does exist, its content will be overwritten with the provided data.

        // Store information in firestore
        await setDoc(doc(db, 'users', userData.uid), userData);
        navigate('/login');
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
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // Create user data object containing the user's UID and email
      const userData = {
        uid: user.uid,
        email: user.email
      };
      
      // Store information in firestore
      await setDoc(doc(db, 'users', userData.uid), userData);
      navigate('/login');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };  


  return (
    <main className={LoginCSS.login}>
      <section className={LoginCSS.LoginContainer}>
        <div className={LoginCSS.LoginDiv}>
          <div>
            <form onSubmit={onSubmit}> {/* Add onSubmit here */}
              <div>
                <label htmlFor="email-address" className={LoginCSS.LoginText}>
                  Email address
                </label>
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

              <div>
                <label htmlFor="password" className={LoginCSS.LoginText}>
                  Password
                </label>
                <input
                  type="password"
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className={LoginCSS.LoginTextBox}
                />
              </div>

              <button className={LoginCSS.LoginButton} type="submit">
                Sign up
              </button>
            </form>
              <button className={LoginCSS.GoogleSignInButton} onClick={signInWithGoogle}>
                Sign up with Google
              </button>

            <p className={LoginCSS.LoginText}>
              Already have an account?{' '}
              <NavLink to="/login" className={LoginCSS.LoginLink}>
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;