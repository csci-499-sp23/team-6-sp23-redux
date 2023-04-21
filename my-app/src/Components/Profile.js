import React, { useState, useEffect } from 'react';
import ProfileCSS from '../Styles/Profile.module.css';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import UpdatePassword from './ProfilePage/UpdatePassword'
import UserInfo from './ProfilePage/UserInfo'

const ProfilePage = () => {
  const userID = auth.currentUser?.uid
  const [userData, setUserData] = useState(null);
  const [usernotfound, setUsernotfound] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID) {
        const userDocRef = doc(db, 'users', userID);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUsernotfound(true)
      }
    };

    fetchUserData();
  }, [userID]);

  if (!usernotfound) {
    return <div>User not found</div>;
  }
  if (!userData) {
    return <div>Loading...</div>;
  }


  return (
    <section className={ProfileCSS['profile-container']}>
      <h1 className={ProfileCSS.welcome}>Welcome, {userData.email}!</h1>
      {/* Add more user information or functionality as needed */}
      <div className={ProfileCSS.userInfo}>
        {/* Add other user information here, such as user preferences, favorite places, etc. */}
      </div>
      <div className={ProfileCSS['profile-card']}>
        <p className={ProfileCSS['profile-card-title']}>Profile</p>
        <UserInfo email={userData.email} />
      </div>
      <div className={ProfileCSS['profile-card']}>
        <p className={ProfileCSS['profile-card-title']}>Update Password</p>
        <UpdatePassword />
      </div>
    </section>
  );
};

export default ProfilePage;