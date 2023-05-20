import React from 'react';
import StackCSS from '../../Styles/ZStack.module.css';
import propTypes from 'prop-types';

function ZStack({style, items}) {

    const itemElements = React.Children.map(items, (item, index) => {
        const itemStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: index,
        };

        return <div style={itemStyle}>{item}</div>
    })

    return (
        <div className={`${StackCSS.Container} ${style}`}>
            {itemElements}
        </div>
    )
}

ZStack.propTypes = {
    style: propTypes.string,
    items: propTypes.array
}

export default ZStack;