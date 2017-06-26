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
	
	var setLineStyle = function(ctx, file_counter, param_counter){
		if (file_counter == 0)
			ctx.setLineDash([]);
		else
			ctx.setLineDash([2/file_counter, 3/file_counter]);
		ctx.strokeStyle = colors[param_counter];
	}
	
	/**
	 * Refit the canvas size as browser resizes
	 */
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

	
	/**
	 * Plot the single canvas with plot_parameters from data_sources
	 */
	var plot = function(data_sources, canvas_container, plot_parameters){
		// parse plot_parameters
		if (!plot_parameters instanceof PlotParameters)
			throw "second parameter must be an instance of plot_graph_data class";
		var minX = plot_parameters.hor_zoom[0], maxX = plot_parameters.hor_zoom[1];
		var minY_pri = plot_parameters.pri_vert_zoom[0], maxY_pri = plot_parameters.pri_vert_zoom[1];
		var minY_sec = plot_parameters.sec_vert_zoom[0], maxY_sec = plot_parameters.sec_vert_zoom[1];
		var xlabel = plot_parameters.xvar + (plot_parameters.parameters[plot_parameters.xvar].unit=="" ? "" : " (" + plot_parameters.parameters[plot_parameters.xvar].unit + ")");
		var title = plot_parameters.title;
	
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
		
		
		/* plot data */
		
		// Project the coordinates into the canvas
		var projectCoordinates = function(zoom_bounds_x, zoom_bounds_y, x, y){
			var x_proj = side_offset + hor_res_with_offset*(x-zoom_bounds_x[0])/(zoom_bounds_x[1]-zoom_bounds_x[0]);
			var y_proj = top_offset + vert_res_with_offset-vert_res_with_offset*(y-zoom_bounds_y[0])/(zoom_bounds_y[1]-zoom_bounds_y[0]);
			
			return [x_proj, y_proj];
		};
		
		var num_active_sources = 0;
		var N_primary = 0, N_secondary = 0;
		var active_once = false;
		for (parameter_name in plot_parameters.parameters){
			// skip the primary variables
			if (parameter_name == plot_parameters.xvar || parameter_name == time)
				continue;
				
			// get the Parameter object
			var parameter = plot_parameters.parameters[parameter_name];

			var file_counter = 0;
			for (source_name in data_sources){
				var data_source = data_sources[source_name];
				if (!data_source.active)
					continue;
			
				// color
				ctx.beginPath();
				setLineStyle(ctx, file_counter, N_primary+N_secondary);
			
				// draw actual plot lines
				for (var i=0; i<data_source.data[parameter_name].length-1; i++){
					var coords_start = projectCoordinates(plot_parameters.hor_zoom, 
						parameter.is_primary?plot_parameters.pri_vert_zoom:plot_parameters.sec_vert_zoom, 
						data_source.data[plot_parameters.xvar][i], data_source.data[parameter_name][i]);
					var coords_end = projectCoordinates(plot_parameters.hor_zoom, 
						parameter.is_primary?plot_parameters.pri_vert_zoom:plot_parameters.sec_vert_zoom, 
						data_source.data[plot_parameters.xvar][i+1], data_source.data[parameter_name][i+1]);
				
					ctx.moveTo(coords_start[0], coords_start[1]);
					ctx.lineTo(coords_end[0], coords_end[1]);
				}
				ctx.stroke();
				
				if (!active_once)
					num_active_sources++;
				file_counter++;
			}
			
			// counters for primary and secondary axes
			if (parameter.is_primary)
				N_primary++;
			else
				N_secondary++;
				
			active_once = true;
		}
		
		// clear away extraneous lines
		ctx.clearRect(0, 0, side_offset, vert_res);
		ctx.clearRect(0, 0, hor_res, top_offset);
		ctx.clearRect(hor_res-side_offset, 0, side_offset, vert_res);
		ctx.clearRect(0, vert_res-bottom_offset, hor_res, bottom_offset);

		
		/* draw grids in main plot area */

		// draw bounding box
		ctx.beginPath();
		ctx.strokeStyle = '#999999';
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
		if (plot_parameters.size_secondary > 0){
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
		ctx.fillText(plot_parameters.title, hor_res/2, 0);
		
		
		/* draw legends */
		
		// determine legend preliminaries
		var legend_spacing = hor_res/Math.max(N_primary*num_active_sources+1, N_secondary*num_active_sources+1);
		
		ctx.setLineDash([]);
		N_primary = 0; N_secondary = 0;
		for (parameter_name in plot_parameters.parameters){
			// skip the primary variables
			if (parameter_name == plot_parameters.xvar || parameter_name == time)
				continue;
				
			var file_counter = 0;
			for (source_name in data_sources){
				var data_source = data_sources[source_name];
				if (!data_source.active)
					continue;
					
				// color
				ctx.beginPath();
				setLineStyle(ctx, file_counter, N_primary+N_secondary);
			
				// draw legend
				var legend_x, legend_y;
				if (plot_parameters.parameters[parameter_name].is_primary){
					legend_x = legend_spacing*(num_active_sources*N_primary + file_counter+1);
					legend_y = title_font + label_font;
				} else {
					legend_x = legend_spacing*(num_active_sources*N_secondary + file_counter+1);
					legend_y = title_font + label_font*2;
				}
				
				if (plot_parameters.parameters[parameter_name].is_primary){
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
				ctx.fillText(parameter_name + " ("+plot_parameters.parameters[parameter_name].unit+")" + " ["+source_name+"]", legend_x, legend_y);
				ctx.stroke();
				
				file_counter++;
			}
			
			if (plot_parameters.parameters[parameter_name].is_primary)
				N_primary++;
			else
				N_secondary++;
		}
	};
	
	
	/* PUBLIC MEMBERS */
	
	return {
		// Array of PlotParameters objects
		plot_parameters_array: [],
		data_sources: {},
		
		redraw: function(){
			refit();
			
			var containers = $(".plot_container");
			// sanity check
			if (this.plot_parameters_array.length != containers.length)
				throw "data lengths mismatch";
			
			for (var i=0; i<containers.length; i++){
				plot(this.data_sources, containers[i], this.plot_parameters_array[i]);
			}
		},
		
		zoom_horizontal: function(zoom_bounds_x, no_redraw){
			// set x_bounds
			this.plot_parameters_array.forEach(function(el){
				el.setHorizontalZoom(zoom_bounds_x[0], zoom_bounds_x[1]);
			});
		
			if (no_redraw === undefined)
				no_redraw = false;
			if (!no_redraw)
				this.redraw();
		},
		
		zoom_vertical: function(canvas_index, zoom_bounds_y_pri, zoom_bounds_y_sec, no_redraw){
			// set y bounds
			this.plot_parameters_array[canvas_index].setPriVerticalZoom(zoom_bounds_y_pri[0], zoom_bounds_y_pri[1]);
			this.plot_parameters_array[canvas_index].setSecVerticalZoom(zoom_bounds_y_sec[0], zoom_bounds_y_sec[1]);
		
			if (no_redraw === undefined)
				no_redraw = false;
			if (!no_redraw)
				this.redraw();
		},
	};

})();



$(document).ready(function(){
	$(window).resize(function(){
		Plotter.redraw();
	});
});