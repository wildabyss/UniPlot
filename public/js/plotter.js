/**
 * Plotter singleton object
 */
var Plotter = (function(){
	/* PRIVATE MEMBERS */

	// canvas dimensions
	var base_canvas_width = 1000;
	var base_font = 16;
	var canvas_height_ratio = 0.4;
	var canvas_min_height = 250;
	
	// canvas labeling area
	var canvas_side_ratio = 0.1;
	var canvas_top_ratio = 0.25;
	var canvas_bottom_ratio = 0.18;
	var canvas_min_offset = 30;
	
	// colors for each plot line
	var colors = [
		'#000', 			// black
		'#FF0000', 			// red
		'#0000FF', 			// blue
		'#008000', 			// green
		'#800000', 			// maroon
		'#00FFFF', 			// aqua
		'#FFA333',			// orange
		'#800080', 			// purple
		'#00FF00', 			// lime
		'#FF00FF',			// fuchsia
	];	

	var time = 'time';
	
	var refit = function(){
		var hor_res = $("canvas.plot_main").width();
		var vert_res = Math.max(canvas_min_height, hor_res*canvas_height_ratio);
		
		var canvases = $("canvas.plot_main");
		for (var i=0; i<canvases.length; i++){
			canvases[i].width = hor_res;
			canvases[i].height = vert_res;
		}
		canvases.height(vert_res);
	};
	
	var plot = function(canvas_container, plot_data){
		// parse plot_data
		if (!plot_data instanceof PlotData)
			throw "second parameter must be an instance of plot_graph_data class";
		var minX = plot_data.hor_zoom[0], maxX = plot_data.hor_zoom[1];
		var minY_pri = plot_data.pri_vert_zoom[0], maxY_pri = plot_data.pri_vert_zoom[1];
		var minY_sec = plot_data.sec_vert_zoom[0], maxY_sec = plot_data.sec_vert_zoom[1];
		var xlabel = plot_data.xvar + (plot_data.data[plot_data.xvar].unit=="" ? "" : " (" + plot_data.data[plot_data.xvar].unit + ")");
		var title = plot_data.title;
	
		// total canvas dimensions
		var main_canvas = $(canvas_container).find("canvas.plot_main")[0];
		var hor_res = main_canvas.width;
		var vert_res = main_canvas.height;
	
		// offset from the canvas
		var side_offset = Math.max(canvas_min_offset, canvas_side_ratio*hor_res);
		var top_offset = Math.max(canvas_min_offset, canvas_top_ratio*vert_res);
		var bottom_offset = Math.max(canvas_min_offset, canvas_bottom_ratio*vert_res);
		
		var hor_res_with_offset = hor_res - side_offset*2;
		var vert_res_with_offset = vert_res - top_offset-bottom_offset;
		
		// canvas context
		var ctx = main_canvas.getContext('2d');
		ctx.strokeStyle = '#999999';

		
		/* draw grids in main plot area */

		// draw bounding box
		ctx.beginPath();
		ctx.rect(side_offset, top_offset, hor_res_with_offset, vert_res_with_offset);
		ctx.lineWidth=1;
		ctx.setLineDash([]);
		ctx.stroke();
		
		// draw vertical grid
		ctx.beginPath();
		var hor_n = 10;
		var hor_step = hor_res_with_offset/hor_n;
		for (var x=hor_step+side_offset; x<hor_res_with_offset+hor_step; x+=hor_step){
			ctx.moveTo(x, top_offset);
			ctx.lineTo(x, top_offset+vert_res_with_offset);
		}
		
		// draw horizontal grid
		var vert_n = 4;
		var vert_step = vert_res_with_offset/vert_n;
		for (var y=vert_step+top_offset; y<vert_res_with_offset+vert_step; y+=vert_step){
			ctx.moveTo(side_offset, y);
			ctx.lineTo(side_offset+hor_res_with_offset, y);
		}
		
		ctx.setLineDash([2, 2]);
		ctx.stroke();

		
		/* draw labels */
		
		// font size
		var label_font = Math.min(base_font, Math.max(10, base_font/base_canvas_width*hor_res));
		var title_font = Math.min(18, Math.max(13, base_font*2/base_canvas_width*hor_res));
		ctx.font = label_font+"px Arial";
		ctx.textBaseline = "middle";
		
		// draw x-ticks
		for (var i=0; i<=hor_n; i++){
			var loc = i*hor_step + side_offset;
			var tick = i*(maxX-minX)/hor_n + minX;
			
			ctx.textAlign = "center";
			ctx.fillText(tick, loc, top_offset + vert_res_with_offset + label_font/2 + 5);
		}
		
		// draw y-ticks
		for (var i=0; i<=vert_n; i++){
			var loc = top_offset + vert_res_with_offset - i*vert_step;
			var tick = i*(maxY_pri-minY_pri)/vert_n + minY_pri;
			
			ctx.textAlign = "right";
			ctx.fillText(tick, side_offset - label_font/2 - 3, loc);
		}
		
		// draw y-ticks (secondary axis)
		if (plot_data.size_secondary > 0){
			for (var i=0; i<=vert_n; i++){
				var loc = top_offset + vert_res_with_offset - i*vert_step;
				var tick = i*(maxY_sec-minY_sec)/vert_n + minY_sec;
				
				ctx.textAlign = "left";
				ctx.fillText(tick, side_offset + hor_res_with_offset + label_font/2 + 3, loc);
			}
		}
		
		// draw x-label
		ctx.textAlign = "center";
		ctx.fillText(xlabel,hor_res/2, top_offset + vert_res_with_offset + label_font*2+5);

		// draw plot title
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.font = "bold " + title_font+"px Arial";
		ctx.fillText(plot_data.title, hor_res/2, 0);
		
		
		/* plot data */
		
		ctx.setLineDash([]);
		
		// determine primary horizontal visible area
		var project_coords = function(zoom_bounds_x, zoom_bounds_y, x, y){
			if (x<=zoom_bounds_x[1] && x>=zoom_bounds_x[0] && y<=zoom_bounds_y[1] && y>=zoom_bounds_y[0]){
				var x_proj = side_offset + hor_res_with_offset*(x-zoom_bounds_x[0])/(zoom_bounds_x[1]-zoom_bounds_x[0]);
				var y_proj = top_offset + vert_res_with_offset-vert_res_with_offset*(y-zoom_bounds_y[0])/(zoom_bounds_y[1]-zoom_bounds_y[0]);
				
				return [x_proj, y_proj];
			}
			
			return false;
		};
		
		// determine legend preliminaries
		var N_primary = plot_data.size_primary, N_secondary = plot_data.size_secondary;
		if (plot_data.xvar != time){
			if (plot_data.data[plot_data.xvar].is_primary)
				N_primary--;
			else
				N_secondary--;
		}
		var legend_spacing = hor_res/Math.max(N_primary, N_secondary+1);
		
		var counter_pri = 0, counter_sec = 0;
		for (data_name in plot_data.data){
			// skip the primary variables
			if (data_name == plot_data.xvar || data_name == time)
				continue;
		
			// color
			ctx.beginPath();
			ctx.strokeStyle = colors[counter_pri+counter_sec];
		
			// draw legend
			var legend_x, legend_y;
			
			if (plot_data.data[data_name].is_primary){
				legend_x = legend_spacing*(++counter_pri);
				legend_y = title_font + label_font;
			} else {
				legend_x = legend_spacing*(++counter_sec);
				legend_y = title_font + label_font*2;
			}
			
			if (plot_data.data[data_name].is_primary){
				ctx.textAlign = "left";
				ctx.moveTo(legend_x - 5, legend_y+label_font/2);
				ctx.lineTo(legend_x - 20, legend_y+label_font/2);
			} else {
				ctx.textAlign = "right";
				ctx.moveTo(legend_x + 5, legend_y+label_font/2);
				ctx.lineTo(legend_x + 20, legend_y+label_font/2);
				
			}
			ctx.textBaseline = "top";
			ctx.font = label_font+"px Arial";
			ctx.fillText(data_name + " ("+plot_data.data[data_name].unit+")", legend_x, legend_y);
		
			// draw actual plot lines
			for (var i=0; i<plot_data.data[data_name].data.length-1; i++){
				var coords_start = project_coords(plot_data.hor_zoom, 
					plot_data.data[data_name].is_primary?plot_data.pri_vert_zoom:plot_data.sec_vert_zoom, 
					plot_data.data[plot_data.xvar].data[i], plot_data.data[data_name].data[i]);
				var coords_end = project_coords(plot_data.hor_zoom, 
					plot_data.data[data_name].is_primary?plot_data.pri_vert_zoom:plot_data.sec_vert_zoom, 
					plot_data.data[plot_data.xvar].data[i+1], plot_data.data[data_name].data[i+1]);
			
				ctx.moveTo(coords_start[0], coords_start[1]);
				ctx.lineTo(coords_end[0], coords_end[1]);
			}
			ctx.stroke();
		}
		
	};
	
	
	/* PUBLIC MEMBERS */
	
	// data array containing PlotData
	return {
		data_array: [],
		
		redraw: function(){
			refit();
			
			var containers = $(".plot_container");
			// sanity check
			if (this.data_array.length != containers.length)
				throw "data lengths mismatch";
			
			for (var i=0; i<containers.length; i++){
				plot(containers[i], this.data_array[i]);
			}
		}
	};

})();



$(document).ready(function(){
	var p_data = new PlotData('Surface Plot 1');
	Plotter.data_array.push(p_data);
	// test data for now
	p_data.addData('time', [0, 10, 20, 30], 's', true);
	p_data.addData('ail', [0, 15, 50, 30], 'deg', true);
	p_data.addData('elv', [0, 80, -20, 30], 'deg', true);
	p_data.addData('stab', [0, -5, -7, -5], 'deg', false);
	
	p_data = new PlotData('Surface Plot 2');
	Plotter.data_array.push(p_data);
	// test data for now
	p_data.addData('time', [0, 10, 20, 30], 's', true);
	p_data.addData('ail', [30, 15, 50, 30], 'deg', true);
	p_data.addData('elv', [42.22, 80, -20, 30], 'deg', true);
	p_data.addData('stab', [0, -5, -7, -50], 'deg', false);
	
	
	
	Plotter.redraw();
	
	$(window).resize(function(){
		Plotter.redraw();
	});
});