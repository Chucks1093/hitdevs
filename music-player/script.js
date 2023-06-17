const music = document.querySelector('audio');
const prevBtn  = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const pauseBtn = document.getElementById('pause');

pauseBtn.style.display = "none"
// Music
const songs = [
     {
       name: 'jacinto-1',
       displayName: 'Electric Chill Machine',
       artist: 'Lorenzo Hamer',
     },
     {
       name: 'jacinto-2',
       displayName: 'No Do (Remix)',
       artist: 'Davido',
     },
     {
       name: 'jacinto-3',
       displayName: 'Goodnight, Disco Queen',
       artist: 'Jacinto Design',
     },
     {
       name: 'metric-1',
       displayName: 'Front Row (Remix)',
       artist: 'Metric',
     }  
];


let isPlaying = false;

function playSong() {
     music.play();
     playBtn.style.display = "none";
     pauseBtn.style.display = "block"
     // playBtn.classList[1].replace('eva-play-circle-outline', 'eva-pause-circle-outline');
     console.log(playBtn.classList)
     playBtn.setAttribute('title','Pause');
     isPlaying = true;
}

function pauseSong() {
     music.pause(); 
     playBtn.style.display = "block";
     pauseBtn.style.display = "none"    
     // playBtn.dataset.eva.replace('pause-circle-outline','play-circle-outline');
     playBtn.setAttribute('title','Play');
     isPlaying = false;
}
// Play or pause event listener
playBtn.addEventListener("click", playSong);
pauseBtn.addEventListener("click", pauseSong);


// Update DOM
function loadSong(song) {
     title.textContent = song.displayName;
     artist.textContent = song.artist;
     music.src = `music/${song.name}.mp3`
     image.src = `img/${song.name}.jpg`
}

// Current Song
let songIndex = 0;

function prevSong() {
     songIndex = songIndex = 0 ? songs.length - 1 : songIndex - 1;
     console.log(songIndex)
     loadSong(songs[songIndex]);
     playSong();
}

function nextSong() {
     songIndex = songIndex == songs.length - 1 ? 0 : songIndex + 1;
     console.log(songIndex)
     loadSong(songs[songIndex]);
     playSong();
}

// On load sellect first song
loadSong(songs[songIndex]); 

function updateProgressBar(e) {
     if(isPlaying) {
          const {duration , currentTime} = e.srcElement;
          // Update progress bar
          const progressBar = (currentTime / duration) * 100;
          progress.style.width = `${progressBar}%`;
          //Calcualte display for duration
          const durationMinutes = Math.floor(duration/ 60);
          let durationSeconds = Math.floor(duration % 60);
          if (durationSeconds < 10) {
              durationSeconds = `0${durationSeconds}` 
          }
          // Delay switching duration Element to avoid Nan
          if (durationSeconds) {
               durationEl.textContent = `${durationMinutes} : ${durationSeconds}`
          }
          //Calcualte display for current
          const currentMinutes = Math.floor(currentTime/ 60);
          let currentSeconds = Math.floor(currentTime % 60);
          if (currentSeconds < 10) {
               currentSeconds = `0${currentSeconds}` 
          }
          currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`
     }
}

function setProgressBar(e) {
     const width = this.clientWidth;
     const clickX = e.offsetX;
     const { duration } = music;
     music.currentTime = ((clickX/width) * duration);
}

// Event Listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);