var plotter = {
	base_canvas_width: 1000,
	base_label: 20,
	
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
		var main_canvas = $(canvas_container).find("canvas.plot_main")[0];
		var hor_res = main_canvas.width;
		var vert_res = main_canvas.height;

		/* draw grids in main plot area */
		
		var ctx = main_canvas.getContext('2d');
		ctx.beginPath();
		
		// draw vertical grid
		var hor_n = 10;
		var hor_step = hor_res/hor_n;
		for (var x=hor_step; x<hor_res; x+=hor_step){
			ctx.moveTo(x, 0);
			ctx.lineTo(x, vert_res);
		}
		
		// draw horizontal grid
		var vert_n = 4;
		var vert_step = vert_res/vert_n;
		for (var y=vert_step; y<vert_res; y+=vert_step){
			ctx.moveTo(0, y);
			ctx.lineTo(hor_res, y);
		}
		
		ctx.lineWidth=1;
		ctx.setLineDash([2, 2]);
		ctx.stroke();
		
		/* draw x-axis labels */
		
		// font size
		var label_font = Math.max(14,Math.floor(this.base_label/this.base_canvas_width*hor_res));
		
		var bottom_canvas = $(canvas_container).find("canvas.plot_bottom")[0];
		ctx = bottom_canvas.getContext('2d');
		
		ctx.font = label_font+"px Arial";
		for (var i=0; i<=hor_n; i++){
			var x_loc = i*hor_step;
			var x_tick = i*(maxX-minX)/hor_n;
			
			ctx.fillText(x_tick,x_loc,label_font);
		}
		
		ctx.fillText(xlabel,0,label_font*2);
	},
	
	redraw: function(){
		plotter.refit();
		
		var containers = $(".plot_container");
		for (var i=0; i<containers.length; i++){
			plotter.drawAxes(containers[i], 0, 100, 'time (s)', -50, 50, '');
		}
	}
}

$(document).ready(function(){
	plotter.redraw();
	
	$(window).resize(function(){
		plotter.redraw();
	});
});