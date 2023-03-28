import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import LoginCSS from '../Styles/Login.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate('/login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <main className={LoginCSS.login}>
      <section className={LoginCSS.LoginContainer}>
        <div className={LoginCSS.LoginDiv}>
          <div>
            <form>
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

              <button
                className={LoginCSS.LoginButton}
                type="submit"
                onClick={onSubmit}
              >
                Sign up
              </button>
            </form>

            <p className={LoginCSS.LoginText}>
              Already have an account?{' '}
              <NavLink to="/login">
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
