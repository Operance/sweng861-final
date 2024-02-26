import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
//Homepage, displaying input boxes for the user and making the proper calls to the backend for data retrieval. 
function App() {
  const [artistId, setArtistId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [artistData, setArtistData] = useState(null); //React useStates to handle variable setting. 
  const [trackData, setTrackData] = useState(null);

  const fetchArtist = async () => { //function to fetch artist data from backend API
    if (!artistId){
      alert("Please enter an artist ID"); //Doesn't allow empty input from user.
    }
    else{
      try {
        const response = await fetch(`http://127.0.0.1:3002/artist/${artistId}`); //Fetch artist data from backend API endpoint using user input.
        console.log(response)
        if (!response.ok) { //Handle bad response from backend. Also forbids usage of invalid characters. 
          alert("HTTP error! Please try again without the use of characters!")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.headers.get("content-type")?.includes("application/json")) {
          const data = await response.json();
          setArtistData(data);
        } else { // If artist data not found
          console.log(response)
          alert("No artist data found for given artist!");
          setArtistData(null); 
        }
      } catch (error) {
        console.error('Error fetching artist:', error.message);
        setArtistData(null); 
      }
    };
    }

  

  const fetchTrack = async () => { //Function to fetch track data from backend API
    if(!trackId){
      alert("Please enter a track ID");
    }
    else{
      try {
        const response = await fetch(`http://127.0.0.1:3002/track/${trackId}`); //fetch track data from the backend API using user input. 
        if (!response.ok) {
          alert("HTTP error! Please try again without the use of characters!")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.headers.get("content-type")?.includes("application/json")) {
          const data = await response.json();
          setTrackData(data);
        } else {
          console.log(response)
          alert("No track data found for given track!");
          setTrackData(null); 
        }
      } catch (error) {
        console.error('Error fetching artist:', error.message);
        setTrackData(null); // Reset the artist data on error
      }
    };
  
    }

  return ( //Render the UI
    <div className="App">
      <h1>Music Search</h1>
      <div className="search-container">
        <div className="input-group">
          <input //Input field for Artist
            type="text"
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            placeholder="Enter Artist ID"
          />
          <button onClick={fetchArtist}>Search Artist</button> 
        </div>
        <div className="input-group">
          <input //Input field for track
            type="text"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="Enter Track ID"
          />
          <button onClick={fetchTrack}>Search Track</button>
        </div>
      </div>
      <div className="display-section">
          {artistData && ( //Conditional rendering so empty containers do not appear when nothing has been called. 
        <div className="card artist-info"> 
          <img 
            src={artistData.images[0].url} 
            alt={artistData.name} 
            className="artist-image" 
          />
          <h2>{artistData.name}</h2>
          <p>Popularity: {artistData.popularity}</p>
          <p>Type: {artistData.type}</p>
          <p>Genres: {artistData.genres.join(', ')}</p>
          <a href={artistData.external_urls.spotify} target="_blank" rel="noopener noreferrer">Spotify Profile</a>
        </div>
      )}        
        {trackData && ( //Conditional rendering so empty containers do not appear when nothing has been called. 
            <div className="card track-info">
            {trackData.album.images.length > 0 && (
              <img 
                src={trackData.album.images[0].url} 
                alt={`Cover of ${trackData.name}`} 
                className="artist-image" 
              />
            )}
            <h2>{trackData.name}</h2>
            <p>Album: {trackData.album.name}</p>
            <p>Release Date: {trackData.album.release_date}</p>
            <p>Popularity: {trackData.popularity}</p>
            <p>Track Number: {trackData.track_number}</p>
            <a href={trackData.external_urls.spotify} target="_blank" rel="noopener noreferrer">Spotify Track</a>
          </div>    
        )}
      </div>
    </div>
  );}
export default App;