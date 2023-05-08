import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink } from 'react-router-dom';
import LoginCSS from '../Styles/Login.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
        let errorMessage = '';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
        setMessage(errorMessage);
      }      
  };

  return (
    <>
      <main className={LoginCSS.login}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Images/cafe.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      >
        <section className={LoginCSS.LoginContainer}>
          <div className={LoginCSS.LoginDiv}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  className={LoginCSS.LoginTextBox}
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage('');
                  }}
                />
              </div>

              <div>
                <button className={LoginCSS.LoginButton} type="submit">
                  Reset Password
                </button>
              </div>
            </form>
            {message && <p>{message}</p>}
            <p className={LoginCSS.TextLogin}>
              Remember your password?{' '}
              <NavLink to="/login" className={LoginCSS.LinkLogin}>
                Login
              </NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default ForgotPassword;

