const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

function toggleButton() {
     button.disabled = !button.disabled
}

function speak(joke) {
     VoiceRSS.speech({
          key : '64d441a34f684e8d80da7cbf06084b08',
          src : joke,
          hl : 'en-us',
          r : 0,
          c : 'mp3',
          f : '44khz_16bit_stereo',
          ssml : false
     });
};



console.log(button.disabled)

async function getJokes() {
     const apiUrl = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
     try {
          let response = await fetch(apiUrl);
          let data = await response.json();
          console.log(data)
          if (data.type === 'twopart') {
               speak(`${data.setup}...${data.delivery}`)
               toggleButton();
          }else if (data.type === 'single') {
               speak(data.single)
          }
     } catch (error) {
          getJokes()
          console.log(error)
     }
}

button.addEventListener('click', getJokes);
audioElement.addEventListener('ended', toggleButton);