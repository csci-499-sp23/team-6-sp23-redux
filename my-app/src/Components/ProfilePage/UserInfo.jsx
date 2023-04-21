import React from 'react';
// import { updateUserUsername } from '../../firebase'
import ProfileCSS from '../../Styles/Profile.module.css';

export default function UserInfo({ email }) {
  return (
    <div className={ProfileCSS['']}>
      {/* <img src="https://via.placeholder.com/150" alt="Profile Avatar" className={ProfileCSS['profile-image']} width={60} height={60} /> */}
      {/* <p>Name: John Doe</p> */}
      {/* <p>Location: New York, NY</p> */}
      <p style={{ marginBottom: "0" }}>Email:</p>
      <p>{email}</p>
    </div>
  );
}