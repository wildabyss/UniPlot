var plotter = {
	base_canvas_width: 1000,
	base_label: 20,
	canvas_offset: 15,
	
	refit: function(){
		var hor_res = $("canvas.plot_main").width();
		var vert_res = hor_res/3;
		
		var canvases = $("canvas.plot_main");
		for (var i=0; i<canvases.length; i++){
			canvases[i].width = hor_res;
			canvases[i].height = vert_res;
		}
		canvases.height(vert_res);
		var lefts = $("canvas.plot_left");
		var rights = $("canvas.plot_right");
		lefts.height(vert_res);
		rights.height(vert_res);
		for (var i=0; i<lefts.length; i++){
			lefts[i].height = vert_res;
			rights[i].height = vert_res;
		}
		
		var bottom_height = vert_res/3;
		$("div.plot_left").height(bottom_height);
		$("div.plot_right").height(bottom_height);
		var canvas_bottom = $("canvas.plot_bottom");
		canvas_bottom.height(vert_res/3);
		for (var i=0; i<canvas_bottom.length; i++){
			canvas_bottom[i].width = hor_res;
			canvas_bottom[i].height = bottom_height;
		}
	},
	
	drawAxes: function(canvas_container, minX, maxX, xlabel, minY, maxY, ylabel){
		// offset from the canvas
		var offset = plotter.canvas_offset;
		
		var main_canvas = $(canvas_container).find("canvas.plot_main")[0];
		var hor_res = main_canvas.width, hor_res_with_offset = hor_res - offset*2;
		var vert_res = main_canvas.height, vert_res_with_offset = vert_res - offset*2;
		
		// canvas context
		var ctx = main_canvas.getContext('2d');

		/* draw grids in main plot area */

		// draw bounding box
		ctx.beginPath();
		ctx.rect(offset, offset, hor_res_with_offset, vert_res_with_offset);
		ctx.lineWidth=1;
		ctx.setLineDash([]);
		ctx.stroke();
		
		// draw vertical grid
		ctx.beginPath();
		var hor_n = 10;
		var hor_step = hor_res_with_offset/hor_n;
		for (var x=hor_step+offset; x<=hor_res_with_offset; x+=hor_step){
			ctx.moveTo(x, offset);
			ctx.lineTo(x, offset+vert_res_with_offset);
		}
		
		// draw horizontal grid
		var vert_n = 4;
		var vert_step = vert_res_with_offset/vert_n;
		for (var y=vert_step+offset; y<=vert_res_with_offset; y+=vert_step){
			ctx.moveTo(offset, y);
			ctx.lineTo(offset+hor_res_with_offset, y);
		}
		
		ctx.setLineDash([2, 2]);
		ctx.stroke();
		
		
		
		/* draw x-axis labels */
		
		// font size
		var label_font = 14;
		
		var bottom_canvas = $(canvas_container).find("canvas.plot_bottom")[0];
		ctx = bottom_canvas.getContext('2d');
		
		ctx.font = label_font+"px Arial";
		ctx.textAlign = "center";
		for (var i=0; i<=hor_n; i++){
			var x_loc = i*hor_step + offset;
			var x_tick = i*(maxX-minX)/hor_n;
			
			ctx.fillText(x_tick,x_loc,label_font/2);
		}
		
		ctx.fillText(xlabel,hor_res/2,label_font*2);
	},
	
	redraw: function(){
		plotter.refit();
		
		var containers = $(".plot_container");
		for (var i=0; i<containers.length; i++){
			plotter.drawAxes(containers[i], 0, 100, 'time (s)', -50, 50, '');
		}
	},

}

$(document).ready(function(){
	plotter.redraw();
	
	$(window).resize(function(){
		plotter.redraw();
	});
});