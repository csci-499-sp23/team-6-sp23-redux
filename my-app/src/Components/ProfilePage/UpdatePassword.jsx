import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUserPassword } from '../../firebase'
import styles from '../../Styles/Profile.module.css';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from 'firebase/auth';

const schema = yup.object().shape({
  password: yup.string().required(),
  current_password: yup.string().required(),
  confirm_password: yup.string().required()
});

// form to reset password
export default function PasswordResetForm() {
  const user = getAuth().currentUser
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
 
  const onSubmit = async data => {
    setSubmitting(true)
    setError(null)

    if(data.password !== data.confirm_password) {
      setError("Your new password and confirmation password does not match!")
      setSubmitting(false)
      return
    }

    if(data.password === data.current_password) {
      setError("Please choose a different password than your current password.")
      setSubmitting(false)
      return
    }
    
    // Reauthenticate the user to check if the password is correct
    const credential = EmailAuthProvider.credential(user.email, data.current_password);
    reauthenticateWithCredential(user, credential)
    .then( async (res) => {
      console.log(res)
      // Update the user password after successful reauthentication
      const response = await updateUserPassword(data.password)

      if(response.error) {
        setError("There was an error updating your password..Please try again...")
        setTimeout(() => setError(null), 3000)
        setSubmitting(false)
      }
      else {
        console.log(response.message)
        setSuccess("Password Successfully Updated!")
        setTimeout(() => setSuccess(null), 3000)
        setSubmitting(false)
      }
      
    })
    .catch((error) => {
      console.log(error)
      setError("Invalid password entered")
      setTimeout(() => setError(null), 3000)
      setSubmitting(false)
    })
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['new-password-form']}>
      <label htmlFor="password">Current Password</label>
      <input id="current_password" {...register('current_password')} type="password" placeholder="Current Password"/>
      <label htmlFor="password">New Password</label>
      <input id="password" {...register('password')} type="password" placeholder="New Password" />
      <input id="confirm_password" {...register('confirm_password')} type="password" placeholder="Confirm Password"/>
      {errors.password && <p>{errors.password.message}</p>}

      <p style={{ color: 'red', fontWeight: 600 }}>{error}</p>
      <p style={{ color: 'green', fontWeight: 600 }}>{success}</p>

      <button disabled={submitting} type="submit">Reset Password</button>
    </form>
  );
}