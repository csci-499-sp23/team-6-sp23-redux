import Modal from 'react-bootstrap/Modal';
import FavoriteModal from '../Styles/FavoriteModal.module.css';
import { Rating } from '@mui/material';
import React, { useState } from 'react';


function Favoritedetails(props) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //helper function for captailiazing (same one was the one in FavoriteLists.s)
  const toTitleCase = (phrase) => {
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

                     
                            
  return (
    <div id={FavoriteModal.FavoriteDetailsContainer}>
  
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        className={FavoriteModal.ModalContainer}
      >
        <Modal.Header id={FavoriteModal.ModalHeader}>
          <button className={FavoriteModal.ModalCloseButton} onClick={handleClose} size="sm">
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
                  </div>
                </div>
            </div>   

        </Modal.Body>
      </Modal>
      <button className={FavoriteModal.ModalInfoButton}  onClick={handleShow} size="sm">
      </button> 
    </div>

  );

}


export default Favoritedetails;