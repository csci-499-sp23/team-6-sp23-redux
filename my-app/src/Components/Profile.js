import React, { useState, useEffect } from 'react';
import ProfileCSS from '../Styles/Profile.module.css';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import UpdatePassword from './ProfilePage/UpdatePassword';
import UserInfo from './ProfilePage/UserInfo';
import UpdateUsername from './ProfilePage/UpdateUsername';
//import UploadImage from './ProfilePage/AvatarUpload';

const ProfilePage = () => {
  const userID = auth.currentUser?.uid;
  const [userData, setUserData] = useState(null);
  const [usernotfound, setUsernotfound] = useState(false);
  const [username, setUsername] = useState('');
  const [userLocation, setUserLocation] = useState(null); // Added userLocation state

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID) {
        const userDocRef = doc(db, 'users', userID);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setUsernotfound(true);
        } else {
          setUsername(userDoc.data().username);
          setUserData(userDoc.data());
          setUserLocation(userDoc.data().preferences.userLocation); // Added this line
        }
      }
    };

    fetchUserData();
  }, [userID]);

  if (usernotfound) {
    return <div>User not found</div>;
  }
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <section className={ProfileCSS['profile-container']}>
      <h1 className={ProfileCSS.welcome}>Welcome, {userData.username}!</h1>
      {/* Add more user information or functionality as needed */}
      <div className={ProfileCSS.userInfo}>
        {/* Add other user information here, such as user preferences, favorite places, etc. */}
      </div>
      <div className={ProfileCSS['profile-card']}>
        <p className={ProfileCSS['profile-card-title']}>Profile</p>
        <UserInfo email={userData.email} username={username} userLocation={userLocation} /> {/* Added userLocation prop */}
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