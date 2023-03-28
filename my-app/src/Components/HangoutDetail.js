import HangoutDetailCSS from '../Styles/HangoutDetail.module.css';
import './Homepage.js';

function HangoutDetail(props) {
    if(props.details)
    {
        var detailsList = props.details.map(function(detail, index) {
            return(
                <li key={index} >
                    <span className={HangoutDetailCSS.Details}>{detail.title}</span>
                </li>
            )
        });
    }
   

    return(
        <div className={HangoutDetailCSS.Container}>
            <div id={HangoutDetailCSS.Title}>{props.title}</div>
            <div id={HangoutDetailCSS.Location}>{props.location}, {props.location2}</div>
            <div id={HangoutDetailCSS.DescriptionContainer}>
                <img id={HangoutDetailCSS.Image} src={props.image} alt="hangout-suggestion"></img>
                <div id={HangoutDetailCSS.Description}>
                    { props.details &&
                        detailsList
                    }
                </div>
            </div>
            <div className={HangoutDetailCSS.ExtraInformation}>
                <div className={HangoutDetailCSS.Rating}>Rating: {props.rating}</div>
                <div className={HangoutDetailCSS.ContactInfo}>Contact Information: {props.phone}</div>
            </div>
            
        </div>
    );
}

export default HangoutDetail;