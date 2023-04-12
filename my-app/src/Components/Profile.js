import React from 'react';
import ProfileCSS from '../Styles/Profile.module.css';

const Profile = ({ user }) => {
    console.log('Profile user: ', user); // Remove later for production
    if (!user) {
      return <div>Loading...</div>; // or some other message
    }
  
    return (
      <div className={ProfileCSS.profileContainer}>
        <h1 className={ProfileCSS.welcome}>Welcome, {user.email}!</h1>
        {/* Add more user information or functionality as needed */}
        <div className={ProfileCSS.userInfo}>
          {/* Add other user information here, such as user preferences, favorite places, etc. */}
        </div>
      </div>
    );
  };
  

export default Profile;
