import axios from 'axios';

// Params: Location is a string that refers to the user's search location, Categories is an array of strings for each search term
export async function getHangoutLocations(location, categories) {
    try{
        categories = categories.filter(category => category !== "");
        const hangoutsPromises = categories.map(async (category) => {
            try {
                const response = await axios.get(`https://yelp-backend.netlify.app/.netlify/functions/search?location=${location}&term=${category}`);
                return response.data.businesses.map(business => ({...business, ...{"category":`${category}`} }) );
            } catch (error) {
                console.log(`Error fetching hangout location for ${category}: ${error}`);
            }            
        });
       
        //Combines all the promise requests into a single array
        const hangouts = await Promise.all([ ...hangoutsPromises]);
        return [].concat.apply([], hangouts);
      
    }
    catch(error) {
        console.log(`GetHangoutLocations Error: ${error}`);
        return [];
    }
}




