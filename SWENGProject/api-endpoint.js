//api-endpoint to handle calls from the frontend, calls relevant functions for data retrieve from Spotify API.

import express from 'express';
import { searchForArtistId, searchForTrack } from './getController.js'
import cors from 'cors';

const app = express();
const port = 3002;
app.use(cors());

app.get('/artist/:artistId', async (req, res) => { //endpoint for artist data
    try{
        let data = await searchForArtistId(req.params.artistId); //calls searchForArtistId function from getController to retrieve artist data
        res.send(data);

    }catch(err){
        console.error(err);
        res.status(400).end();
    }
})

app.get('/track/:trackId', async (req, res) => { //endpoint for track data
    try{
        let data = await searchForTrack(req.params.trackId); //calls searchForTrack function from getController to retrieve track data
        res.send(data);

    }catch(err){
        console.error(err);
        res.status(400).end();
    }
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => { //defines port to listen for requests on
    console.log(`Server listening on ${port}`)
})