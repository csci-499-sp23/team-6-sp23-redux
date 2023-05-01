import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import styles from '../../Styles/Profile.module.css';
import { collection, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { updateProfile } from 'firebase/auth';


const schema = yup.object().shape({
    username: yup.string().required()
  });

  async function updateFirebaseUsername(newUsername) {
    const user = auth.currentUser;
    const usersRef = collection(db, "users");
  
    // Check if the new username already exists

    if (user.displayName === newUsername) {
      return {error: "You cannot change your username to be the same. Please choose a different username."};
    }

    const q = query(usersRef, where("username", "==", newUsername));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      // The username already exists, return an error
      return { error: "The username already exists. Please choose a different username." };
    }
    
    // Update the username in the authentication profile
    try {
      await updateProfile(user, { displayName: newUsername });
    } catch (error) {
      return { error: "Error updating the username in the authentication profile." };
    }
  
    // Update the username in the Firestore database
    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { username: newUsername });
      console.log("Update successful.")
    } catch (error) {
      return { error: "Error updating the username in the Firestore database." };
    }
  
    // Username updated successfully
    return { success: "Username updated successfully" };
  }
  

  export default function UpdateUsername() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
  
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
    });
  
    const onSubmit = async data => {
      setSubmitting(true);
      setError(null);
  
      const res = await updateFirebaseUsername(data.username)

      if (res?.error){
        setError(res.error);
        setTimeout(() => setError(null), 3000);
      }
      else {
        setSuccess(res.success);
        setTimeout(() => setSuccess(null), 3000);
      }
      setSubmitting(false);
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles['new-password-form']}>
        <label htmlFor="username">New Username</label>
        <input id="username" {...register('username')} type="text" placeholder="New username" />
        {errors.username && <p>{errors.username.message}</p>}

        {error ? <p style={{ color: 'red', fontWeight: 600 }}>{error}</p>
               :
                 <p style={{ color: 'green', fontWeight: 600 }}>{success}</p>
        }

        <button disabled={submitting} type="submit">Update Username</button>
      </form>
    );
  }
  