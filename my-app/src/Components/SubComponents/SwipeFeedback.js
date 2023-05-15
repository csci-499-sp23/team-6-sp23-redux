import React from 'react';
import SwipeFeedbackCSS from '../../Styles/SwipeFeedback.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import propTypes from 'prop-types';

function SwipeFeedback({accepted}) {
    const acceptedMessages = ["SAVED", "FAVORITED", "STORED", "LIKED", '\u{1F44D}', '\u{1F44F}'];
    const rejectedMessages = ["NOPE", "HARD PASS", "BAD", "NAH", "EW", "NO THANKS", "NEXT", "MEH", '\u{1F4A9}', '\u{1F914}'];
    
    return(
    <div className={SwipeFeedbackCSS.Screen}>
        <div className={ accepted ? SwipeFeedbackCSS.AcceptedContainer : SwipeFeedbackCSS.RejectedContainer}>
            <div className={ accepted ? SwipeFeedbackCSS.AcceptedIconContainer : SwipeFeedbackCSS.RejectedIconContainer}>
                { accepted && <FontAwesomeIcon icon={faCheck} className={SwipeFeedbackCSS.AcceptedIcon}/>}
                { !accepted && <FontAwesomeIcon icon={faX} className={SwipeFeedbackCSS.RejectedIcon}/>}
            </div>
            <div className={ accepted ? SwipeFeedbackCSS.AcceptedMessage : SwipeFeedbackCSS.RejectedMessage}>
                {accepted ? acceptedMessages[Math.floor(Math.random() * acceptedMessages.length)] : rejectedMessages[Math.floor(Math.random() * rejectedMessages.length)]}
            </div>
        </div>
    </div>
    )
}

SwipeFeedback.propTypes = {
    accepted: propTypes.bool.isRequired
}

export default SwipeFeedback;