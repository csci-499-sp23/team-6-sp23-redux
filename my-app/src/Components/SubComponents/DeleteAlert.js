import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DeleteAlertCSS from '../../Styles/DeleteAlert.module.css';
import FavoriteCardCSS from '../../Styles/FavoriteCard.module.css';

function DeleteAlert({deleteHangout, title, category, index, isMostRecent, isCategory}) {
    const[show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <React.Fragment>
            <button className={FavoriteCardCSS.DeleteCardButton} size="sm" onClick={handleShow}>
                <div className={FavoriteCardCSS.DeleteButtonImage}></div>
            </button>
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
        </React.Fragment>
    )
}

export default DeleteAlert;