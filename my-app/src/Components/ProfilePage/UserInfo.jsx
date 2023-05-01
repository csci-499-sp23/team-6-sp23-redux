import React, { useEffect, useState } from 'react';
import ProfileCSS from '../../Styles/Profile.module.css';
//import { updateUserUsername } from '../../firebase';

export default function UserInfo({ email, username, userLocation }) {
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchCityName = async () => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const cityComponent = addressComponents.find(component => component.types.includes('locality'));
          const cityName = cityComponent ? cityComponent.long_name : 'Unknown';
          setCity(cityName);
      }
      } catch (error) {
        console.error('Error fetching city name: ', error);
        setCity('Unknown');
      }
    };
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      fetchCityName();
    }
  }, [userLocation]);
  return (
    <div className={ProfileCSS['']}>
      <img src="https://via.placeholder.com/150" alt="Profile Avatar" className={ProfileCSS['profile-image']} width={60} height={60} />
      <p>Name: {username || 'John Doe'}</p>
      <p>Location: {city}</p>
      <p style={{ marginBottom: "0" }}>Email:</p>
      <p>{email}</p>
    </div>
  );
}