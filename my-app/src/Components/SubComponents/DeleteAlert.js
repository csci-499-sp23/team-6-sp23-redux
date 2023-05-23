import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DeleteAlertCSS from '../../Styles/DeleteAlert.module.css';
import FavoriteCardCSS from '../../Styles/FavoriteCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function DeleteAlert({style, deleteHangout, title, category, index, isMostRecent, isCategory}) {
    const[show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className={style}>

        <FontAwesomeIcon onClick={handleShow} icon={faXmark} color='white' className={FavoriteCardCSS.XMark}/>

        <Modal show={show} onHide={handleClose} id={DeleteAlertCSS.AlertContainer}>
            <Modal.Header>
                <Modal.Title id={DeleteAlertCSS.ModalTitle}>{title}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body id={DeleteAlertCSS.ModalBody}>
                Are you sure you would like to <br/> delete <span style={{fontWeight:'bold'}}>{title}</span>?
            </Modal.Body>

            <Modal.Footer id={DeleteAlertCSS.ModalFooter}>
                <button id={DeleteAlertCSS.CancelButton} onClick={handleClose}>Cancel</button>
                <button id={DeleteAlertCSS.DeleteButton} onClick={() => {
                    deleteHangout(category, index, isMostRecent, isCategory)
                    handleClose()
                }}>Delete</button>
            </Modal.Footer>

        </Modal>
        </div>
    )
}

export default DeleteAlert;