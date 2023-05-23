import Modal from 'react-bootstrap/Modal';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import HangoutDetailsCSS from '../Styles/HangoutDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Rating } from '@mui/material';
import React, { useState, useMemo } from 'react';
import MapView from './MapView';
import { getNumLikes } from '../Services/LikesService';
import { toTitleCase, formatNumber } from '../Exports/Functions';

function HangoutDetails({...props}) {
  
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isMobilePortrait] = useState(() => {
    return window.matchMedia("(orientation: portrait").matches;
  })

  const [isMobileLandscape] = useState(() => {
    let width = 915
    return window.matchMedia(`(orientation: landscape) and (max-width: ${width}px)`).matches;
  })

  useMemo(() => {
    if(props.hangoutID && show) {
      getNumLikes(props.hangoutID).then((res) => {
        setNumberOfLikes(res)
      })
      .catch((error) => {
        console.log("Error fetching number of likes: ", error)
      })
    }
  }, [props.hangoutID, show])

  const isOpen = (status) => {
    if(!status){
      return "Open"
    }
    else{
      return "Closed"
    }
  }

  return (
    <div id={`${HangoutDetailsCSS.HangoutDetailsContainer}`}>
      { !show && <button className={HangoutDetailsCSS.ModalInfoButton}  onClick={handleShow} size="sm"></button>  }
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        className={HangoutDetailsCSS.ModalContainer}
        size={ isMobileLandscape ? "lg" : isMobilePortrait ? "lg" : "lg"}
        centered
      >
        <Modal.Header id={HangoutDetailsCSS.ModalHeader}>
          <button className={HangoutDetailsCSS.ModalCloseButton} onClick={handleClose}>
            <div className={HangoutDetailsCSS.CloseButtonImage}></div>
          </button> 
          <div className={HangoutDetailsCSS.HeaderContainer}>
            <Modal.Title id={HangoutDetailsCSS.ModalTitle}><div id={HangoutDetailsCSS.TitleText}>{toTitleCase(props.title)}</div></Modal.Title>
            <div className={HangoutDetailsCSS.RatingContainer}>
              <Rating className={HangoutDetailsCSS.Rating} defaultValue={0} value={props.rating} precision={0.5} size={"large"} readOnly></Rating>
              <div className={HangoutDetailsCSS.LikesContainer}>
                <FontAwesomeIcon icon={faThumbsUp} className={HangoutDetailsCSS.LikesIcon}></FontAwesomeIcon>
                <div className={HangoutDetailsCSS.LikesNumber}>{formatNumber(numberOfLikes)}</div>
              </div>
            </div>  
          </div>
          
        </Modal.Header>
        
        <Modal.Body id={HangoutDetailsCSS.ModalBody}>
          <div className={HangoutDetailsCSS.LeftContainer}>

            <div className={HangoutDetailsCSS.ModalImageContainer}>
              <img className={HangoutDetailsCSS.ModalImage} src={props.image} alt="Hangout modal" />
            </div>

            <div className={HangoutDetailsCSS.DetailsBox}>
              <div className={HangoutDetailsCSS.InfoBox}>
                <span className={HangoutDetailsCSS.InfoDetail}>{"This location is currently " + isOpen(props.closed).toLocaleLowerCase() + "."}</span> 
              </div>
              <div className={HangoutDetailsCSS.InfoBox}><span className={HangoutDetailsCSS.InfoLabel}>Category</span> 
                  <span className={HangoutDetailsCSS.InfoDetail}>{(toTitleCase(props.category))}</span>
              </div>
              <div className={HangoutDetailsCSS.InfoBox}><span className={HangoutDetailsCSS.InfoLabel}>Location</span> 
                  <span className={HangoutDetailsCSS.InfoDetail}>{props.location + ' \n' + props.location2}</span> 
              </div>
            </div>

          </div>

          <div className={HangoutDetailsCSS.RightContainer}>
            <MapView {...props}/>
          </div>

        </Modal.Body>

        <Modal.Footer id={HangoutDetailsCSS.ModalFooter}>

          <div className={HangoutDetailsCSS.urlDiv}><label className={HangoutDetailsCSS.urlBox}>{props.url}</label>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              {copied ? "Link copied to clipboard" : "Copy to clipboard"}
                            </Tooltip>
                          }
                        >
                        <FontAwesomeIcon className={HangoutDetailsCSS.ClipboardIcon} icon={faClipboard} onClick={() =>  {
                          navigator.clipboard.writeText(props.url);
                          setCopied(true); 
                          setTimeout(() => setCopied(false), 2000);
                          }}/>
                        </OverlayTrigger>
          </div>

        </Modal.Footer>

      </Modal>
     
    </div>

  );

}

export default HangoutDetails;