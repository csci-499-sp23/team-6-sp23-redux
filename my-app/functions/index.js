import express from 'express';
import axios from 'axios';
import cors from 'cors';
import functions from 'firebase-functions';
import dotenv from 'dotenv';

dotenv.config();

/*
For local testing
const PORT = 3001; 
const router = express.Router();
const router1 = express.Router();

*/

const app = express();
app.use(cors({origin: true}));



app.get('/api/hangouts/:category/:location/:radius', async (req, res) => {
    axios.get("https://api.yelp.com/v3/businesses/search", {
        headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        },
        params: {
            term: req.params.category,
            location: req.params.location,
            radius: req.params.radius
        }
    })
    .then(response => {
        console.log(response)
        res.send(response.data)
    })
    .catch(err => {
        console.log(err)
    })
});

app.get('/api/hangouts/:category/:location/', async (req, res) => {
    axios.get("https://api.yelp.com/v3/businesses/search", {
        headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        },
        params: {
            term: req.params.category,
            location: req.params.location,
        }
    })
    .then(response => {
        console.log(response)
        res.send(response.data)
    })
    .catch(err => {
        console.log(err)
    })
});


/*
For local testing
app.use(router);
app.use(router1);
app.listen(PORT, function(error) {
    if (error)
    {
        console.log(error)
    }
    console.log('server listening on PORT', PORT);
})
*/
export const onHangouts = functions.https.onRequest(app); 
