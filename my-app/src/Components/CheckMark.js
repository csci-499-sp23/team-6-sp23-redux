import React from 'react';
import CheckMarkCSS from '../Styles/CheckMark.module.css';

const CheckMark = () => (
  <div className={CheckMarkCSS.checkmarkContainer}>
    <svg className={CheckMarkCSS.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className={CheckMarkCSS.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
      <path className={CheckMarkCSS.checkmarkCheck} d="M14 27l7 7 17-17"/>
    </svg>
  </div>
);

export default CheckMark;
