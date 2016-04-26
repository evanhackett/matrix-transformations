var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// need to shift origin to the middle of the canvas
var transX = canvas.width * 0.5,
    transY = canvas.height * 0.5;

ctx.translate(transX, transY);

var SCALE_FACTOR = 100;

var cube = {
  vertices: [
    [.5, .5, .5],   // 0
    [.5, .5, -.5],  // 1
    [.5, -.5, .5],  // 2
    [.5, -.5, -.5], // 3
    [-.5, .5, .5],  // 4
    [-.5, .5, -.5], // 5
    [-.5, -.5, .5], // 6
    [-.5, -.5, -.5] // 7
  ],
  // key is index into the vertices array, value is an array of vertices to make a line segment with.
  lineSegments: {
    0: [1, 2, 4],
    1: [3, 5],
    2: [3, 6],
    3: [],
    4: [5, 6],
    5: [7],
    6: [7],
    7: [3]
  }
};

var square = {
  vertices: [
    [.5, .5],
    [.5, -.5],
    [-.5, .5],
    [-.5, -.5]
  ],
  lineSegments: {
    0: [1, 2],
    1: [3],
    2: [3],
    3: []
  }
};

draw();



function draw() {
  ctx.clearRect(-0.5 * canvas.width, -0.5 * canvas.height, canvas.width, canvas.height);
  square.vertices = rotateMatrixR2(square.vertices, .05);
  drawMatrix(square);
  requestAnimationFrame(draw);
}


function drawLine(pt1, pt2) {

  console.log('pt1', pt1);
  console.log('pt2', pt2);

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
  rotationMatrix = [
    [Math.cos(angle), -Math.sin(angle)],
    [Math.sin(angle), Math.cos(angle)]
  ];
  return multiplyMatrices(matrix, rotationMatrix)
}
