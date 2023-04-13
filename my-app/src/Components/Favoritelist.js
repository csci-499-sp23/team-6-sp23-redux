import FavoriteListCSS from '../Styles/Favoritelist.module.css';

const handleClick = () => {
    //Will contain the redirect based on element that initially called it.
    alert('Redirect to Hangout place coming soon...');
};

function Favoritelist(props) {
    return(
        <div className={FavoriteListCSS.FavoriteContainer}>
            <div className={FavoriteListCSS.FavoriteTitle}>Your Top Favorites</div>
            <div className={FavoriteListCSS.Test}>
            <table className={FavoriteListCSS.FavoriteTable}>
                <tr>
                 <td onClick={handleClick}><img src="Images/Hangoutspot1.jpeg" width="300" alt="hangoutspot1" className={FavoriteListCSS.FavoriteImages}></img></td>
                 <td onClick={handleClick}><img src="Images/Hangoutspot2.png" width="300" alt="hangoutspot2"  className={FavoriteListCSS.FavoriteImages}></img></td>
                </tr>
  
                <tr>
                 <td onClick={handleClick}><img src="Images/Hangoutspot2.png" width="300" alt="hangoutspot3"  className={FavoriteListCSS.FavoriteImages}></img></td>
                 <td onClick={handleClick}><img src="Images/Hangoutspot1.jpeg" width="300" alt="hangoutspot4" className={FavoriteListCSS.FavoriteImages}></img></td>
                </tr>
            </table>
            </div>
        </div>
        
    );    
}


export default Favoritelist;
