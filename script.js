'use strict';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// need to shift origin to the middle of the canvas
var transX = canvas.width * 0.5,
    transY = canvas.height * 0.5;

ctx.translate(transX, transY);

var SCALE_FACTOR = 100;


var homogeneousCube = {
  vertices: [
  // 0  1  2  3  4  5  6  7
    [1, 1, 1, 1,-1,-1,-1,-1],
    [1, 1,-1,-1, 1, 1,-1,-1],
    [1,-1, 1,-1, 1,-1, 1,-1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ],
  // key is index into the vertices array, value is an array of vertices to make a line segment with.
  lineSegments: {
    0: [1, 2, 4],
    1: [3, 5],
    2: [3, 6],
    3: [7],
    4: [5, 6],
    5: [7],
    6: [7],
    7: []
  }
};

// var square = {
//   vertices: [
//     [.5, .5],
//     [.5, -.5],
//     [-.5, .5],
//     [-.5, -.5]
//   ],
//   lineSegments: {
//     0: [1, 2],
//     1: [3],
//     2: [3],
//     3: []
//   }
// };

draw();



function draw() {
  ctx.clearRect(-0.5 * canvas.width, -0.5 * canvas.height, canvas.width, canvas.height);

  // rotate a square
  // square.vertices = rotateMatrixR2(square.vertices, .05);

  // rotate a cube
  homogeneousCube.vertices = rotateMatrixR3_y(homogeneousCube.vertices, .02);
  homogeneousCube.vertices = rotateMatrixR3_x(homogeneousCube.vertices, .02);
  homogeneousCube.vertices = rotateMatrixR3_z(homogeneousCube.vertices, .02);

  drawMatrix(convert(homogeneousCube));
  requestAnimationFrame(draw);
}


function drawLine(pt1, pt2) {
  ctx.beginPath();
  ctx.moveTo(pt1[0] * SCALE_FACTOR, pt1[1] * SCALE_FACTOR);
  ctx.lineTo(pt2[0] * SCALE_FACTOR, pt2[1] * SCALE_FACTOR);
  ctx.stroke();
}


function drawMatrix(matrix) {
  matrix.vertices.forEach(function(vertex, i) {
    matrix.lineSegments[i].forEach(function(index) {
      drawLine(vertex, matrix.vertices[index]);
    });
  });
}

function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function rotateMatrixR2(matrix, angle) {
  var rotationMatrix = [
    [Math.cos(angle), -Math.sin(angle)],
    [Math.sin(angle), Math.cos(angle)]
  ];
  return multiplyMatrices(matrix, rotationMatrix);
}

// not sure how to apply/implement this yet...
function perspectiveProjection(matrix, d) {
  var projectionMatrix = [
    [1,0,0,0],
    [0,1,0,0],
    [0,0,0,0],
    [0,0,-1/d,1]
  ];
  var projected = multiplyMatrices(projectionMatrix, matrix);
  // now we scale
  for (var i = 0; i < projected.length - 2; i++) {
    for (var j = 0; j < projected[i].length; j++) {
      projected[i][j] = projected[i][j] / projected[i][3];
    }
  }
  return projected;
}

function rotateMatrixR3_x(matrix, angle) {
  var rotationMatrix = [
    [1,0,0,0],
    [0,Math.cos(angle), -Math.sin(angle), 0],
    [0,Math.sin(angle), Math.cos(angle), 0],
    [0,0,0,1]
  ];
  return multiplyMatrices(rotationMatrix, matrix);
}

function rotateMatrixR3_y(matrix, angle) {
  var rotationMatrix = [
    [Math.cos(angle), 0, Math.sin(angle), 0],
    [0,1,0,0],
    [-Math.sin(angle), 0, Math.cos(angle), 0],
    [0,0,0,1]
  ];
  return multiplyMatrices(rotationMatrix, matrix);
}

function rotateMatrixR3_z(matrix, angle) {
  var rotationMatrix = [
    [Math.cos(angle), -Math.sin(angle), 0, 0],
    [Math.sin(angle), Math.cos(angle), 0, 0],
    [0,0,1,0],
    [0,0,0,1]
  ];
  return multiplyMatrices(rotationMatrix, matrix);
}

// converts into a form easier to draw
function convert(matrix) {
  var vertex1 = [matrix.vertices[0][0], matrix.vertices[1][0]];
  var vertex2 = [matrix.vertices[0][1], matrix.vertices[1][1]];
  var vertex3 = [matrix.vertices[0][2], matrix.vertices[1][2]];
  var vertex4 = [matrix.vertices[0][3], matrix.vertices[1][3]];
  var vertex5 = [matrix.vertices[0][4], matrix.vertices[1][4]];
  var vertex6 = [matrix.vertices[0][5], matrix.vertices[1][5]];
  var vertex7 = [matrix.vertices[0][6], matrix.vertices[1][6]];
  var vertex8 = [matrix.vertices[0][7], matrix.vertices[1][7]];

  return {
    vertices: [vertex1,vertex2,vertex3,vertex4,vertex5,vertex6,vertex7,vertex8],
    lineSegments: matrix.lineSegments
  }
}
