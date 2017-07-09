
var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var paint = false;


canvas.onmousedown = function (e){
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	paint = true;

	context.setLineDash([0 , 0]);

	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	
	redraw();
};

canvas.onmousemove = function(e) {
	if(paint){
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
};

canvas.onmouseup = function(e) {
	paint = false;
};

canvas.onmouseleave = function(e) {
	paint = false;
};


var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
	if(x < (canvas.width/2) && y < (canvas.height/2)){
		clickX.push(x);
		clickY.push(y);
		clickDrag.push(dragging);
	}
}

function redraw()
{
	context.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas

	context.setLineDash([0, 0]);
	context.strokeStyle = "#df4b26";
	context.lineJoin = "round";
	context.lineWidth = 5;
			
	for(var i=0; i < clickX.length; i++) {		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		} else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}

	flip();
}

function flip()
{
	var myImageData = context.getImageData(0, 0, (canvas.width/2), (canvas.height/2));

	context.save();
    context.scale(-1,1);
    context.drawImage(canvas,0,0,canvas.width*-1,canvas.height);
    context.restore();

    context.save();
    context.scale(1,-1);
    context.drawImage(canvas,0,0,canvas.width,canvas.height*-1);
    context.restore();
}

function chunk (arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

