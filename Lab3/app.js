const canvas = document.getElementById("glcanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
var gl = canvas.getContext("webgl");

function normalize(pos, axis) {
  const halfAxis = axis / 2;
  let normalized = pos / halfAxis - 1;
  return normalized;
}

var circle = function (xc, yc, r) {
  let vertices = [];

  let x = 0;
  let y = r;
  let p = 1 - r;

  while (x <= y) {
    vertices.push(normalize(xc + x, canvasWidth));
    vertices.push(normalize(yc + y, canvasHeight));
    vertices.push(normalize(xc + y, canvasWidth));
    vertices.push(normalize(yc + x, canvasHeight));
    vertices.push(normalize(xc - x, canvasWidth));
    vertices.push(normalize(yc + y, canvasHeight));
    vertices.push(normalize(xc - y, canvasWidth));
    vertices.push(normalize(yc + x, canvasHeight));
    vertices.push(normalize(xc + x, canvasWidth));
    vertices.push(normalize(yc - y, canvasHeight));
    vertices.push(normalize(xc + y, canvasWidth));
    vertices.push(normalize(yc - x, canvasHeight));
    vertices.push(normalize(xc - x, canvasWidth));
    vertices.push(normalize(yc - y, canvasHeight));
    vertices.push(normalize(xc - y, canvasWidth));
    vertices.push(normalize(yc - x, canvasHeight));

    if (p < 0) {
      x++;
      p += 2 * x + 1;
    } else {
      x++;
      y--;
      p += 2 * x - 2 * y + 1;
    }
  }

  return vertices;
};

var ellipse = function (xc, yc, a, b) {
  let vertices = [];
  let x = 0;
  let y = b;
  let p = b * b - a * a * b + (a * a) / 4;
  let dx = 2 * b * b * x;
  let dy = 2 * a * a * y;

  while (dx < dy) {
    vertices.push(normalize(xc + x, canvasWidth));
    vertices.push(normalize(yc + y, canvasHeight));
    vertices.push(normalize(xc - x, canvasWidth));
    vertices.push(normalize(yc + y, canvasHeight));
    vertices.push(normalize(xc + x, canvasWidth));
    vertices.push(normalize(yc - y, canvasHeight));
    vertices.push(normalize(xc - x, canvasWidth));
    vertices.push(normalize(yc - y, canvasHeight));

    if (p < 0) {
      x++;
      dx += 2 * b * b;
      p += dx + b * b;
    } else {
      x++;
      y--;
      dx += 2 * b * b;
      dy -= 2 * a * a;
      p += dx - dy + b * b;
    }
  }

  p = b * b * (x + 0.5) * (x + 0.5) + a * a * (y - 1) * (y - 1) - a * a * b * b;

  while (y >= 0) {
    vertices.push(normalize(xc + x, canvasWidth));
    vertices.push(normalize(yc + y, canvasHeight));
    vertices.push(normalize(xc - x, canvasWidth));
    vertices.push(normalize(yc + y, canvasHeight));
    vertices.push(normalize(xc + x, canvasWidth));
    vertices.push(normalize(yc - y, canvasHeight));
    vertices.push(normalize(xc - x, canvasWidth));
    vertices.push(normalize(yc - y, canvasHeight));

    if (p > 0) {
      y--;
      dy -= 2 * a * a;
      p += a * a - dy;
    } else {
      x++;
      y--;
      dx += 2 * b * b;
      dy -= 2 * a * a;
      p += dx - dy + a * a;
    }
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

  var circleVertex = circle(100, 100, 50);
  var ellipseVertex = ellipse(250, 250, 200, 100);

  // Create buffers that store the vertices of the rectangles
  var buffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(circleVertex),
    gl.STATIC_DRAW
  );

  var buffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(ellipseVertex),
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

  // For Circle
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation1 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation1, [1.0, 0.0, 0.0, 1.0]);

  gl.drawArrays(gl.POINTS, 0, circleVertex.length);

  // For Ellipse
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation2 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation2, [0.0, 0.0, 1.0, 1.0]);

  gl.drawArrays(gl.POINTS, 0, ellipseVertex.length);
};
