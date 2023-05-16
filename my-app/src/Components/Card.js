import React, { useState, useRef } from 'react';
import CardCSS from '../Styles/Card.module.css';
import Modal from 'react-bootstrap/Modal';
import FavoriteModal from '../Styles/FavoriteModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rating } from '@mui/material';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import toTitleCase from '../Utils/Text';
import { useEffect } from 'react';

function Card(props) {
  const locationDetail = props.location2 ? props.location + ", \n" + props.location2 : props.location;
  const [show, setShow] = useState(false);
  const [intv, setIntv] = useState(null);
  const cardRef = useRef(null)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //To miles function
  function toMiles(meters) {
    return parseInt(meters) * 0.000621371;
  }

  useEffect(() => {

    return () => {
      if (intv) {
        clearInterval(intv)
      }
    }
  },[intv])

  const isOpen = (status) => {
    if (!status) {
      return "Open"
    }
    else {
      return "Closed"
    }
  }

  const onPosionChange = () => {
    let i = setInterval(() => {
      if(cardRef.current){
        let width = cardRef.current.getBoundingClientRect().width
        let x = cardRef.current.getBoundingClientRect().x
        props.handleChangePositon(x, width)
      }
    }, 500)

    setIntv(i)
    props.handleIntervalUpdate(i)
  }



  return (
    <React.Fragment>
      <div
        ref={cardRef}
        draggable
        onDragStart={(e) => {
          e.preventDefault()
          // props.handleChangePositon()
          onPosionChange()

        }}
        className={`${CardCSS.CardContainer}  ${(props.isTop ? CardCSS.TopCard : CardCSS.OtherCards)}`}>
        <img draggable='false' id={CardCSS.Image} src={props.image} alt="hangout-suggestion"></img>

        <div id={CardCSS.Title}>{props.title}</div>

        <div onClick={handleShow} id={CardCSS.BottomContainer}>
          <div id={CardCSS.LocationContainer}>
            <div className={CardCSS.DetailLabel}>Location: </div>
            <div className={CardCSS.Detail}>{locationDetail}</div>
          </div>

          <div id={CardCSS.DistanceContainer}>
            <div className={CardCSS.DetailLabel}>Distance: </div>
            <div className={CardCSS.Detail}>{toMiles(props.distance).toFixed(2)} miles away</div>
          </div>
        </div>


      </div>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        className={FavoriteModal.ModalContainer}
      >
        <Modal.Header id={FavoriteModal.ModalHeader}>
          <button className={FavoriteModal.ModalCloseButton} onClick={() => setShow(false)} size="sm">
            <div className={FavoriteModal.CloseButtonImage}></div>
          </button>
          <div className={FavoriteModal.ModalImageContainer}>
            <img className={FavoriteModal.modalImage} src={props.image} alt="Hangout modal" />
          </div>
        </Modal.Header>
        <Modal.Body id={FavoriteModal.ModalBody}>
          <div className={FavoriteModal.ModalInfo}>
            <div id={FavoriteModal.TitleBox}>
              <Modal.Title id={FavoriteModal.ModalTitle}><div id={FavoriteModal.TitleText}>{toTitleCase(props.title)}</div></Modal.Title>
              <Rating className={FavoriteModal.Rating} defaultValue={0} value={props.rating} precision={0.5} size={"large"} readOnly></Rating>
            </div>


            <div className={FavoriteModal.DetailsBox}>
              <div className={FavoriteModal.InfoBox}><span className={FavoriteModal.InfoLabel}>Category</span>
                <span className={FavoriteModal.InfoDetail}>{(toTitleCase(props.category))}</span>
              </div>

              <div className={FavoriteModal.InfoBox}><span className={FavoriteModal.InfoLabel}>Location</span>
                <span className={FavoriteModal.InfoDetail}>{props.location + ' \n' + props.location2}</span>
                <span className={FavoriteModal.InfoDetail}>{"This location is " + isOpen(props.closed)}</span>
                <div className={FavoriteModal.urlDiv}><label className={FavoriteModal.urlBox}>{props.url}</label>
                  <FontAwesomeIcon className={FavoriteModal.ClipboardIcon} icon={faClipboard} onClick={() => navigator.clipboard.writeText(props.url)} /></div>

              </div>

            </div>
          </div>

        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Card;

/*{showCardDetails ?
        <div className={CardCSS.DetailContainer}>
          <HangoutDetail
              className={CardCSS.DetailContainer} 
              title={props.title} 
              image={props.image} 
              distance={props.distance}
              phone={props.phone || "N/A"} 
              location={props.location}
              location2={props.location2}
              details={props.details}
              rating={props.rating}
              price={props.price}
              closed={props.closed}
              latitude={props.latitude}
              longitude={props.longitude}
              userLatitude={props.userLatitude}
              userLongitude={props.userLongitude}
            />
        </div>
        : null
      }*/ 