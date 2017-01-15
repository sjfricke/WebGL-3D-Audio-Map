// init function to set the page up
function pageSetup() {
    
    setupShaders();
    
    var canvasDiv = document.createElement("DIV");
    // set up the canvas and context
    __context[0] = {}; // need to make an empty object to add
    __context[0].canvas = document.createElement("canvas");
    __context[0].canvas.setAttribute("width", window.innerWidth * .98);
    __context[0].canvas.setAttribute("height",window.innerHeight * .88);
    canvasDiv.appendChild(__context[0].canvas);
    
    document.body.appendChild(canvasDiv);
    
    __context[0].gl = initWebGL(__context[0].canvas);
    __context[0].gl = initViewport(__context[0].gl, __context[0].canvas);
    __context[0].canvas = initMatrices(__context[0].canvas);  
    __context[0].box = createBox(__context[0].gl, .1, 0,0,0);    
    __context[0].shaderInfo = initShader(__context[0].gl, __shaders.vertexShader_normal, __shaders.fragmentShader_normal);
    run(__context[0].gl, __context[0].shaderInfo, __context[0].canvas, __context[0].box);    
    //console.log(__context[0]);
}

// sets all the shaders to __shaders list
function setupShaders() {
    __shaders.vertexShader_normal = document.getElementById("vertexShader_normal").text;
    __shaders.fragmentShader_normal = document.getElementById("fragmentShader_normal").text;
}

// Returns gl context
function initWebGL(canvas) {

    var gl = null;
    var msg = "Your browser does not support WebGL, or it is not enabled by default.";
    try {
        gl = canvas.getContext("webgl");
    } catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        alert(msg);
        throw new Error(msg);
    }
    
    return gl;        
 }

function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    return gl;
}

function initMatrices(canvas) {
    // Create a model view matrix with object at 0, 0, -8
    canvas.modelViewMatrix = mat4.create();
    mat4.translate(canvas.modelViewMatrix, canvas.modelViewMatrix, [0, 0, -8]);

    // Create a project matrix with 45 degree field of view
    canvas.projectionMatrix = mat4.create();
    mat4.perspective(canvas.projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);

    canvas.rotationAxis = vec3.create();
    vec3.normalize(canvas.rotationAxis, [1, 1, 1]);
    
    return canvas;
}

function createShader(gl, str, type) {
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// returns the shaderInfo to the context
function initShader(gl, vertexSource, fragmentSource) {

    var shaderInfo = {};
    
    // load and compile the fragment and vertex shader
    var fragmentShader = createShader(gl, fragmentSource, "fragment");
    var vertexShader = createShader(gl, vertexSource, "vertex");

    // link them together into a new program
    shaderInfo.shaderProgram = gl.createProgram();
    gl.attachShader(shaderInfo.shaderProgram, vertexShader);
    gl.attachShader(shaderInfo.shaderProgram, fragmentShader);
    gl.linkProgram(shaderInfo.shaderProgram);

    // get pointers to the shader params
    shaderInfo.shaderVertexPositionAttribute = gl.getAttribLocation(shaderInfo.shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderInfo.shaderVertexPositionAttribute);

    shaderInfo.shaderVertexColorAttribute = gl.getAttribLocation(shaderInfo.shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderInfo.shaderVertexColorAttribute);

    shaderInfo.shaderProjectionMatrixUniform = gl.getUniformLocation(shaderInfo.shaderProgram, "projectionMatrix");
    shaderInfo.shaderModelViewMatrixUniform = gl.getUniformLocation(shaderInfo.shaderProgram, "modelViewMatrix");


    if (!gl.getProgramParameter(shaderInfo.shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    
    return shaderInfo;
}

// frequencyData
function drawRow(gl, shaderInfo, canvas, obj) {

    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderInfo.shaderProgram);

    // connect up the shader parameters: vertex position, color and projection/model matrices
    // set up the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.pos_buffer);
    gl.vertexAttribPointer(shaderInfo.shaderVertexPositionAttribute, obj.pos_item_size, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.color_buffer);
    gl.vertexAttribPointer(shaderInfo.shaderVertexColorAttribute, obj.color_item_size, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.index_buffer);

    gl.uniformMatrix4fv(shaderInfo.shaderProjectionMatrixUniform, false, canvas.projectionMatrix);
    gl.uniformMatrix4fv(shaderInfo.shaderModelViewMatrixUniform, false, canvas.modelViewMatrix);

    // draw the object
//    console.log(gl);
//    console.log(shaderInfo);
//    console.log(canvas);
//    console.log(obj);
    gl.drawElements(obj.primtype, 36, gl.UNSIGNED_SHORT, 0);
}

var duration = 5000; // ms
var currentTime = Date.now();

function animate() {
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    mat4.rotate(modelViewMatrix, modelViewMatrix, angle, rotationAxis);
}

function run(gl, shaderInfo, canvas, box) {

    requestAnimationFrame(function() { 
        run(gl, shaderInfo, canvas, box); 
    });
    
    drawRow(gl, shaderInfo, canvas, box);
    //animate();
}