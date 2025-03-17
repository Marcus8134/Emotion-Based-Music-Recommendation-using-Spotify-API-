let isPlaying = false;  // Track play/pause state
let songitems = Array.from(document.getElementsByClassName('songitem'));
let masterplay=document.getElementById('masterplay');
let gif=document.getElementById('gif');

window.onSpotifyWebPlaybackSDKReady = async () => {
    await fetchPlaylist();

    if (!token) {
        console.error("Cannot initialize player: No token available");
        return;
    }

    player = new Spotify.Player({
        name: "My Spotify Player",
        getOAuthToken: cb => { cb(token); },
        volume: 1,
        enableMediaSession: true
    });

    player.connect().then(success => {
        if (success) {
            console.log('Player connected successfully');
            player.addListener('ready', ({ device_id: id }) => {
                console.log('Player ready with Device ID', id);
                device_id = id;  // Store the device ID here
                displayPlaylist();
                addSongItemListeners();
            });
        }
    }).catch(error => {
        console.error('Failed to connect player:', error);
    });

    player.addListener('player_state_changed', state => {
        if (!state) return;
        console.log('Currently Playing:', state.track_window.current_track);
    });
};

// Fetch playlist and token
async function fetchPlaylist() {
    try {
        let response = await fetch(`http://localhost:4000/getPlaylist`);
        let data = await response.json();
        
        if (data.Token) {
            token = data.Token;
            console.log("Token fetched:", token);
        } else {
            console.error("Token not found in the response");
            return [];
        }

        songs = data.playlist.map(song => ({
            songName: song.songName.replace(/\s*[\(\[].*?[\)\]]\s*|-.*/g, '').trim(),
            filePath: song.filePath,
            coverPath: song.coverPath.split(', ')[0].trim(),
            duration: song.duration
        }));
        return songs;
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return [];
    }
}

let currentIndex = 0; // Initialize the starting index
const songsPerPage = 13;

async function displayPlaylist() {
    await fetchPlaylist();

    songitems.forEach((element, i) => {
        const songIndex = currentIndex + i;
        if (songIndex < songs.length) {
            let imgElement = element.getElementsByTagName("img")[0];
            let songNameElement = element.getElementsByClassName("songName")[0];
            let du = element.getElementsByClassName("timestamp")[0];

            if (imgElement && songNameElement) {
                imgElement.src = songs[songIndex].coverPath;
                songNameElement.innerText = songs[songIndex].songName;
                du.innerText= songs[songIndex].duration;
            } else {
                console.error("Image or songName element not found for index", i);
            }
        }
    });
}

document.getElementById('refer').addEventListener('click', () => {
    currentIndex += songsPerPage;

    // Loop back to the start if we reach the end of the song list
    //if (currentIndex >= songs.length) {
        //currentIndex = 0;
    //}

    player._options.getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        }).then(response => {
            if (response.ok) {
                console.log('Paused:', songs[songIn].songName);
                isPlaying = false;
                togglePlayPause();  // Update icons to play
            } else {
                return response.json().then(errData => {
                    console.error('Pause Error:', errData);
                });
            }
        }).catch(error => {
            console.error('Error pausing song:', error);
        });
    });

    displayPlaylist(); // Refresh the display with the next set of songs
    addSongItemListeners();
    togglePlayToPause();
});

function togglePlayToPause() {
    document.querySelectorAll('.songitemplay').forEach(element => {
      /*  if (isPlaying) {
            element.classList.remove('fa-circle-play');
            element.classList.add('fa-circle-pause');
        } else {
            element.classList.remove('fa-circle-pause');
            element.classList.add('fa-circle-play');
        }*/
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');

        //document.getElementsByClassName(songitempla)
    });
}

function togglePlayToPauses() {
    document.querySelectorAll('.songitemplay').forEach(element => {
      /*  if (isPlaying) {
            element.classList.remove('fa-circle-play');
            element.classList.add('fa-circle-pause');
        } else {
            element.classList.remove('fa-circle-pause');
            element.classList.add('fa-circle-play');
        }*/
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');

        //document.getElementsByClassName(songitempla)
    });
}


/*function togglePlayToPause1() {
    document.querySelector('.songitemplay').forEach(element => {
      /*  if (isPlaying) {
            element.classList.remove('fa-circle-play');
            element.classList.add('fa-circle-pause');
        } else {
            element.classList.remove('fa-circle-pause');
            element.classList.add('fa-circle-play');
        }
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');

        //document.getElementsByClassName(songitempla)
    });
}*/

async function master()
{
    await addSongItemListeners();

}




async function addSongItemListeners() {
    songitems.forEach((songElement, index) => {
        songElement.removeEventListener('click', songClickListener); // Remove previous listener
        songElement.addEventListener('click', songClickListener);
    });
}

function songClickListener(event) {
    const songElement = event.currentTarget;
    const index = songitems.indexOf(songElement);
    const songIn = currentIndex + index;
    const songUri = songs[songIn].filePath;

    console.log("Playing song URI:", songUri);
    if (device_id && songUri) {
        if (isPlaying && songs[songIn].filePath === songUri) {
            // If the same song is already playing, pause it
            player._options.getOAuthToken(access_token => {
                fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                }).then(() => {
                    console.log('Paused:', songs[songIn].songName);
                    isPlaying = false;
                    togglePlayToPause(); // Update play/pause icons to indicate pause
                    //songElement.querySelector('.songitemplay').classList.remove('fa-circle-pause');
                    //songElement.querySelector('.songitemplay').classList.add('fa-circle-play');
                }).catch(error => {
                    console.error('Error pausing song:', error);
                });
            });
        } else {
            // Play the new song or resume playing
            player._options.getOAuthToken(access_token => {
                // Pause any currently playing song before starting the new one
                fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                }).then(() => {
                    // Play the new song after pausing the current one
                    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                        method: "PUT",
                        body: JSON.stringify({ uris: [songUri] }),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${access_token}`
                        }
                    }).then(() => {
                        console.log('Playing:', songs[songIn].songName);
                        isPlaying = true;
                        togglePlayToPause(); // Update all play/pause icons
                        songElement.querySelector('.songitemplay').classList.remove('fa-circle-play');
                        songElement.querySelector('.songitemplay').classList.add('fa-circle-pause');
                    }).catch(error => {
                        console.error('Error playing song:', error);
                    });
                }).catch(error => {
                    console.error('Error pausing current song:', error);
                });
            });
        }
    } else {
        console.error("Device ID not available or song URI missing");
    }
    

    /*                //////////////////////////////////////////////if (device_id && songUri) {
        player._options.getOAuthToken(access_token => {
            // Pause any currently playing song before starting the new one
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            }).then(() => {
                // Play the new song after pausing the current one
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ uris: [songUri] }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                }).then(() => {
                    console.log('Playing:', songs[songIn].songName);
                    isPlaying = true;
                    togglePlayToPause(); // Update all play/pause icons
                    songElement.querySelector('.songitemplay').classList.remove('fa-circle-play');
                    songElement.querySelector('.songitemplay').classList.add('fa-circle-pause');
                }).catch(error => {
                    console.error('Error playing song:', error);
                });
            }).catch(error => {
                console.error('Error pausing current song:', error);
            });
        });
    } 
    else{console.error("Device ID not available or song URI missing");}
   /* if (songUri && device_id) {  // Ensure device_id is defined
        player.activateElement();
        player.connect();

        player._options.getOAuthToken(access_token => {
            // Pause any currently playing song before starting the new one
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            }).then(() => {
                // Play the new song after pausing the current one
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ uris: [songUri] }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
            //const endpoint = isPlaying ? 'pause' : 'play';
            //fetch(`https://api.spotify.com/v1/me/player/${endpoint}?device_id=${device_id}`, {
              //  method: "PUT",
                //body: isPlaying ? undefined : JSON.stringify({ uris: [songUri] }),
                //headers: {
                  //  "Content-Type": "application/json",
                   // "Authorization": `Bearer ${access_token}`
                //}
            }).then(() => {
                console.log(isPlaying ? 'Paused' : 'Playing', songs[songIn].songName);
                isPlaying = !isPlaying;
                togglePlayToPause();  // Update icons based on play/pause state
                songElement.querySelector('.songitemplay').classList.toggle('fa-circle-pause', isPlaying);
                songElement.querySelector('.songitemplay').classList.toggle('fa-circle-play', !isPlaying);
            }).catch(error => {
                console.error(`Error ${isPlaying ? 'pausing' : 'playing'} song:`, error);
            });
        });
    }else {
        console.error("Device ID not available or song URI missing");
    }
}*/

}
    /*document.getElementById('masterplay').addEventListener('click', () => {
        if(isPlaying=='play')
            {
             
             masterplay.classList.remove('fa-circle-play');
             masterplay.classList.add('fa-circle-pause');
             gif.style.opacity=1;
            }
            else{
             masterplay.classList.remove('fa-circle-pause');
             masterplay.classList.add('fa-circle-play');
             gif.style.opacity=0;
            }
    
    //});*/
//}
/*function songClickListener(event) {
    const songElement = event.currentTarget;
    const index = songitems.indexOf(songElement);
    const songIn = currentIndex + index;
    const songUri = songs[songIn].filePath;

    console.log("Playing song URI:", songUri);

    if (device_id && songUri) {
        player._options.getOAuthToken(access_token => {
            // Pause any currently playing song before starting the new one
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            }).then(() => {
                // Play the new song after pausing the current one
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                    method: "PUT",
                    body: JSON.stringify({ uris: [songUri] }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                }).then(() => {
                    console.log('Playing:', songs[songIn].songName);
                    isPlaying = true;
                    togglePlayToPause(); // Update all play/pause icons
                    songElement.querySelector('.songitemplay').classList.remove('fa-circle-play');
                    songElement.querySelector('.songitemplay').classList.add('fa-circle-pause');
                }).catch(error => {
                    console.error('Error playing song:', error);
                });
            }).catch(error => {
                console.error('Error pausing current song:', error);
            });
        });
    } else {
        console.error("Device ID not available or song URI missing");
    }
}

*/
    
