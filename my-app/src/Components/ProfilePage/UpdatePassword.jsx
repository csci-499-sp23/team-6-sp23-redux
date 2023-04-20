import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUserPassword } from '../../firebase'

import styles from '../../Styles/Profile.module.css';

const schema = yup.object().shape({
  password: yup.string().required()
});

// form to reset password
export default function PasswordResetForm() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async data => {
    console.log(data.password)
    setSubmitting(true)
    setError(null)
    // handle password reset
    const res = await updateUserPassword(data.password)

    // display error/success message based on result
    if (res?.error) setError(error.message)
    else {
      setSuccess("Password updated correctly")
      setTimeout(() => setSuccess(null), 4000)
    }

    setSubmitting(false)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['new-password-form']}>
      <label htmlFor="password">New Password</label>
      <input id="password" {...register('password')} type="password" placeholder="******" />
      {errors.password && <p>{errors.password.message}</p>}

      <p style={{ color: 'red', fontWeight: 600 }}>{error}</p>
      <p style={{ color: 'green', fontWeight: 600 }}>{success}</p>

      <button disabled={submitting} type="submit">Reset Password</button>
    </form>
  );
}