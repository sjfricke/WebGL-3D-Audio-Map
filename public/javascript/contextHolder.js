var frequencyData = Array(128); //init to size full size for audio
frequencyData.fill(0); //used to start all at zero
//var frequencyData = [217,214,199,182,164,144,139,125,108,97,99,96,90,89,83,79,92,95,80,71,84,90,91,88,87,102,107,101,97,86,74,83,87,68,68,70,72,90,94,84,81,81,81,80,67,64,54,40,46,49,45,41,41,37,34,41,54,56,48,50,58,59,61,73,70,65,48,32,18,7,8,10,12,15,17,24,24,11,10,0,0,0,0,0,0,0,0,0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //init to size full size for audio

var box;

// Global list of the Canvas and GL contexts
var __context = [];
var __shaders = {};


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