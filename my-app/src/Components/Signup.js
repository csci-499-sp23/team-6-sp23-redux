import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import LoginCSS from '../Styles/Login.module.css'
 
const Signup = () => {
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            navigate("/login")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
 
   
    }
 
  return (
    <main class = {LoginCSS.login}>        
        <section class = {LoginCSS.LoginContainer}>
            <div class = {LoginCSS.LoginDiv}>
                <div>                  
                                                                                            
                    <form>                                                                                            
                        <div>
                            <label htmlFor="email-address"
                                   class = {LoginCSS.LoginText}>
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"  
                                class = {LoginCSS.LoginTextBox}                              
                            />
                        </div>

                        <div>
                            <label htmlFor="password"
                                   class = {LoginCSS.LoginText}>
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password" 
                                class = {LoginCSS.LoginTextBox}             
                            />
                        </div>                                             
                        
                        <button
                            class = {LoginCSS.LoginButton} 
                            type="submit" 
                            onClick={onSubmit}                        
                        >  
                            Sign up                                
                        </button>
                                                                     
                    </form>
                   
                    <p class = {LoginCSS.LoginText}>
                        Already have an account?{' '}
                        <NavLink to="/login" >
                            Sign in
                        </NavLink>
                    </p>                   
                </div>
            </div>
        </section>
    </main>
  )
}
 
export default Signup;