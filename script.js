var canvas = document.getElementById('canvas'),
	context = canvas.getContext("2d"),
	clearButton = document.getElementById("clearButton"),
	//undoButton = document.getElementById("undoButton"),
	paint = false,
	clickX = [],
	clickY = [],
	clickDrag = [],
	pointTransformations = [ 0, -72, -144, -216, -284 ];

function init()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//clearButton.addEventListener("click", clearDrawing);
	//undoButton.addEventListener("click", autoUndo);
	
	window.addEventListener("resize", resize);
	context.save();
	context.translate((canvas.width/2), (canvas.height/2));
}

function resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.translate((canvas.width/2), (canvas.height/2));

	//replace with full redraw
	redraw();
}

canvas.onmousedown = function (e)
{
	paint = true;
	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	redraw();
};

canvas.touchstart = function (e)
{
	paint = true;
	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	redraw();
};

canvas.onmousemove = function(e)
{
	if(paint)
	{
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
};

canvas.touchmove = function(e)
{
	if(paint)
	{
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
	paint = false;
};

canvas.onmouseleave = function(e)
{
	//paint = false;
};

function addClick(x, y, dragging)
{
	var offsetX = x - (canvas.width/2);
	var offsetY = y - (canvas.height/2)

	clickX.push(offsetX);
	clickY.push(offsetY);
	clickDrag.push(dragging);

	context.rotate(90*Math.PI/180);
	context.rect(offsetX,offsetY,3,3);
	context.fillStyle = "#fff";
	context.fill();
	context.stroke();

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

	drawLines();
}

function drawLines()
{
	var clickLength = clickX.length;
	var previousX = clickX[clickLength-2];
	var previousY = clickY[clickLength-2];
	var nextX = clickX[clickLength-1];
	var nextY = clickY[clickLength-1];

	//context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

	pointTransformations.forEach(function(angle) {
		var points = getDrawPoints(previousX, previousY, nextX, nextY, angle);
		drawLine(points.pX, points.pY, points.nX, points.nY);
		drawLine(points.pX, -points.pY, points.nX, -points.nY);
	});
}

function drawLine(pX, pY, nX, nY)
{
	context.beginPath();
	context.moveTo(pX, pY);
	context.lineTo(nX, nY);
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

function undoDrawing()
{
	var lastPointX = clickX.pop();
	var lastPointY = clickY.pop();
	context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

	var i=0;
	clickX.forEach(function(point){
		
		var previousX = clickX[i-2];
		var previousY = clickY[i-2];
		var nextX = clickX[i-1];
		var nextY = clickY[i-1];

		pointTransformations.forEach(function(angle) {
			var points = getDrawPoints(previousX, previousY, nextX, nextY, angle);
			drawLine(points.pX, points.pY, points.nX, points.nY);
			drawLine(points.pX, -points.pY, points.nX, -points.nY);
		});

		i++;
	});
}

//TODO: single step removal not visible to user?
function autoUndo()
{
	while(clickX.length > 0){
		undoDrawing();
	}
}

function clearDrawing() {
	clickX = [];
	clickY = [];
	context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
}

init();