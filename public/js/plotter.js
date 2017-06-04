var plotter = {
	drawAxes: function(canvas, minX, maxX, minY, maxY){
		var hor_res = canvas.width;
		var vert_res = canvas.height;
		
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(0, vert_res/2);
		ctx.lineTo(hor_res, vert_res/2);
		ctx.moveTo(1, 0);
		ctx.lineTo(1, vert_res);
		ctx.lineWidth=2;
		ctx.setLineDash([10, 20]);
		ctx.stroke()
	}
}