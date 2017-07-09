
var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var paint = false;

var clickDrag = new Array();

var clickX = new Array();
var clickY = new Array();
var clickX2 = new Array();
var clickY2 = new Array();
var clickX3 = new Array();
var clickY3 = new Array();
var clickX4 = new Array();
var clickY4 = new Array();
var clickX5 = new Array();
var clickY5 = new Array();

var clearButton = document.getElementById("clearButton");


function init()
{
	clearButton.addEventListener("click", clearDrawing);

	context.save();
	context.translate((canvas.height/2), (canvas.width/2));
}

canvas.onmousedown = function (e)
{
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

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

canvas.onmouseup = function(e)
{
	paint = false;
};

canvas.onmouseleave = function(e)
{
	//paint = false;
};

function addClick(x, y, dragging)
{
	var offsetX = canvas.width/2;
	var offsetY = canvas.height/2;

	var newX = x-offsetX;
	var newY = y-offsetY;

	clickX.push(newX);
	clickY.push(newY);

	var rotated

	rotated = rotate(0, 0, newX, newY, -72);
	clickX2.push(rotated[0]);
	clickY2.push(rotated[1]);

	rotated = rotate(0, 0, newX, newY, -144);
	clickX3.push(rotated[0]);
	clickY3.push(rotated[1]);

	rotated = rotate(0, 0, newX, newY, -216);
	clickX4.push(rotated[0]);
	clickY4.push(rotated[1]);

	rotated = rotate(0, 0, newX, newY, -284);
	clickX5.push(rotated[0]);
	clickY5.push(rotated[1]);


	//clickX2.push(-newX+canvas.width);
	//clickY2.push(newY);

	//clickX3.push(-newX+canvas.width);
	//clickY3.push(-newY+canvas.height);

	//clickX4.push(newX);
	//clickY4.push(-newY+canvas.height);

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
			
	drawLines(clickX, clickY);
	drawLines(clickX2, clickY2);
	drawLines(clickX3, clickY3);
	drawLines(clickX4, clickY4);
	drawLines(clickX5, clickY5);
}

function drawLines( pointsX, pointsY, rotation )
{
	var lenX = pointsX.length;
	var lenY = pointsX.length;
	context.beginPath();
	context.moveTo(pointsX[lenX-2], pointsY[lenY-2]);
	context.lineTo(pointsX[lenX-1], pointsY[lenY-1]);
	context.closePath();
	context.stroke();
}

function resetArrays()
{
	clickX = new Array();
	clickY = new Array();
	clickX2 = new Array();
	clickY2 = new Array();
	clickX3 = new Array();
	clickY3 = new Array();
	clickX4 = new Array();
	clickY4 = new Array();
	clickX5 = new Array();
	clickY5 = new Array();
}

function clearDrawing(e) {
	e.preventDefault();
	resetArrays();
	context.clearRect(0, 0, canvas.width, canvas.height);
}

init();

