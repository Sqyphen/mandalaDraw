var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	paint = false,
	inital = true,
	clickX = [50, 100],
	clickY = [50, 0],
	clickDrag = [],
	pointTransformations = [ 0, -72, -144, -216, -284 ];

function init(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	window.addEventListener("resize", resize);
	window.addEventListener("touchstart", resize);
	context.translate((canvas.width/2), (canvas.height/2));
	redraw();
	drawInitial();
}

function drawInitial(){
	drawRotatedSquare(clickX[1]-6, clickY[1]-6, 12, 45);
}

function drawRotatedSquare(x,y,height,degrees){
    context.save();

    context.translate( x+height/2, y+height/2 );
    context.rotate(degrees*Math.PI/180);

    context.rect(-height/2, -height/2, height,height);
    context.fillStyle = "#fff";
    context.fill();

    context.restore();
}

function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.translate((canvas.width/2), (canvas.height/2));
	redraw();
}

canvas.onmousedown = function (e){
	paint = true;
};

canvas.addEventListener("touchstart", function (e) {
	paint = true;
}, false);

canvas.onmousemove = function(e){
	moveMotion(e.pageX , e.pageY);
};

canvas.addEventListener("touchmove", function (e) {
	moveMotion(e.touches[0].clientX, e.touches[0].clientY);
}, false);

function moveMotion(x, y){
	if(paint) {
		if(inital == false){
			addClick(x, y, true);
			redraw();
		} else {
			inital = false;
			clickX = [x];
			clickY = [y];
		}
	}
}

canvas.onmouseup = function(e){
	paint = false;
};

canvas.addEventListener("touchend", function (e) {
	paint = false;
}, false);

function addClick(x, y, dragging)
{
	var offsetX = x - (canvas.width/2);
	var offsetY = y - (canvas.height/2);

	clickX.push(offsetX);
	clickY.push(offsetY);
	clickDrag.push(dragging);
}

function rotate(cx, cy, x, y, angle){
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

function redraw(){
	context.strokeStyle = "#ffffff";
	context.lineJoin = "round";
	context.lineWidth = 3;
	context.shadowColor = '#c1c6ec';
	context.shadowBlur = 8;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;

	drawLinesRedraw();
}

function drawLinesRedraw(){
	context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

	pointTransformations.forEach(function(angle)
	{
		var i = 0;
		var clickXLength = clickX.length;

		context.beginPath();
		while(i < clickXLength)
		{
			var slicedX = clickX.slice(Math.max(clickX.length - 100, 1));
			var slicedY = clickY.slice(Math.max(clickY.length - 100, 1));
			var previousX = slicedX[i-1];
			var previousY = slicedY[i-1];
			var nextX = slicedX[i];
			var nextY = slicedY[i]; 
			var points = getDrawCurvePoints(previousX, previousY, previousX, previousY, nextX, nextY, angle);

			context.moveTo(points.pXorigin, points.pYorigin);
			context.quadraticCurveTo(points.pX, points.pY, points.nX, points.nY);

			context.moveTo(points.pXorigin, -points.pYorigin);
			context.quadraticCurveTo(points.pX, -points.pY, points.nX, -points.nY);
			
			i++;
		}
		context.closePath();

		//draw endpoints
		
		context.save();

		var pointX = clickX[clickX.length-1];
		var pointY = clickY[clickY.length-1];
		var boxPoints = getDrawPoints(0, 0, pointX, pointY, angle);
		context.translate(pointX, pointY);

		drawRotatedSquare(boxPoints.nX - pointX, boxPoints.nY - pointY, 3, 45);

		if(clickY.length > 2){
			drawRotatedSquare(boxPoints.nX - pointX, -boxPoints.nY - pointY, 3, 45);
		}

		context.restore();
		context.stroke();
	});
}

function getDrawPoints(previousX, previousY, nextX, nextY, angle){
	var previousRotated = rotate(0, 0, previousX, previousY, angle);
	var nextRotated = rotate(0, 0, nextX, nextY, angle);
	var points = {
		'pX' : previousRotated[0],
		'pY' : previousRotated[1],
		'nX' : nextRotated[0],
		'nY' : nextRotated[1],
	};
	return points;
}

function getDrawCurvePoints(originX, originY, previousX, previousY, nextX, nextY, angle){
	var originRotated = rotate(0, 0, originX, originY, angle);
	var previousRotated = rotate(0, 0, previousX, previousY, angle);
	var nextRotated = rotate(0, 0, nextX, nextY, angle);
	var points = {
		'pXorigin' : originRotated[0],
		'pYorigin' : originRotated[1],
		'pX' : previousRotated[0],
		'pY' : previousRotated[1],
		'nX' : nextRotated[0],
		'nY' : nextRotated[1],
	};
	return points;
}

init();