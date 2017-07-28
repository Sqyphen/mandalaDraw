var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	paint = false,
	clickX = [],
	clickY = [],
	clickDrag = [],
	pointTransformations = [ 0, -72, -144, -216, -284 ];

function init()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	window.addEventListener("resize", resize);
	context.translate((canvas.width/2), (canvas.height/2));
}

function resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.translate((canvas.width/2), (canvas.height/2));
	redraw();
}

canvas.onmousedown = function (e)
{
	paint = true;
};

canvas.touchstart = function (e)
{
	console.log("touchstart");
	paint = true;
	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	redraw();
};

canvas.onmousemove = function(e)
{
	if(paint) {
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
};

canvas.touchmove = function(e)
{
	console.log("touchmove");
	if(paint) {
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
};

canvas.onmouseup = function(e)
{
	paint = false;
};

canvas.touchend = function(e)
{
	console.log("touchend");
	paint = false;
};

function addClick(x, y, dragging)
{
	var offsetX = x - (canvas.width/2);
	var offsetY = y - (canvas.height/2);

	clickX.push(offsetX);
	clickY.push(offsetY);
	clickDrag.push(dragging);
}

function rotate(cx, cy, x, y, angle)
{
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

function redraw()
{
	context.strokeStyle = "#ffffff";
	context.lineJoin = "round";
	context.lineWidth = 3;
	context.shadowColor = '#c1c6ec';
	context.shadowBlur = 8;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;

	drawLinesRedraw();
}

function drawLinesRedraw()
{
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
			var originX = slicedX[i-2];
			var originY = slicedY[i-2];
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
		var points = getDrawPoints(0, 0, pointX, pointY, angle);
		context.translate(pointX, pointY);

		//context.rotate(45*Math.PI/180);
		context.rect(points.nX - pointX, points.nY - pointY,3,3);
		context.fillStyle = "#fff";
		context.fill();

		context.rect(points.nX - pointX, -points.nY - pointY,3,3);
		context.fillStyle = "#fff";
		context.fill();
		
		//context.rotate(-45*Math.PI/180);

		context.restore();
		context.stroke();
	});
}

function drawCurve(pX0, pY0, pX, pY, nX, nY)
{
	context.beginPath();
	context.moveTo(pX0, pY0);
	context.quadraticCurveTo(pX, pY, nX, nY);
	context.closePath();
	context.stroke();
}

function getDrawPoints(previousX, previousY, nextX, nextY, angle)
{
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

function getDrawCurvePoints(originX, originY, previousX, previousY, nextX, nextY, angle)
{
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