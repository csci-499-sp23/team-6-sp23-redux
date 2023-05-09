import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import AlertCSS from '../../Styles/Alert.module.css';

function Alert({title, message, setShowAlert}) {
    const[show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    useEffect(() => {
        setTimeout(() => {
            handleClose()
            setShowAlert({show: false, title: "", message: ""})
        }, 3000)
    // eslint-disable-next-line
    }, [])

    return(
        <React.Fragment>
        <Modal show={show} onHide={handleClose} backdrop={"static"} id={AlertCSS.AlertContainer} >
            <Modal.Header id={AlertCSS.ModalHeader}>
                <Modal.Title id={AlertCSS.ModalTitle}>{title}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body id={AlertCSS.ModalBody}>
                {message}
            </Modal.Body>
        </Modal>
        </React.Fragment>
    )
}

export default Alert;