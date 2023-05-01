import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import styles from '../../Styles/Profile.module.css';
import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";


const schema = yup.object().shape({
    username: yup.string().required()
  });

  async function updateUserUsername(newUsername) {
    const auth = getAuth();
    const user = auth.currentUser;
    const usersRef = collection(db, "users");
  
    // Check if the new username already exists
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
    } catch (error) {
      return { error: "Error updating the username in the Firestore database." };
    }
  
    // Username updated successfully
    return { success: true };
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
  
      const res = await updateUserUsername(data.username);
  
      if (res?.error) setError(error.message);
      else {
        setSuccess("Username updated successfully");
        setTimeout(() => setSuccess(null), 4000);
      }
  
      setSubmitting(false);
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles['new-password-form']}>
        <label htmlFor="username">New Username</label>
        <input id="username" {...register('username')} type="text" placeholder="New username" />
        {errors.username && <p>{errors.username.message}</p>}
  
        <p style={{ color: 'red', fontWeight: 600 }}>{error}</p>
        <p style={{ color: 'green', fontWeight: 600 }}>{success}</p>
  
        <button disabled={submitting} type="submit">Update Username</button>
      </form>
    );
  }
  