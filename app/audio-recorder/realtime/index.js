// required dom elements
const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');
const titleEl = document.getElementById('real-time-title');

// initial states and global variables
messageEl.style.display = 'none';
let isRecording = false;
let socket;
let recorder;

const run = async () => {
  isRecording = !isRecording;
  buttonEl.innerText = isRecording ? 'Stop' : 'Record';
  titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!'

  if (!isRecording) { 

    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
    
    if (socket) {
      socket.send(JSON.stringify({terminate_session: true}));
      socket.close();
      socket = null;
    }

  } else {
    // TODO: setup websocket and handle events
  }
};

buttonEl.addEventListener('click', () => run());


// get session token from backend
const url = 'https://cors-anywhere.herokuapp.com/';
const response = fetch(`${url}https://api.assemblyai.com/v2/realtime/token`, {
            headers: {
                authorization: 'e18e71fdf81948a79ecefc060b5e807f',
                method: 'POST',
            }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
        console.log(data);
            return data;
        })
        .catch(err => {
            console.log("error: " + err);
        });

console.log(response);
    
const token = response;
// establish wss with AssemblyAI at 16000 sample rate
socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

// handle incoming messages to display transcription to the DOM
const texts = {};
socket.onmessage = (message) => {
    let msg = '';
    const res = JSON.parse(message.data);
    texts[res.audio_start] = res.text;
    const keys = Object.keys(texts);
    keys.sort((a, b) => a - b);
    for (const key of keys) {
        if (texts[key]) {
            msg += ` ${texts[key]}`;
        }
    }
    messageEl.innerText = msg;
};

// handle error
socket.onerror = (event) => {
    console.error(event);
    socket.close();
}
    
// handle socket close
socket.onclose = event => {
    console.log(event);
    socket = null;
}

// handle socket open
socket.onopen = () => {
    // begin recording
    messageEl.style.display = '';
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
        recorderType: StereoAudioRecorder,
        timeSlice: 250, // set 250 ms intervals of data
        desiredSampRate: 16000,
        numberOfAudioChannels: 1, // real-time requires only one channel
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: (blob) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64data = reader.result;

                // audio data must be sent as a base64 encoded string
                if (socket) {
                    socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                }
            };
            reader.readAsDataURL(blob);
        },
    });

    recorder.startRecording();
    })
    .catch((err) => console.error(err));
};
