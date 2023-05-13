import React, { useState } from "react";
import Styles from '../../Styles/SegmentedControl.module.css';
import propTypes from 'prop-types';

function SegmentedControl({buttonNames = [], selectedSegment = () => {}}) {

    const [isSelected, setIsSelected] = useState(0);

    const handleClick = (e) => {
        let segment = +(e.target.value)
        setIsSelected(segment)
        selectedSegment(segment)
    }

    return(
        <React.Fragment>
            <div id={Styles.SegmentedControl}>
                {
                    buttonNames.map((title, index) => {
                        return(
                            <button key={title} className={ isSelected === index ? Styles.ButtonSelected : Styles.Button} 
                                    onClick={handleClick} value={index}>{title}
                            </button>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}

SegmentedControl.propTypes = {
    buttonNames: propTypes.arrayOf(propTypes.string).isRequired,
    selectedSegment: propTypes.func.isRequired
};

export default SegmentedControl;