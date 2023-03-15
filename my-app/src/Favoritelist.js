import './Favoritelist.css';

const handleClick = () => {
    //Will contain the redirect based on element that initially called it.
    alert('Redirect to Hangout place coming soon...');
};

function Favoritelist() {
    return(
        <div className="FavoriteContainer">
            <div className="FavoriteTitle">Your Top Favorites</div>
            <div className="Test">
            <table className="FavoriteTable">
                <tr>
                 <td onClick={handleClick}><img src="Hangoutspot1.jpeg" width="300" alt="hangoutspot1" className="FavoriteImages"></img></td>
                 <td onClick={handleClick}><img src="Hangoutspot2.png" width="300" alt="hangoutspot2"  className="FavoriteImages"></img></td>
                </tr>
  
                <tr>
                 <td onClick={handleClick}><img src="Hangoutspot2.png" width="300" alt="hangoutspot3"  className="FavoriteImages"></img></td>
                 <td onClick={handleClick}><img src="Hangoutspot1.jpeg" width="300" alt="hangoutspot4" className="FavoriteImages"></img></td>
                </tr>
            </table>
            </div>
        </div>
        
    );    
}


export default Favoritelist;
