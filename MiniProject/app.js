const canvas = document.getElementById("glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
var gl = canvas.getContext("webgl");

function normalize(pos, axis) {
  const halfAxis = axis / 2;
  let normalized = pos / halfAxis - 1;
  return normalized;
}

let animateM = false;
let animateH = false;
let animateI = false;
let animateO = false;

function selectedItem() {
  var mylist = document.getElementById("myList");
  animateM = false;
  animateH = false;
  animateI = false;
  animateO = false;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var val = mylist.options[mylist.selectedIndex].index;
  var dist = document.getElementById("distanceFactor");
  if (val == 0) {
    dist.innerHTML = null;
  }
  if (val == 1) {
    dist.innerHTML = "The distance is taken in 10^6 KMs";
    drawInner();
  }
  if (val == 2) {
    dist.innerHTML = "The distance is taken in 10^7 KMs";
    drawOuter();
  }
  if (val == 3) {
    dist.innerHTML = "The distance is taken in 10^3 KMs";
    drawEarthMoon();
  }
  if (val == 4) {
    dist.innerHTML = "The distance is taken in the ratio 35/0.6";
    drawHalley();
  }
}

class Planet {
  constructor(aphelion, perihelion, eccentricity, color) {
    this.aphelion = aphelion;
    this.perihelion = perihelion;
    this.eccentricity = eccentricity;
    this.color = color;
  }
}

//Taken in 10^6kms
const Mercury = new Planet(69, 42, 0.23, [0.5, 0.5, 0.5, 1]);
const Venus = new Planet(109, 107, 0.0068, [1, 0.647, 0, 1]);
const Earth = new Planet(152, 147, 0.0167, [0, 0, 1, 1]);
const Mars = new Planet(249, 206, 0.0934, [1, 0, 0, 1]);

//Taken in 10^7kms
const Jupiter = new Planet(41.6, 34.0, 0.0485, [1, 0, 0, 1]);
const Saturn = new Planet(111.4, 95.2, 0.0556, [0.588, 0.29, 0, 1]);
const Uranus = new Planet(260.3, 234.1, 0.0472, [0.15, 0.4, 0.45, 1]);
const Neptune = new Planet(385.5, 375.4, 0.0086, [0.49, 0.69, 0.74, 1]);

// const Halley = new Planet(525.6, 8.867, 0.966, [0.5, 0.5, 0.5, 1]);
const Halley = new Planet(1400, 24, 0.966, [0.5, 0.5, 0.5, 1]);

//Taken in 10^3kms
const Moon = new Planet(355, 313, 0.0549, [0.5, 0.5, 0.5, 1]);

var sunColor = [1.0, 1.0, 0.0, 1.0];

function drawInner() {
  animateI = true;
  animateInner();
}

function drawOuter() {
  animateO = true;
  animateOuter();
}

function drawHalley() {
  animateH = true;
  animateHalley();
}

function drawEarthMoon() {
  animateM = true;
  animateMoon(Moon);
}

let t = 0;

function animateMoon() {
  a = (Moon.aphelion + Moon.perihelion) / 2;
  b = a * Math.sqrt(1 - Moon.eccentricity ** 2);
  xc = 450 + Moon.eccentricity * a;
  pX = xc + a * Math.cos(2 * t * Math.PI);
  pY = 350 + b * Math.sin(2 * t * Math.PI);

  if (animateM == true) {
    drawPlanet(circle(450, 350, 20), [0, 0, 1, 1]);
    drawOrbit(ellipse(Moon));
    drawPlanet(circle(pX, pY, 10), Moon.color);

    t += 0.002;
    requestAnimationFrame(animateMoon);
  }
}

function animateHalley() {
  a = (Halley.aphelion + Halley.perihelion) / 2;
  b = a * Math.sqrt(1 - Halley.eccentricity ** 2);
  xc = 50 + Halley.eccentricity * a;
  pX = xc + a * Math.cos(2 * t * Math.PI);
  pY = 350 + b * Math.sin(2 * t * Math.PI);

  if (animateH == true) {
    drawPlanet(circle(50, 350, 20), sunColor);
    drawOrbit(ellipse(Halley));
    drawPlanet(circle(pX, pY, 10), Halley.color);

    t += 0.0002;
    requestAnimationFrame(animateHalley);
  }
}

var innerPlanetData = [Mercury, Venus, Earth, Mars];
var outerPlanetData = [Jupiter, Saturn, Uranus, Neptune];

let p = 0;
let i = 0;
let posX = [[], []];
let posY = [[], []];
time = [0, 0, 0, 0];

function animateInner() {
  for (p = 0; p < 4; p++) {
    a = (innerPlanetData[p].aphelion + innerPlanetData[p].perihelion) / 2;
    b = a * Math.sqrt(1 - innerPlanetData[p].eccentricity ** 2);
    xc = 450 + innerPlanetData[p].eccentricity * a;
    posX[p] = [];
    posY[p] = [];
    posX[p][i] = xc + a * Math.cos(2 * time[p] * Math.PI);
    posY[p][i] = 350 + b * Math.sin(2 * time[p] * Math.PI);
  }

  if (animateI == true) {
    drawPlanet(circle(450, 350, 20), sunColor);
    drawOrbit(ellipse(Mercury));
    drawPlanet(circle(posX[0][i], posY[0][i], 10), Mercury.color);
    drawOrbit(ellipse(Venus));
    drawPlanet(circle(posX[1][i], posY[1][i], 10), Venus.color);
    drawOrbit(ellipse(Earth));
    drawPlanet(circle(posX[2][i], posY[2][i], 10), Earth.color);
    drawOrbit(ellipse(Mars));
    drawPlanet(circle(posX[3][i], posY[3][i], 10), Mars.color);

    time[0] += 0.009;
    time[1] += 0.007;
    time[2] += 0.005;
    time[3] += 0.0025;
    i = i + 1;
    requestAnimationFrame(animateInner);
  }
}

function animateOuter() {
  for (p = 0; p < 4; p++) {
    a = (outerPlanetData[p].aphelion + outerPlanetData[p].perihelion) / 2;
    b = a * Math.sqrt(1 - outerPlanetData[p].eccentricity ** 2);
    xc = 450 + outerPlanetData[p].eccentricity * a;
    posX[p] = [];
    posY[p] = [];
    posX[p][i] = xc + a * Math.cos(2 * time[p] * Math.PI);
    posY[p][i] = 350 + b * Math.sin(2 * time[p] * Math.PI);
  }

  if (animateO == true) {
    drawPlanet(circle(450, 350, 20), sunColor);
    drawOrbit(ellipse(Jupiter));
    drawPlanet(circle(posX[0][i], posY[0][i], 10), Jupiter.color);
    drawOrbit(ellipse(Saturn));
    drawPlanet(circle(posX[1][i], posY[1][i], 10), Saturn.color);
    drawOrbit(ellipse(Neptune));
    drawPlanet(circle(posX[2][i], posY[2][i], 10), Neptune.color);
    drawOrbit(ellipse(Uranus));
    drawPlanet(circle(posX[3][i], posY[3][i], 10), Uranus.color);

    time[0] += 0.0009;
    time[1] += 0.0007;
    time[2] += 0.0005;
    time[3] += 0.00025;
    i = i + 1;
    requestAnimationFrame(animateOuter);
  }
}

var circle = function (xc, yc, r) {
  let vertices = [];

  let x = 0;
  let y = r;
  let p = 1 - r;

  vertices.push(normalize(xc, canvasWidth));
  vertices.push(normalize(yc, canvasHeight));

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

var ellipse = function (planet) {
  let vertices = [];
  a = (planet.aphelion + planet.perihelion) / 2;
  b = a * Math.sqrt(1 - planet.eccentricity ** 2);
  if (planet.eccentricity == 0.966) {
    xc = 50 + planet.eccentricity * a;
    yc = 350;
  } else {
    xc = 450 + planet.eccentricity * a;
    yc = 350;
  }

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

function drawPlanet(vertices, color) {
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

  var colorUniformLocation2 = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation2, color);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}

function drawOrbit(vertices) {
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

  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorUniformLocation, [1.0, 1.0, 1.0, 1.0]);

  gl.drawArrays(gl.POINTS, 0, vertices.length);
}
