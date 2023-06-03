const canvas = document.getElementById("glcanvas");
var gl = canvas.getContext("webgl");

const Red = [1, 0, 0, 1];
const Blue = [0, 0, 1, 1];
const Green = [0, 1, 0, 1];
const Yellow = [1, 1, 0, 1];
const Black = [0, 0, 0, 1];
const Brown = [0.58, 0.29, 0, 1];

let FrontFace,
  BackFace,
  RightFace,
  LeftFace,
  TopFace,
  BottomFace = [];

function matrixMultiply(matrix, vertices, numElements) {
  let result = [];
  for (let i = 0; i < vertices.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let k = 0; k < numElements; k++) {
        sum += matrix[j * 3 + k] * vertices[i + k];
      }
      result.push(sum);
    }
  }
  return result;
}

function translateObject(vertices, Tx, Ty) {
  let vertexData = [];
  let translationMatrix = [...[1, 0, Tx], ...[0, 1, Ty], ...[0, 0, 1]];
  vertexData.push(...matrixMultiply(translationMatrix, vertices, 3));
  return vertexData;
}

function rotateObject(angle, vertices) {
  let vertexData = [];
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let rotationMatrix = [...[cos, -sin, 0], ...[sin, cos, 0], ...[0, 0, 1]];
  vertexData.push(...matrixMultiply(rotationMatrix, vertices, 3));
  return vertexData;
}

function scaleObject(objectData, Sx, Sy) {
  let vertexData = [];
  let scalingMatrix = [...[Sx, 0, 0], ...[0, Sy, 0], ...[0, 0, 1]];
  vertexData.push(...matrixMultiply(scalingMatrix, objectData, 3));
  return vertexData;
}

function scale3D(Sx, Sy) {
  FrontFace = scaleObject(FrontFace, Sx, Sy);
  BackFace = scaleObject(BackFace, Sx, Sy);
  TopFace = scaleObject(TopFace, Sx, Sy);
  BottomFace = scaleObject(BottomFace, Sx, Sy);
  RightFace = scaleObject(RightFace, Sx, Sy);
  LeftFace = scaleObject(LeftFace, Sx, Sy);
  DrawCube();
}

function rotate3D(angle) {
  FrontFace = rotateObject(angle, FrontFace);
  BackFace = rotateObject(angle, BackFace);
  TopFace = rotateObject(angle, TopFace);
  BottomFace = rotateObject(angle, BottomFace);
  RightFace = rotateObject(angle, RightFace);
  LeftFace = rotateObject(angle, LeftFace);
  DrawCube();
}

function translate3D(Tx, Ty) {
  FrontFace = translateObject(FrontFace, Tx, Ty);
  BackFace = translateObject(BackFace, Tx, Ty);
  TopFace = translateObject(TopFace, Tx, Ty);
  BottomFace = translateObject(BottomFace, Tx, Ty);
  RightFace = translateObject(RightFace, Tx, Ty);
  LeftFace = translateObject(LeftFace, Tx, Ty);
  DrawCube();
}

function draw3DObject(O, H, W, L) {
  // P2 P4
  // P1 P3
  let [x, y] = [O[0], O[1]];
  let P1 = [x, y, 1];
  let P2 = [x, y + H, 1];
  let P3 = [x + L, y, 1];
  let P4 = [x + L, y + H, 1];
  let P5 = createVertex(P3, W / 2, W / 2);
  let P6 = createVertex(P4, W / 2, W / 2);
  let P7 = createVertex(P2, W / 2, W / 2);
  FrontFace = [...P1, ...P2, ...P3, ...P2, ...P3, ...P4];
  BackFace = translateObject(FrontFace, W / 1.75, W / 2.4);
  RightFace = [...P3, ...P4, ...P5, ...P4, ...P5, ...P6];
  LeftFace = translateObject(RightFace, -L, 0);
  TopFace = [...P2, ...P4, ...P7, ...P4, ...P6, ...P7];
  BottomFace = translateObject(TopFace, 0, -H);
  DrawCube();
}

function DrawCube() {
  draw(BackFace, Green);
  draw(LeftFace, Brown);
  draw(BottomFace, Black);
  draw(FrontFace, Blue);
  draw(RightFace, Red);
  draw(TopFace, Yellow);
}

function createVertex(A, Tx, Ty) {
  let vertexData = [
    ...translateObject(
      rotateObject(
        -Math.PI / 20,
        translateObject(translateObject(A, Tx, Ty), -A[0], -A[1])
      ),
      A[0],
      A[1]
    ),
  ];
  return vertexData;
}

function draw(vertices, color) {
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

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
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

function main() {
  let O = [-0.8, -0.8, 0];
  let [H, W, L] = [0.2, 0.2, 0.2];

  draw3DObject(O, H, W, L);
  drawAxes();
  scale3D(0.5, 0.5);
  draw3DObject(O, H, W, L);
  translate3D(-1, -1);
  draw3DObject(O, H, W, L);
  translate3D(0.8, 0.8);
  rotate3D(Math.PI / 2);
}
