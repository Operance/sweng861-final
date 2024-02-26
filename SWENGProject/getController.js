
import axios from "axios";
import dotenv from "dotenv";
import { response } from "express";

// Makes calls to the Spotify API depending upon what was requested. 

async function getSpotifyAccessToken() { //POST request to Spotify to obtain access token, neccessary to make requests.
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const clientId = "";
  const clientSecret = ""; 

  try {
    const response = await axios({
      method: 'post',
      url: tokenUrl,
      params: {
        grant_type: 'client_credentials',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
    });

    return response.data.access_token;
    

  } catch (error) {
    console.error('Failed to retrieve access token:', error);
  }
}



export async function searchForArtistId(artistName) { //Make a request to Spotify API to search for the specified artist. 
  const accessToken = await getSpotifyAccessToken(); //get accessToken from Spotify
  const searchUrl = 'https://api.spotify.com/v1/search';

  try {
    const searchResponse = await axios.get(searchUrl, { //request to Spotify with accessToken in the header and user-defined params. 
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        q: artistName,
        type: 'artist',
        limit: 1, 
      },
    });

    const artists = searchResponse.data.artists.items;
    if (artists.length > 0) {
      const artistId = artists[0].id; //Retreive ID from the first (most relevant) item, the ID must be necessary to get specific details. 
      const data = await getProfile(artistId, accessToken); //Pass ID and accessToken to getProfile function to retrieve artist details
      return data
    } else {
      const data = "No artists found"
      return data
      
    }
  } catch (error) {
    console.error(`Failed to search for artist ${artistName}:`, error);
  }
}

 export async function searchForTrack(trackName) { //Make a request to Spotify API to search for the specified track. 
    const accessToken = await getSpotifyAccessToken(); //get accessToken from Spotify
    const searchUrl = 'https://api.spotify.com/v1/search';
  
    try {
      const response = await axios.get(searchUrl, { //request to Spotify with accessToken in the header and user-defined params. 
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          q: trackName,
          type: 'track',
          limit: 1, 
        },
      });
  
      const tracks = response.data.tracks.items;
      if (tracks.length > 0) {
        const trackId = tracks[0].id; //Retreive ID from the first (most relevant) item, the ID must be necessary to get specific details. 
        const trackName = tracks[0].name;
        const trackArtist = tracks[0].artists.map(artist => artist.name).join(", ");
        console.log(`Found track: ${trackName} by ${trackArtist}, Spotify ID: ${trackId}`);
        const data = getTrackDetails(trackId, accessToken); //Pass ID and accessToken to getTrackDetails function to retrieve track details
        return data;
      } else {
        console.log(`No tracks found for "${trackName}".`);
        return null;
      }
    } catch (error) {
      console.error(`Failed to search for track "${trackName}":`, error);
    }
  }

  async function getTrackDetails(trackId, accessToken) { //request for a specific ID to get track details
    const trackDetailsUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
  
    try {
      const response = await axios.get(trackDetailsUrl, { //request being made with accessToken in header and trackId in url
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
  
      const trackDetails = response.data;
      return trackDetails;
    } catch (error) {
      console.error(`Failed to retrieve track details for ID ${trackId}:`, error);
      return null;
    }
  }
  


  async function getProfile(artistId, accessToken) { //request wwith artistId to get artist profile details
    try {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, { //request being made with accessToken in header and trackId in url
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
  
      const data = response.data;
      return data;
    } catch (error) {
      console.error(`Failed to retrieve artist profile for ID ${artistId}:`, error);
      return null;
    }
  }

