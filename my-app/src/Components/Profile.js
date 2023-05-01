import React from 'react';
import ProfileCSS from '../Styles/Profile.module.css';
import { auth } from '../firebase';
import UpdatePassword from './ProfilePage/UpdatePassword';
import UserInfo from './ProfilePage/UserInfo';
import UpdateUsername from './ProfilePage/UpdateUsername';
//import UploadImage from './ProfilePage/AvatarUpload';

const ProfilePage = (props) => {
  const user = auth.currentUser;

  if (!props.isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <section className={ProfileCSS['profile-container']}>
      <h1 className={ProfileCSS.welcome}>Welcome, {user.displayName}!</h1>
      {/* Add more user information or functionality as needed */}
      <div className={ProfileCSS.userInfo}>
        {/* Add other user information here, such as user preferences, favorite places, etc. */}
      </div>
      <div className={ProfileCSS['profile-card']}>
        <p className={ProfileCSS['profile-card-title']}>Profile</p>
        <UserInfo email={user.email} username={user.displayName} userLocation={props.userLocation} /> {/* Added userLocation prop */}
      </div>
      {/* <div>
      <UploadImage />
      </div> */}
      <div>
      <UpdateUsername />
      </div>
      <div className={ProfileCSS['profile-card']}>
        <p className={ProfileCSS['profile-card-title']}>Update Password</p>
        <UpdatePassword />
      </div>
    </section>
  );
};

export default ProfilePage;