import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginCSS from '../Styles/Login.module.css';
 
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/homepage")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }
 
    return(
        <>
            <main class = {LoginCSS.login}>        
                <section class = {LoginCSS.LoginContainer}>
                    <div class = {LoginCSS.LoginDiv}>                                            
                                            
                                                       
                        <form>                                              
                            <div>
                                <label htmlFor="email-address"
                                       class = {LoginCSS.LoginText}>
                                    Email address
                                </label>
                                <input
                                    class = {LoginCSS.LoginTextBox}
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password"
                                        class = {LoginCSS.LoginText}>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                    class = {LoginCSS.LoginTextBox}
                                />
                            </div>
                                                
                            <div>
                                <button   
                                    class = {LoginCSS.LoginButton}                                 
                                    onClick={onLogin}                                       
                                >      
                                    Login                                                                  
                                </button>
                            </div>                               
                        </form>
                       
                        <p class = {LoginCSS.LoginText}>
                            No account yet? {' '}
                            <NavLink to="/signup">
                                Sign up
                            </NavLink>
                        </p>
                                                   
                    </div>
                </section>
            </main>
        </>
    )
}
 
export default Login;