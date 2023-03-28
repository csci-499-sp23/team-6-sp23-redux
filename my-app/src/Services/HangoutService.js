import axios from 'axios';

export async function getHangoutLocations() {
    try{
        const restaurants = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=restaurant');
        const theaters = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=theater');
        const parks = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=park');
        const museums = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=museum');
        const clubs = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=club');
        const karaokes = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=karaoke');
        const arcades = await axios.get('https://yelp-backend.netlify.app/.netlify/functions/search?location=nyc&term=arcade');


        // Combines all the promise requests into a single array
        const hangouts = await Promise.all([restaurants.data.businesses, 
                                            theaters.data.businesses, 
                                            parks.data.businesses, 
                                            museums.data.businesses,
                                            clubs.data.businesses,
                                            karaokes.data.businesses,
                                            arcades.data.businesses]);
        return [].concat.apply([], hangouts);
    }
    catch(error) {
        console.log(error);
        return [];
    }
}




