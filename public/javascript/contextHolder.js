var frequencyData = Array(1024); //init to size full size for audio

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