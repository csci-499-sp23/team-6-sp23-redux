import React, { useState, useEffect } from 'react';
import ProfileCSS from '../Styles/Profile.module.css';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const userID = auth.currentUser?.uid
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID) {
        const userDocRef = doc(db, 'users', userID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [userID]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={ProfileCSS.profileContainer}>
      <h1 className={ProfileCSS.welcome}>Welcome, {userData.email}!</h1>
      {/* Add more user information or functionality as needed */}
      <div className={ProfileCSS.userInfo}>
        {/* Add other user information here, such as user preferences, favorite places, etc. */}
      </div>
    </div>
  );
};

export default Profile;
