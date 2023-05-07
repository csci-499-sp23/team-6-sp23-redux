import React, { useEffect, useState } from 'react';
import ProfileCSS from '../../Styles/Profile.module.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebase';

export default function UserInfo({ email, username, userLocation }) {
  const user = auth.currentUser
  const [city, setCity] = useState('');

  const storage = getStorage();
  const profileURLPath = `images/${user?.uid}/profile.jpeg`;
  const pathReference = ref(storage, profileURLPath);
  const profileImage = document.getElementById(`${ProfileCSS.ProfileImage}`);
  
  const latitude = userLocation.split(',')[0]
  const longitude = userLocation.split(',')[1]
    
   // Set the profile image from firebase if the user uploaded one
  useEffect(() => {
    if (profileImage !== null) {
      getDownloadURL(pathReference)
      .then((url) => {
        profileImage.setAttribute('src', url);
      })
      .catch((error) => {
        console.log(`Error downloading profile image ${error}`)
      });
    }
   
  }, [profileImage, pathReference]);

  // Fetch user City Location based on their set location
  useEffect(() => {
    const fetchCityName = async () => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const cityComponent = addressComponents.find(component => component.types.includes('locality')) ? addressComponents.find(component=> component.types.includes('locality')) 
                              : addressComponents.find(component => component.types.includes('sublocality')) ? addressComponents.find(component => component.types.includes('sublocality'))
                              : addressComponents.find(component => component.types.includes('political')) ? addressComponents.find(component => component.types.includes('political'))
                              : null
          const cityName = cityComponent ? (cityComponent.long_name || cityComponent.short_name) : 'Unknown';
          setCity(cityName);
      }
      } catch (error) {
        console.error('Error fetching city name: ', error);
        setCity('Unknown');
      }
    };
    if (latitude && longitude) {
      fetchCityName();
    }
  }, [latitude, longitude]);
  
  return (
    <div className={ProfileCSS.UserInfoContainer}>
      <img src="https://via.placeholder.com/150" alt="Profile Avatar" id={ProfileCSS.ProfileImage} width={60} height={60} />
      <div id={ProfileCSS.Username}>{username}</div>

      <div id={ProfileCSS.UserDetailsBox}>
        <div id={ProfileCSS.Location}>Location: {city}</div>
        <div id={ProfileCSS.Email}>Email: {email}</div>
      </div>
      
    </div>
  );
}