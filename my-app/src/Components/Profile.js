import React from 'react';
import ProfileCSS from '../Styles/Profile.module.css';
import { auth } from '../firebase';
import UpdatePassword from './ProfilePage/UpdatePassword';
import UserInfo from './ProfilePage/UserInfo';
import UpdateUsername from './ProfilePage/UpdateUsername';
import UploadImage from './ProfilePage/AvatarUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = (props) => {
  const user = auth.currentUser;
  // Used to check if the user signed in with email&password (val = password) or google (val = google.com)
  const userType = user?.providerData[0]["providerId"]; 

  if (!props.isAuthenticated) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={ProfileCSS['profile-container']}>
      <div id={ProfileCSS.PageTitle}>Profile</div>

      <div id={ProfileCSS.FlexContainer}>
        <div id={ProfileCSS.LeftContainer}>
          <div className={ProfileCSS['profile-card']}>
            <UserInfo email={user.email} username={user.displayName} userLocation={props.userLocation} />
          </div>
        </div>
        
        <div id={ProfileCSS.RightContainer}>
          <div id={ProfileCSS.RightContainerHeader}>
            <h2 id={ProfileCSS.RightHeaderTitle}>Edit Details</h2>
            <FontAwesomeIcon id={ProfileCSS.RightHeaderIcon} icon={faUserPen}></FontAwesomeIcon>
          </div>
         
          <div id={ProfileCSS.EditFormsBox}>
          <div className={userType === "password" ? ProfileCSS.RightContainerCell : ProfileCSS.RightContainerCellGoogle}>
            <div className={ProfileCSS.EditFormHeader}>File Upload</div>
            <UploadImage />
          </div>

          <div className={userType === "password" ? ProfileCSS.RightContainerCell : ProfileCSS.RightContainerCellGoogle}>
            <div className={ProfileCSS.EditFormHeader}>Update Username</div> 
            <UpdateUsername />     
          </div>

          
            {  userType === "password" ?
              <div className={ProfileCSS.RightContainerCell}>
                <div className={ProfileCSS.EditFormHeader}>Update Password</div> 
                <UpdatePassword />
              </div>
              :
              null
            }
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
};

export default ProfilePage;