import axios from 'axios';

//MARK: - NEW service that fetches from the yelp fusion api
// Params: Location is a string that refers to the user's search location, Categories is an array of strings for each search term
export async function getHangouts(location, categories, radius) {
    try{

        categories = categories.filter(category => category !== "");
        const hangoutsPromises = categories.map(async (category) => {
        try{
            if (radius > 0) {
                //`http://localhost:3001/api/hangouts/${category}/${location}/${radius}` for testing
               const promise = await axios.get(`https://us-central1-easy-hangout-68597.cloudfunctions.net/onHangouts/api/hangouts/${category}/${location}/${radius}`);
               return promise.data.businesses.map(business => ({...business, ...{"category":`${category}`} }) );
            }
            else
            {
                //`http://localhost:3001/api/hangouts/${category}/${location}/` for testing
                const promise = await axios.get(`https://us-central1-easy-hangout-68597.cloudfunctions.net/onHangouts/api/hangouts/${category}/${location}/`);
                return promise.data.businesses.map(business => ({...business, ...{"category":`${category}`} }) );
            }
           
         
        }
        catch(error){
            console.log(error)
        }
        })
        
        const hangouts = await Promise.all([ ...hangoutsPromises]);
        return [].concat.apply([], hangouts);
    }
    catch(error){
        console.log(`GetHangouts Error: ${error}`)
        return [];
    }
} 






