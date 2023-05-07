import React, { useState } from 'react';
import { auth } from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ProfileCSS from '../../Styles/Profile.module.css';
import AppNavbarCSS from '../../Styles/AppNavbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

function UploadImage() {
  const user = auth.currentUser
  const storage = getStorage();
  const [image, setImage] = useState(null);
  
  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if(image === null) {
      alert("Please upload an image")
      return
    }

    const storageRef = ref(storage, `images/${user.uid}/profile.jpeg`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '%done');

      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is pasued');
          break;
        case 'running':
          console.log('Upload is running');
          break;
        default:
          console.log('Default case')
      }
    }, (error) => {
      console.log(error)
    }, () => {
      //successful upload
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const profileImage = document.getElementById(`${ProfileCSS.ProfileImage}`)
        profileImage.setAttribute('src', downloadURL);
        
        const navbarProfileImage = document.getElementById(`${AppNavbarCSS.ProfilePicture}`);
        navbarProfileImage.setAttribute('src', downloadURL);

      });
    });

  };

  return (
    <div id={ProfileCSS.UploadImageContainer}>
      <div id={ProfileCSS.FileName}>{ image ? image.name : "N/A"}</div>
      <label for={ProfileCSS.ChooseFileButton} className={ProfileCSS.CustomFileButton}>
      <FontAwesomeIcon id={ProfileCSS.UploadFileIcon} icon={faCloudArrowUp}></FontAwesomeIcon>Choose File</label>
      <input id={ProfileCSS.ChooseFileButton} type="file" onChange={handleChange} />
      <button id={ProfileCSS.UploadFileButton} onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadImage;