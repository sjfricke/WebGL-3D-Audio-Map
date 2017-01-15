var frequencyData = Array(128); //init to size full size for audio
frequencyData.fill(0); //used to start all at zero

var box;

// Global list of the Canvas and GL contexts
var __context = [];
var __shaders = {};

var back_red = .5;
var back_green = .5;
var back_blue = .5;

var night_mood = true;

function switch_night(){
    night_mood = !night_mood;
}

/*{
    gl : <gl context>,
    canvas : <canvas DOM element>,
    projectionMatrix : <>,
    modelViewMatrix : <>,
    rotationAxis : <>,
    shaderInfo : {
        shaderProgram : <>, 
        shaderVertexPositionAttribute : <>, 
        shaderVertexColorAttribute : <>, 
        shaderProjectionMatrixUniform : <>,
        shaderModelViewMatrixUniform : <>
    }
    
}*/