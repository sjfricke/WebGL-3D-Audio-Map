// Create the vertex, color and index data for a multi-colored cube
function createBox(gl, height, red, green, blue) {
    
    // Create and store data into vertex buffer
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getPosBuf(height)), gl.STATIC_DRAW);

    // Create and store data into color buffer
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getColorBuf(red, green, blue)), gl.STATIC_DRAW);

    // Create and store data into index buffer
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(getIndices()), gl.STATIC_DRAW);
    
    
    var box = {
        vertex_buffer: vertex_buffer,         
        color_buffer: color_buffer, 
        index_buffer: index_buffer,
        vertSize: 3, 
        colorSize: 3, 
        nIndices: 36, 
        vertLength : 72,
        primtype:gl.TRIANGLES
    };
    
    return box;
}

// h is the height added to the top triangles
// i is moving the whole object over in x direction
function getPosBuf(h, i) {
    if (i) {        
        j = (i / 4) - 10;
    } else {
        j = 0; //no adding
    }
    return [  
       0.1+j, h, 0.1,    -0.1+j, h, 0.1,    -0.1+j,-0.1, 0.1,   0.1+j,-0.1, 0.1,
       0.1+j, h, 0.1,     0.1+j,-0.1, 0.1,   0.1+j,-0.1,-0.1,   0.1+j, h,-0.1,
       0.1+j, h, 0.1,     0.1+j, h,-0.1,    -0.1+j, h,-0.1,    -0.1+j, h, 0.1,
      -0.1+j, h, 0.1,    -0.1+j, h,-0.1,    -0.1+j,-0.1,-0.1,  -0.1+j,-0.1, 0.1,
      -0.1+j,-0.1,-0.1,   0.1+j,-0.1,-0.1,   0.1+j,-0.1, 0.1,  -0.1+j,-0.1, 0.1,
       0.1+j,-0.1,-0.1,  -0.1+j,-0.1,-0.1,  -0.1+j, h,-0.1,     0.1+j, h,-0.1 
]}

function getColorBuf(red, green, blue) {
    return [    
        1,0,1, 1,0,1, 1,0,1, 1,0,1,
        1,1,0, 1,1,0, 1,1,0, 1,1,0,
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        1,1,0, 1,1,0, 1,1,0, 1,1,0,
        0,1,0, 0,1,0, 0,1,0, 0,1,0
]}   

// element index array
function getIndices() {
    return [  
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // top
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // bottom
      20,21,22,  20,22,23 ];  // back
}


// pass in data values from 0 - 255
function createBoxSet(audioData, gl) {
    
    var vertex_buffer_array = [];
    var color_buffer_array = [];
    var index_buffer_array = [];
    
    var boxSet = {
        vertSize: 3, 
        colorSize: 3, 
        nIndices: 36 * audioData.length, 
        vertLength : 72,
        primtype:gl.TRIANGLES
    };
    
    var offset_value_init = boxSet.vertLength / boxSet.vertSize;
    var offset_value = 0;
    
    var i, j;
    for (i = 0; i < audioData.length; i++) {
        vertex_buffer_array = vertex_buffer_array.concat(getPosBuf(audioData[i]/100, i));
        color_buffer_array = color_buffer_array.concat(getColorBuf(0,0,0));
        var offset_index = getIndices();
//        console.log(offset_index);
        for (j = 0; j < offset_index.length; j++) {
            offset_index[j] += offset_value;
        }
        //console.log(offset_index);
        index_buffer_array = index_buffer_array.concat(offset_index);
        
        offset_value += offset_value_init; // add another
    }
    
    // Create and store data into vertex buffer
    boxSet.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxSet.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_buffer_array), gl.STATIC_DRAW);

    // Create and store data into color buffer
    boxSet.color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxSet.color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer_array), gl.STATIC_DRAW);

    // Create and store data into index buffer
    boxSet.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxSet.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer_array), gl.STATIC_DRAW);
    
    return boxSet;
}
 /* var box1 = createBox(gl, 1.00, 0, 0, 0);
    var box2 = createBox(gl, 2.00, 0, 0, 0);
    
    var offset_add = box2.vertLength / box2.vertSize;
    for (i = 0; i < box2.nIndices; i++) {
        box2.index_buffer[i] += offset_add;
    }
        
    var box = {
        vertex_buffer: box1.vertex_buffer.concat(box2.vertex_buffer),         
        color_buffer: box1.color_buffer.concat(box2.color_buffer), 
        index_buffer: box1.index_buffer.concat(box2.index_buffer),
        vertSize: 3, 
        colorSize: 3, 
        nIndices: 36 * 2, 
        primtype:gl.TRIANGLES
    }*/