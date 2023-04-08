import HangoutDetailCSS from '../Styles/HangoutDetail.module.css';

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

    var closedDetail = props.closed === false ? "This location is currently open." : "This location is currently closed.";
    var locationDetail = props.location2 ? props.location + ", " + props.location2 : props.location;

    return(
        <div className={HangoutDetailCSS.Container}>
            <div id={HangoutDetailCSS.Title}>{props.title}</div>
            <div id={HangoutDetailCSS.Location}>{locationDetail}</div>
            <div id={HangoutDetailCSS.DescriptionContainer}>
                <img id={HangoutDetailCSS.Image} src={props.image} alt="hangout-suggestion"></img>
            </div>
            <div className={HangoutDetailCSS.ExtraInformation}>
                <div>{closedDetail}</div>
                <div className={HangoutDetailCSS.Rating}>Rating: {props.rating}</div>
                <div className={HangoutDetailCSS.ContactInfo}>Contact Information: {props.phone}</div>
                <div id={HangoutDetailCSS.Description}>
                    { props.details &&
                        detailsList
                    }
                </div>
            </div>
            
        </div>
    );
}

export default HangoutDetail;