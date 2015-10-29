window.onload = function() {
  var canvas = document.getElementById("fractal"),
      context = canvas.getContext('2d'),
      moveTo = function(coords) {
        context.moveTo.apply(context, coords)
      },
      lineTo = function(coords) {
        context.lineTo.apply(context, coords)
      },
      beginPath = context.beginPath.bind(context),
      stroke = context.stroke.bind(context),
      closePath = context.closePath.bind(context),
      clearCanvas = context.clearRect.bind(context, 0, 0, canvas.width, canvas.height),
      drawLeg = function drawLeg (position, length, orientation) {
        var pos = position,
            len = length,
            ori = orientation,
            hyp = len/2,
            findCoords = function findCoords(A, len, pos) {
              pos = pos || [0,0];
              var hyp = len,
                  A = (Math.PI/180) * A,
                  sinA = Math.sin(A),
                  y = pos[1] - (hyp * sinA),
                  x = pos[0] - Math.sqrt(hyp * hyp - y * y);
              return [x,y];
            }
        beginPath();
        moveTo.apply(cxt,pos);
        moveTo.apply(cxt,findCoords(ori - 90, hyp, pos));
        // lineTo
      },
      findFirst = function findFirst(center, length, orientation) {
        var y = center[1] + ((length * Math.cos(orientation)) - Math.sin(orientation) * length * Math.sqrt(3)) / (2 * Math.sqrt(3)),
            x = center[0] - ((length * Math.sin(orientation)) + Math.cos(orientation) * length * Math.sqrt(3)) / (2 * Math.sqrt(3));
        return {start:[x,y]};
      };

  function drawTriangles() {
        console.log('drawTriangles called');
  var length = 500,
      degToRad = function degToRad(deg) {
        return (Math.PI/180) * deg;
      },
      angle = degToRad(60);
      // ori = degToRad(70);

  clearCanvas();

  for (var i = 0; i <= 1000; i += 10.3) {
    length = (Math.random() + .1) *400;
    ori = degToRad(i+ Math.random());
    beginPath();
    var start = findFirst([400,300], length, ori).start; 
    moveTo(start);
console.log(start)
    var next = (function(c, l, orientation) {
      var y = c[1] - Math.sin(angle - orientation) * l,
          x = c[0] + Math.cos(angle - orientation) * l;
      return [x,y];
    })(start, length, ori);

    lineTo(next);

    next = (function(c, l, orientation) {
      var y = c[1] + Math.cos(angle / 2 - orientation) * l,
          x = c[0] + Math.sin(angle / 2 - orientation) * l;
      return [x,y];
    })(next, length, ori);

    lineTo(next);

    next = (function(coords, l) {
      var y = coords[1],
          x = coords[0] - l;
      return [x,y];
    })(next, length);

    lineTo(start);

    stroke();
    closePath();
  }
 }
  var intID,
      clearInt = function clearInt () {
        console.log('clear Interval called');
        clearInterval(intID);
      },
      startAnimation = function startAnimation () {
        console.log('set Interval called');
        intID = setInterval(drawTriangles, 200);
      };

  document.getElementById('fractal').onclick = clearInt;

  startAnimation();
  // drawTriangles();
};

