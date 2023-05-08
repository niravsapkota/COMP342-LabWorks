const canvas = document.getElementById("glcanvas");
var gl = canvas.getContext("webgl");

function matrixMultiply(m1, m2) {
  const rowsA = m1.length;
  const colsA = m1[0].length;
  const rowsB = m2.length;
  const colsB = m2[0].length;
  if (colsA !== rowsB) {
    throw new Error(
      "Number of columns in matrix A must match number of rows in matrix B"
    );
  }
  const result = new Array(rowsA);
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(colsB).fill(0);
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += m1[i][k] * m2[k][j];
      }
    }
  }
  return result;
}

function translate(v1, v2, v3, v4, t) {
  i1 = matrixMultiply(t, v1);
  i2 = matrixMultiply(t, v2);
  i3 = matrixMultiply(t, v3);
  i4 = matrixMultiply(t, v4);
  let result = i1.concat(i2, i3, i4);
  return result;
}

function rotation(v1, v2, v3, v4, angle) {
  let radians = (angle * Math.PI) / 180;
  rotMatrix = [
    [Math.cos(radians), -Math.sin(radians), 0],
    [Math.sin(radians), Math.cos(radians), 0],
    [0, 0, 1],
  ];
  i1 = matrixMultiply(rotMatrix, v1);
  i2 = matrixMultiply(rotMatrix, v2);
  i3 = matrixMultiply(rotMatrix, v3);
  i4 = matrixMultiply(rotMatrix, v4);
  let result = i1.concat(i2, i3, i4);
  return result;
}

function scaling(v1, v2, v3, v4, sx, sy) {
  let scale = [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
  i1 = matrixMultiply(scale, v1);
  i2 = matrixMultiply(scale, v2);
  i3 = matrixMultiply(scale, v3);
  i4 = matrixMultiply(scale, v4);
  let result = i1.concat(i2, i3, i4);
  return result;
}

function reflection(v1, v2, v3, v4, axis) {
  let refMatrix;
  if (axis == "x") {
    refMatrix = [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  } else if (axis == "y") {
    refMatrix = [
      [-1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  } else if (axis == "o") {
    refMatrix = [
      [-1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  } else if (axis == "xy") {
    refMatrix = [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];
  } else {
    throw new Error("Axis must be x, y, o or xy.");
  }
  i1 = matrixMultiply(refMatrix, v1);
  i2 = matrixMultiply(refMatrix, v2);
  i3 = matrixMultiply(refMatrix, v3);
  i4 = matrixMultiply(refMatrix, v4);
  let result = i1.concat(i2, i3, i4);
  return result;
}

function shear(v1, v2, v3, v4, shx, shy) {
  let shMatrix = [
    [1, shx, 0],
    [shy, 1, 0],
    [0, 0, 1],
  ];
  i1 = matrixMultiply(shMatrix, v1);
  i2 = matrixMultiply(shMatrix, v2);
  i3 = matrixMultiply(shMatrix, v3);
  i4 = matrixMultiply(shMatrix, v4);
  let result = i1.concat(i2, i3, i4);
  return result;
}

var main = function () {
  let vert1 = [[0.1], [0.1], [1]];
  let vert2 = [[0.1], [0.5], [1]];
  let vert3 = [[0.5], [0.5], [1]];
  let vert4 = [[0.5], [0.1], [1]];

  let transMatrix = [
    [1, 0, -0.2],
    [0, 1, -0.2],
    [0, 0, 1],
  ];

  let vertices2d = vert1.concat(vert2, vert3, vert4);
  let transVertex = translate(vert1, vert2, vert3, vert4, transMatrix);
  let rotVert = rotation(vert1, vert2, vert3, vert4, 60);
  let reflectVert = reflection(vert1, vert2, vert3, vert4, "x");
  let scaleVert = scaling(vert1, vert2, vert3, vert4, -1.5, -1.5);
  let shearVert = shear(vert1, vert2, vert3, vert4, 1.01, 0);

  drawAxes();

  drawRectangle(vertices2d, [1.0, 0.0, 0.0, 1.0]);
  drawRectangle(transVertex, [0.62, 0.12, 0.94, 1.0]);
  drawRectangle(rotVert, [0.58, 0.29, 0.0, 1.0]);
  drawRectangle(reflectVert, [0.0, 0.8, 0.0, 1.0]);
  drawRectangle(scaleVert, [0.0, 1.0, 1.0, 1.0]);
  drawRectangle(shearVert, [0.0, 0.0, 0.0, 1.0]);
};

function drawRectangle(vertices, color) {
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
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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
  gl.useProgram(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var colorUniformLocation1 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation1, color);

  gl.drawArrays(gl.LINE_LOOP, 0, 4);
}

function drawAxes() {
  // Create a vertex shader and a fragment shader
  var vertexShaderSource = `
        attribute vec2 a_position;

        void main() {
          gl_Position = vec4(a_position, 1.0, 1.0);
        }
      `;

  var fragmentShaderSource = `
        precision mediump float;

        uniform vec4 u_color;

        void main() {
          gl_FragColor = u_color;
        }
      `;

  var vertices = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0];
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var colorUniformLocation1 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation1, [0.0, 0.0, 1.0, 1.0]);

  gl.drawArrays(gl.LINES, 0, vertices.length);
}
