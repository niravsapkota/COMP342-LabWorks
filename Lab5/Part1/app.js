const canvas = document.getElementById("glcanvas");
var gl = canvas.getContext("webgl");

const Red = [1, 0, 0, 1];
const Blue = [0, 0, 1, 1];
const Green = [0, 1, 0, 1];

var main = function () {
  // let P1 = [-0.3, -0.4];
  // let P2 = [0.8, 0.7];
  // let P3 = [0.1, 0.5];
  // let P4 = [0.5, 0.1];
  // let P5 = [-0.6, -0.6];
  // let P6 = [-0.3, 0.6];
  // lineClipping(P1, P2, -0.2, -0.2, 0.6, 0.6);
  // lineClipping(P3, P4, -0.2, -0.2, 0.6, 0.6);
  // lineClipping(P5, P6, -0.2, -0.2, 0.6, 0.6);
  // viewPortVertex = [-0.2, -0.2, 0.6, -0.2, 0.6, 0.6, -0.2, 0.6];
  // drawObject("SQUARE", viewPortVertex, Blue);
  polygonClipping(-0.2, -0.2, 0.6, 0.6);
  viewPortVertex = [-0.2, -0.2, 0.6, -0.2, 0.6, 0.6, -0.2, 0.6];
  drawObject("SQUARE", viewPortVertex, Blue);
};

function lineClipping(P1, P2, Xw_min, Yw_min, Xw_max, Yw_max) {
  let x0 = P1[0];
  let y0 = P1[1];
  let x1 = P2[0];
  let y1 = P2[1];
  let vertices = [];
  let P1_new = [...P1];
  let P2_new = [...P2];
  let m = (y1 - y0) / (x1 - x0);

  let regionCodeP1 = findCode(x0, y0, Xw_min, Yw_min, Xw_max, Yw_max);
  let regionCodeP2 = findCode(x1, y1, Xw_min, Yw_min, Xw_max, Yw_max);

  while (true) {
    if ((regionCodeP1 | regionCodeP2) === 0) {
      vertices.push(...P1_new, ...P2_new);
      drawObject("LINE", vertices, Green);
      vertices = [];
      vertices.push(...P1, ...P1_new, ...P2, ...P2_new);
      drawObject("LINE", vertices, Red);
      return;
    } else if ((regionCodeP1 & regionCodeP2) !== 0) {
      vertices.push(...P1, ...P2);
      drawObject("LINE", vertices, Red);
      return null;
    } else {
      let x, y;
      let regionCode = regionCodeP1 !== 0 ? regionCodeP1 : regionCodeP2;
      if ((regionCode & 1) !== 0) {
        x = Xw_min;
        y = y1 + m * (x - x1);
      } else if ((regionCode & 2) !== 0) {
        x = Xw_max;
        y = y1 + m * (x - x1);
      } else if ((regionCode & 4) !== 0) {
        y = Yw_min;
        x = x1 + (y - y1) / m;
      } else if ((regionCode & 8) !== 0) {
        y = Yw_max;
        x = x1 + (y - y1) / m;
      }

      if (regionCode === regionCodeP1) {
        regionCodeP1 = findCode(x, y, Xw_min, Yw_min, Xw_max, Yw_max);
        P1_new = [];
        P1_new = [x, y];
      } else {
        regionCodeP2 = findCode(x, y, Xw_min, Yw_min, Xw_max, Yw_max);
        P2_new = [];
        P2_new = [x, y];
      }
    }
  }
}

function findCode(x, y, Xw_min, Yw_min, Xw_max, Yw_max) {
  var code = 0;
  if (x < Xw_min) {
    code |= 1;
  } else if (x > Xw_max) {
    code |= 2;
  }
  if (y < Yw_min) {
    code |= 4;
  } else if (y > Yw_max) {
    code |= 8;
  }
  return code;
}

function polygonClipping(Xw_min, Yw_min, Xw_max, Yw_max) {
  let vertices = [];
  let P1 = [-0.3, -0.3];
  let P2 = [-0.18, 0.55];
  let P3 = [0.4, 0.7];
  let P4 = [0.8, 0.1];
  let P5 = [0.5, 0.1];
  vertices.push(...P1, ...P2, ...P2, ...P3, ...P3, ...P4, ...P4, ...P5, ...P5);
  lineClipping(P1, P2, Xw_min, Yw_min, Xw_max, Yw_max);
  lineClipping(P2, P3, Xw_min, Yw_min, Xw_max, Yw_max);
  lineClipping(P3, P4, Xw_min, Yw_min, Xw_max, Yw_max);
  lineClipping(P4, P5, Xw_min, Yw_min, Xw_max, Yw_max);
  lineClipping(P5, P1, Xw_min, Yw_min, Xw_max, Yw_max);
}

function drawObject(type, vertices, color) {
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
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var colorUniformLocation1 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation1, color);

  if (type == "LINE") {
    gl.drawArrays(gl.LINES, 0, vertices.length);
  }

  if (type == "SQUARE") {
    gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
  }
}
