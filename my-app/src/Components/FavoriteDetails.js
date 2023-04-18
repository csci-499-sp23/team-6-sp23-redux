import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FavoriteModal from '../Styles/FavoriteModal.module.css';
import React, { useState } from 'react';


function Favoritedetails(props) {

  //console.log(props.props); //I'm assuming this is due to the way props have to be passed.
  //console.log((props.location+' ' +props.location2));
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
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop={"static"}
        keyboard={false}
        
      >
        <Modal.Header>
          <Modal.Title>{props.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className={FavoriteModal.modalInfo} onClick={() => handleClose()}>

                <div>Categories: {toTitleCase(props.props.category)}</div>
                <div>Rating: {props.props.rating + " Stars"}</div>
                <div>Location: {props.props.location + ' ' + props.props.location2}</div>

            </div>
            <div><img className={FavoriteModal.modalImage} src={props.props.image}></img></div>
            

        </Modal.Body>
        <Button className={FavoriteModal.modalCloseButton} variant="danger" onClick={handleClose} size="sm">
        Close
        </Button> 
      </Modal>
      <Button className={FavoriteModal.modalInfoButton} variant="warning" onClick={handleShow} size="sm">
        More Info!
      </Button> 

    </>

  );

}


export default Favoritedetails;