window.onload = function() {
    "use strict";
    var i; // loop i
    
    /*============= Creating a canvas ======================*/
    var canvasDiv = document.createElement("DIV");
    // set up the canvas and context
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", window.innerWidth * .98);
    canvas.setAttribute("height",window.innerHeight * .88);
    canvasDiv.appendChild(canvas);
    
     document.body.appendChild(canvasDiv);

    var gl = canvas.getContext('webgl');

    /*========== Defining and storing the geometry ==========*/
    box = createBoxSet(frequencyData, gl);

    /*=================== SHADERS =================== */

    var vertCode = document.getElementById("vertexShader_normal").text;
    var fragCode = document.getElementById("fragmentShader_normal").text;

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertShader)); return null; }

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragShader)); return null;  }

    var shaderprogram = gl.createProgram();
    gl.attachShader(shaderprogram, vertShader);
    gl.attachShader(shaderprogram, fragShader);
    gl.linkProgram(shaderprogram);

    if (!gl.getProgramParameter(shaderprogram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders"); }

    


/*==================== MATRIX ====================== */

 function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
       0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
       ];
 }

 var proj_matrix = get_projection(90, canvas.width/canvas.height, 1, 1000); //used to do main projection
 var mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
 var view_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];

 view_matrix[14] = view_matrix[14]-6;

 /*================= Mouse events ======================*/

 var AMORTIZATION = 0.95;
 var drag = false;
 var old_x, old_y;
 var dX = 0, dY = 0;

 var mouseDown = function(e) {
    drag = true;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
    return false;
 };

 var mouseUp = function(e){
    drag = false;
 };

 var mouseMove = function(e) {
    if (!drag) return false;
    dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
    dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
    THETA+= dX;
    PHI+=dY;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
 };

 canvas.addEventListener("mousedown", mouseDown, false);
 canvas.addEventListener("mouseup", mouseUp, false);
 canvas.addEventListener("mouseout", mouseUp, false);
 canvas.addEventListener("mousemove", mouseMove, false);

 /*=========================rotation================*/

 function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;

    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
 }

 function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];

    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
 }

 /*=================== Drawing =================== */

 var THETA = 0,
 PHI = 0;
 var time_old = 0;

 var animate = function(time) {
    var dt = time-time_old;

    if (!drag) {
       dX *= AMORTIZATION, dY*=AMORTIZATION;
       THETA+=dX, PHI+=dY;
    }

    //set model matrix to I4

    mo_matrix[0] = 1, mo_matrix[1] = 0, mo_matrix[2] = 0,
    mo_matrix[3] = 0,

    mo_matrix[4] = 0, mo_matrix[5] = 1, mo_matrix[6] = 0,
    mo_matrix[7] = 0,

    mo_matrix[8] = 0, mo_matrix[9] = 0, mo_matrix[10] = 1,
    mo_matrix[11] = 0,

    mo_matrix[12] = 0, mo_matrix[13] = 0, mo_matrix[14] = 0,
    mo_matrix[15] = 1;

    rotateY(mo_matrix, THETA);
    rotateX(mo_matrix, PHI);

    time_old = time; 
    gl.enable(gl.DEPTH_TEST);

    box = createBoxSet(frequencyData, gl);
    // gl.depthFunc(gl.LEQUAL);

     /*======== Associating attributes to vertex shader =====*/
    var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
    var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
    var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, box.vertex_buffer);
    var _position = gl.getAttribLocation(shaderprogram, "position");
    gl.vertexAttribPointer(_position, box.vertSize, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_position);

    gl.bindBuffer(gl.ARRAY_BUFFER, box.color_buffer);
    var _color = gl.getAttribLocation(shaderprogram, "color");
    gl.vertexAttribPointer(_color, box.colorSize, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(_color);
    gl.useProgram(shaderprogram);
     
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height); //NOT to use to move camera
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, box.index_buffer);
    gl.drawElements(box.primtype, box.nIndices, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(animate);
 }

 animate(0);
    
}