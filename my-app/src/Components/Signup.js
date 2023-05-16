import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import LoginCSS from '../Styles/Login.module.css';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {categoryList} from '../Exports/categoryList.js';
import { Formik } from 'formik';
import * as yup from "yup";

const Signup = (props) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  //Helper function for retrieving random elements of an array
  //Select three random categories for the user on account creation
  const getRandomCategories = (array) => {
    const shuffled = array.sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, 3); 
  };

  const randomCategories = getRandomCategories(categoryList);

  const defaultPreferences = {
    categories: randomCategories,
    userLocation: "",
    rangeLimit: "0",
    ratingLimit: "0",
  };


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

  const onSubmit = async ({email, username, password}) => {

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
            <Formik
              initialValues={{
                username:"",
                email:"",
                password:""
              }}

              onSubmit={(values)=>onSubmit(values)}
              validationSchema={
                  yup.object().shape({
                    username:yup.string().required().label('Username'),
                    email:yup.string().required().email().label('Email'),
                    password:yup.string().required().max(30).label('Password')
                  })
              }
              >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched
              })=>(<>
                <div className={LoginCSS.InputFields}>
                <div>
                  <input
                    type="text"
                    label="Username"
                    value={values.username}
                    onChange={handleChange("username")}
                    onBlur={handleBlur("username")}
                    placeholder="Username"
                    className={LoginCSS.LoginTextBox}
                  />
                  {touched.username && errors.username && (
                    <span className='error-message'>{errors.username}</span>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    label="Email address"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="Email address"
                    className={LoginCSS.LoginTextBox}
                  />
                  {touched.email && errors.email && (
                    <span className='error-message'>{errors.email}</span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    label="Create password"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Password"
                    className={LoginCSS.LoginPasswordBox}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className={LoginCSS.PasswordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {touched.password && errors.password && (
                    <span className='error-message'>{errors.password}</span>
                  )}
              </div>

              <button onClick={handleSubmit} className={LoginCSS.LoginButton} type="submit">
                Sign up
              </button></>)}
            </Formik>
            <div className={LoginCSS.Separator}>or</div>
            <button className={LoginCSS.GoogleSignUpButton} onClick={signInWithGoogle}>
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