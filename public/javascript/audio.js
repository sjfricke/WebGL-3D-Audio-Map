var audioCtx, analyser, audioDiv, audioSrc;
var songPlayed = false;
function setupAudio(elementID, fftSize, song) {
    
    // TODO, broken if stopped and started
    /*if (audioDiv.paused) return;
    if (songPlayed) {
        startAudio();
        return;
    }*/    
    if (songPlayed) {return;}
    
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
    
    songPlayed = true;
    renderFrame();
}

function startAudio() {
    clearInterval(lowerWaves);
    audioDiv.play();
    renderFrame();
}

function stopAudio() {
    return; //TODO - fix everything
    audioDiv.pause();  
    lowerWaves = setInterval(function(){
        for (var i = 0; i < frequencyData.length; i++) {            
            if (frequencyData[i] < 3) {
                frequencyData[i] = 0;
            } else { 
                frequencyData[i] -= 2;
            }
        }
    }, 20);
}

 function renderFrame() {
     
     //renderer.renderFrame(frequencyData);   
     if (!audioDiv.paused) {
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