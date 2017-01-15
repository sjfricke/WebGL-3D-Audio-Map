// Create the vertex, color and index data for a multi-colored cube
function createBox(gl, height, red, green, blue) {
    
    // Create and store data into vertex buffer
    var vertex_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getPosBuf(height)), gl.STATIC_DRAW);

    // Create and store data into color buffer
    var color_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getColorBuf(red, green, blue)), gl.STATIC_DRAW);

    // Create and store data into index buffer
    var index_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(box_triangle_indices), gl.STATIC_DRAW);
    
    
    var box = {
        vertex_buffer: vertex_buffer,         
        color_buffer: color_buffer, 
        index_buffer: index_buffer,
        vertSize: 3, 
        colorSize: 3, 
        nIndices: 36, 
        primtype:gl.TRIANGLES
    };
    
    return box;
}

function getPosBuf(h) {
    return new Float32Array([  0.1, h, 0.1,  -0.1, h, 0.1,  -0.1,-0.1, 0.1,   0.1,-0.1, 0.1,
       0.1, h, 0.1,   0.1,-0.1, 0.1,   0.1,-0.1,-0.1,   0.1, h,-0.1,
       0.1, h, 0.1,   0.1, h,-0.1,  -0.1, h,-0.1,  -0.1, h, 0.1,
      -0.1, h, 0.1,  -0.1, h,-0.1,  -0.1,-0.1,-0.1,  -0.1,-0.1, 0.1,
      -0.1,-0.1,-0.1,   0.1,-0.1,-0.1,   0.1,-0.1, 0.1,  -0.1,-0.1, 0.1,
       0.1,-0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1, h,-0.1,   0.1, h,-0.1 ])
}

function getColorBuf(red, green, blue) {
    return new Float32Array([    
        5,3,7, 5,3,7, 5,3,7, 5,3,7,
        1,1,3, 1,1,3, 1,1,3, 1,1,3,
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,1,0, 1,1,0, 1,1,0, 1,1,0,
        0,1,0, 0,1,0, 0,1,0, 0,1,0
])}
   

// element index array
var box_triangle_indices = new Uint16Array(
    [  0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // top
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // bottom
      20,21,22,  20,22,23 ]   // back
);