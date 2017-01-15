var audioCtx, analyser, audioDiv, audioSrc;
var songPlaying = false;
function setupAudio(elementID, fftSize, song) {
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    audioDiv = document.getElementById(elementID);
    audioSrc = audioCtx.createMediaElementSource(audioDiv);   
    
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);
    analyser.connect(audioCtx.destination);
    
    analyser.fftSize = fftSize || 256; //only really room for 128 boxes
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    //can pass in variable to get audio after setup
    if (song) { 
        getAudio(song);
    }     
}

function getAudio(song){
    
    audioDiv.src = "audio/" + song;
    audioDiv.load();
    audioDiv.play();
    
    songPlaying = true;
    renderFrame();
}

function startAudio() {
    audioDiv.play();
    renderFrame();
}

function stopAudio() {
    audioDiv.pause();
    songPlaying = false;    
}

 function renderFrame() {
     
     //renderer.renderFrame(frequencyData);   
     if (songPlaying) {
        requestAnimationFrame(renderFrame);         
     }
     // update data in frequencyData     
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData
//     console.log(frequencyData)
  }


/*function playSound(buffer) {
  var audioSrc = audioCtx.createBufferSource(); // creates a sound source
  audioSrc.buffer = buffer;                    // tell the source which sound to play
  audioSrc.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
  audioSrc.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}*/