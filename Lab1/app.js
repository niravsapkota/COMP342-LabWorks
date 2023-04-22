var main = function () {

  document.getElementById("screenres").innerHTML =
  "Screen Resolution = " +
  (window.screen.width * window.devicePixelRatio) +
  "X" +
  (window.screen.height * window.devicePixelRatio);

  
  var canvas = document.getElementById('glcanvas');
  var gl = canvas.getContext('webgl');
  
  // Create a vertex shader and a fragment shader
  var vertexShaderSource = `
    attribute vec2 a_position;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;
  
  var fragmentShaderSource = `
    precision mediump float;
    
    uniform vec4 u_color;
    
    void main() {
      gl_FragColor = u_color;
    }
  `;  
  
  // Define the vertices of the rectangles used for logo
  var vertices1 = [
    0.0, 0.0, 
    0.1, 0.0,  
    0.0, 0.50,
    0.10, 0.50,
  ];
  var vertices2 = [
    0.05, 0.25, 
    0.30, 0.0,
    0.30, 0.50,
    0.55, 0.25, 
  ];
  var vertices3 = 
  [0.19142, 0.25, 
    0.30, 0.14142,
    0.3707, 0.42929, 
    0.47929, 0.3207, 
  ];
    
  // Create buffers that store the vertices of the rectangles
  var buffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);
  
  var buffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
  
  var buffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices3), gl.STATIC_DRAW);
  
  // Compile the shaders and link them to a WebGL program
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
    
  // Use the WebGL API to draw the rectangles on the canvas
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Bind the WebGL program before setting the uniform value
  gl.useProgram(program);
  
  // Enable the vertex attributes and set their pointers to the buffer data
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  // rectangle 1
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation1 = gl.getUniformLocation(program, 'u_color');
  gl.uniform4fv(colorUniformLocation1, [1.0, 0.0, 0.0, 1.0]);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
  // rectangle 2
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation2 = gl.getUniformLocation(program, 'u_color');
  gl.uniform4fv(colorUniformLocation2, [1.0, 0.0, 0.0, 1.0]);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // rectangle 3
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation3 = gl.getUniformLocation(program, 'u_color');
  gl.uniform4fv(colorUniformLocation3, [1.0, 0.0, 0.0, 0.0]);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };