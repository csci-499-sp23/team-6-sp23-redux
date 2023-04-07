import axios from 'axios';

export async function getHangoutLocations(location = "nyc", category1 ,category2 = "",category3 = "") {
    try{
        var hangout1 = [], hangout2 = [], hangout3 = []; // Contains the modified fetched array including a category of the hangout
        await axios.get(`https://yelp-backend.netlify.app/.netlify/functions/search?location=${location}&term=${category1}`).then((response) => {
            
            response.data.businesses.forEach((business, index) => {
                response.data.businesses[index] = {...business, ...{"category":`${category1}`}}
            })
            hangout1 = response.data.businesses;
            
        }).catch((error) => {console.log(error)});

        if(category2 != "") {
            await axios.get(`https://yelp-backend.netlify.app/.netlify/functions/search?location=${location}&term=${category2}`).then((response) => {
            response.data.businesses.forEach((business, index) => {
                    response.data.businesses[index] = {...business, ...{"category":`${category2}`}}
                })
                hangout2 = response.data.businesses;
            }).catch((error) => {console.log(error)});
        }

        if(category3 != "") {
            await axios.get(`https://yelp-backend.netlify.app/.netlify/functions/search?location=${location}&term=${category3}`).then((response) => {
            response.data.businesses.forEach((business, index) => {
                    response.data.businesses[index] = {...business, ...{"category":`${category3}`}}
                })
                hangout3 = response.data.businesses;
            }).catch((error) => {console.log(error)});
        }
        

        //Combines all the promise requests into a single array
        const hangouts = await Promise.all([ hangout1, hangout2, hangout3]);
        return [].concat.apply([], hangouts);
      
    }
    catch(error) {
        console.log(error);
        return [];
    }
}




