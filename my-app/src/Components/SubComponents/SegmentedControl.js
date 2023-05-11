import React, { useState } from "react";
import Styles from '../../Styles/SegmentedControl.module.css';

function SegmentedControl({buttonNames, selectedSegment}) {
    let buttonArray = buttonNames

    const [isSelected, setIsSelected] = useState(0);

    const handleClick = (e) => {
        let segment = parseInt(e.target.value)
        setIsSelected(segment)
        selectedSegment(segment)
    }

    return(
        <React.Fragment>
            <div id={Styles.SegmentedControl}>
                {
                    buttonArray.map((title, index) => {
                        return(
                            <button key={index} className={ isSelected === index ? Styles.ButtonSelected : Styles.Button} 
                                    onClick={handleClick} value={index}>{title}
                            </button>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}

export default SegmentedControl;