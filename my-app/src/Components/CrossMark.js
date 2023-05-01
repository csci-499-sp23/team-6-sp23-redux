import React from 'react';
import CrossMarkCSS from '../Styles/CrossMark.module.css';

const CrossMark = () => (
  <div className={CrossMarkCSS.crossmarkContainer}>
    <svg className={CrossMarkCSS.crossmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className={CrossMarkCSS.crossmarkCircle} cx="26" cy="26" r="25" fill="none"/>
      <path className={CrossMarkCSS.crossmarkCross} d="M16 16 36 36 M36 16 16 36"/>
    </svg>
  </div>
);

export default CrossMark;
