import express from 'express';
import axios from 'axios';
import cors from 'cors';
import functions from 'firebase-functions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({origin: true}));

app.get('/api/hangouts/:category/:location', async (req, res) => {
    axios.get("https://api.yelp.com/v3/businesses/search", {
        headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        },
        params: {
            term: req.params.category,
            location: req.params.location
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

export const onHangouts = functions.https.onRequest(app); 
