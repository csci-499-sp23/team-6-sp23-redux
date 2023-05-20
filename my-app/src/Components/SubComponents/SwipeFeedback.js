import React, { useState } from 'react';
import SwipeFeedbackCSS from '../../Styles/SwipeFeedback.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import propTypes from 'prop-types';

function SwipeFeedback({accept, hide, style}) {
    const acceptedMessages = ["SAVED", "FAVORITED", "STORED", "LIKED", '\u{1F44D}', '\u{1F44F}'];
    const rejectedMessages = ["NOPE", "HARD PASS", "BAD", "NAH", "EW", "NO THANKS", "NEXT", "MEH", '\u{1F4A9}', '\u{1F914}'];
    const [message] = useState ( () => {
        let text = ""
        accept ? text = acceptedMessages[Math.floor(Math.random() * acceptedMessages.length)] : text = rejectedMessages[Math.floor(Math.random() * rejectedMessages.length)]
        return text
    })

    setTimeout(() => {
        hide({show: false, accept: null})
    }, 1500)

    return(
        <div className={style}>
            <div className={ accept ? SwipeFeedbackCSS.AcceptedContainer : SwipeFeedbackCSS.RejectedContainer}>
                <div className={ accept ? SwipeFeedbackCSS.AcceptedIconContainer : SwipeFeedbackCSS.RejectedIconContainer}>
                    { accept && <FontAwesomeIcon icon={faCheck} className={SwipeFeedbackCSS.AcceptedIcon}/>}
                    { !accept && <FontAwesomeIcon icon={faX} className={SwipeFeedbackCSS.RejectedIcon}/>}
                </div>
                <div className={ accept ? SwipeFeedbackCSS.AcceptedMessage : SwipeFeedbackCSS.RejectedMessage}>
                    {message}
                </div>
            </div>
        </div>
    )
}

SwipeFeedback.propTypes = {
    accept: propTypes.bool.isRequired,
    hide: propTypes.func.isRequired,
    style: propTypes.string
}

export default SwipeFeedback;