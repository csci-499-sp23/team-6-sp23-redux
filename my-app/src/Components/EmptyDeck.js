import EmptyDeckCSS from '../Styles/EmptyDeck.module.css'

function EmptyDeck(props) {
    
    function handleClick ()
    {
        props.setLoading(true);
        props.setEmpty(true);
    }
    return (
        <div>
            <img src ="Images/question.png" alt = "empty-logo" className = {EmptyDeckCSS.Image}/> 
            
            <div className = {EmptyDeckCSS.Text}>
                <p> Nothing here. Are your preferences too picky?</p>
            </div>

            <div className = {EmptyDeckCSS.ButtonContainer}>
                <button className = {EmptyDeckCSS.RefreshButton} onClick = {handleClick}> 
                    <img src = "Images/refresh.png" alt = "refresh-symbol" className = {EmptyDeckCSS.RefreshButtonImage}></img>
                    <div className={EmptyDeckCSS.ButtonText}>Refresh</div>
                </button>
            </div>

        </div>
    )
}



export default EmptyDeck;