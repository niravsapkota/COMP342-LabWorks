const canvas = document.getElementById("glcanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
var gl = canvas.getContext("webgl");

function normalize(pos, axis) {
  const halfAxis = axis / 2;
  let normalized = pos / halfAxis - 1;
  return normalized;
}

var DDA = function (x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var stepsize;

  var x = [];
  var y = [];
  x.push(x1);
  y.push(y1);

  if (Math.abs(dx) > Math.abs(dy)) {
    stepsize = Math.abs(dx);
  } else {
    stepsize = Math.abs(dy);
  }

  var x_inc = dx / stepsize;
  var y_inc = dy / stepsize;
  for (var i = 1; i <= stepsize; i++) {
    x[i] = x[i - 1] + x_inc;
    y[i] = y[i - 1] + y_inc;
  }

  var vertices = [];
  for (var i = 0; i <= stepsize; i++) {
    vertices.push(
      normalize(x[i], canvas.width),
      normalize(y[i], canvas.height)
    );
  }

  return vertices;
};

var BLA = function (x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;

  var x = [];
  var y = [];
  x.push(x1);
  y.push(y1);

  if (Math.abs(dy / dx) < 1) {
    var p = [];
    p[0] = 2 * dy - dx;

    for (var i = 1; i < dx; i++) {
      if (p[i] < 0) {
        p[i + 1] = p[i] + 2 * dy;
        x.push(x[i] + 1);
        y.push(y[i]);
      } else {
        p[i + 1] = p[i] + 2 * dy - 2 * dx;
        x.push(x[i] + 1);
        y.push(y[i] + 1);
      }
    }
  } else {
    var p = [];
    p[0] = 2 * dx - dy;

    for (var i = 1; i < dy; i++) {
      if (p[i] < 0) {
        p[i + 1] = p[i] + 2 * dx;
        x.push(x[i]);
        y.push(y[i] + 1);
      } else {
        p[i + 1] = p[i] + 2 * dx - 2 * dy;
        x.push(x[i] + 1);
        y.push(y[i] + 1);
      }
    }
  }

  var vertices = [];
  for (var i = 0; i < x.length; i++) {
    vertices.push(normalize(x[i], canvasWidth), normalize(y[i], canvasHeight));
  }

  return vertices;
};

var main = function () {
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

  var ddaVertex = DDA(1, 2, 105, 205);
  var blaVertex = BLA(-10, -20, 400, 250);
  var blaVertexNeg = BLA(10, 250, 150, 40);

  // Create buffers that store the vertices of the rectangles
  var buffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ddaVertex), gl.STATIC_DRAW);

  var buffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blaVertex), gl.STATIC_DRAW);

  var buffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(blaVertexNeg),
    gl.STATIC_DRAW
  );

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

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Line 1
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation1 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation1, [1.0, 0.0, 0.0, 1.0]);

  gl.drawArrays(gl.LINE_LOOP, 0, ddaVertex.length / 2);

  // Line 2
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation2 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation2, [0.0, 0.0, 1.0, 1.0]);

  gl.drawArrays(gl.LINE_LOOP, 0, blaVertex.length / 2);

  // Line 3
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation2 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation2, [0.0, 0.0, 1.0, 1.0]);

  gl.drawArrays(gl.LINE_LOOP, 0, blaVertexNeg.length / 2);
};
