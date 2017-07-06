// Shows mobile side menu
function showMobileMenu(){
	$('#mobile_menu').show("slide", {direction:"left"},300);
	$('#haze').show();
	disableScroll();
}
// Hides mobile side menu
function hideMobileMenu(){
	$('#mobile_menu').hide("slide", {direction:"left"},300);
	$('#haze').hide();
	restoreScroll();
}

// disable page scrolling
function disableScroll(){
	$('main').css({
		'overflow': 'hidden',
		'height': '100%'
	});
}
// enable page scrolling
function restoreScroll(){
	$('main').css({
		'overflow': 'auto',
		'height': 'auto'
	});
};


// To be evaluated in document.ready function
function modal_preconstruction(){
	/* Plots Management Modal */
	
	// Update the parameters list for the current plot selection
	var plotSelectChange = function(){
		var fieldset = $('#plot_management_modal fieldset');
		var sel_ind = parseInt($('select#sel_plots').val());
	
		if (sel_ind > -1) {
			// change parameter selections
			var rows = fieldset.children();
			for (var i=0; i<rows.length; i++){
				var row_obj = $(rows[i]);
				var field = row_obj.find("label.checkbox").text().trim();
				
				if (Plotter.plot_parameters_array[sel_ind].parameters.hasOwnProperty(field)){
					// needed the checkboxradio to fix a bug
					row_obj.children('input.param_selector').checkboxradio().prop("checked", true).checkboxradio('refresh');
					row_obj.children('input.axis_selector').button().prop("checked", !Plotter.plot_parameters_array[sel_ind].parameters[field].is_primary).button('refresh');
					row_obj.children('label.toggle').text((Plotter.plot_parameters_array[sel_ind].parameters[field].is_primary?'Left Axis':'Right Axis'));
				} else {
					// needed the checkboxradio to fix a bug
					row_obj.children('input.param_selector').checkboxradio().prop("checked", false).checkboxradio('refresh');
					row_obj.children('input.axis_selector').button().prop("checked", false).button('refresh');
					row_obj.children('label.toggle').text("Left Axis");
				}
			};
			
			// change xvar selection
			$('#plot_management_modal #sel_x_axis')
				.val(Plotter.plot_parameters_array[sel_ind].xvar)
				.selectmenu('refresh');
		}
	};

	// Regenerate plot selection menu
	var regeneratePlotSelect = function(sel_index){
		var sel_plots = $('select#sel_plots');
		sel_plots.empty();
		// populate the plots container
		if (Plotter.plot_parameters_array.length == 0){
			// add the placeholder
			sel_plots.append('<option value="-1">NO PLOT</option>');
		} else {
			for (var i=0; i<Plotter.plot_parameters_array.length; i++){
				sel_plots.append('<option value="'+i+'">'+Plotter.plot_parameters_array[i].title+'</option>');
			}
		}
		
		// make selection
		if (sel_index === undefined){
			if (Plotter.plot_parameters_array.length == 0)
				sel_plots.val("-1");
			else
				sel_plots.val("0");
		} else
			sel_plots.val(sel_index.toString());
		
		// UI graphics
		sel_plots
			.selectmenu({
				change: plotSelectChange
			})
			.selectmenu('refresh');
	};
	
	$('#btn_plots_management').click(function(){
		$('#data_modal').dialog('close');
		$('#plot_management_modal').dialog({
			dialogClass: "no-close",
			position: {my: "center", at: "center", of: window},
			closeOnEscape: true,
			resizable: false,
			draggable: false,
			title: 'Plot Management',
			modal: true,
			width: 'auto',
			buttons: [
			{
				text: "Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
			],
		});
		
		// plot selector menu
		regeneratePlotSelect();
		
		// populate the parameters list (sorted)
		var parameters_list = [];
		for (var data_name in Plotter.data_sources){
			var data_source = Plotter.data_sources[data_name];
			if (data_source.active){
				data_source.fields.forEach(function(field){
					if (parameters_list.binarySearch(field) == -1){
						parameters_list.push(field);
						parameters_list.sort();
					}
				});
			}
		}
		
		// add parameters list to container
		var fieldset = $('#plot_management_modal fieldset');
		var xvar_select = $('#plot_management_modal #sel_x_axis');
		fieldset.empty(); xvar_select.empty();
		parameters_list.forEach(function(field){
			var checkbox_id = 'sel-param-'+field;
			var toggle_id = 'toggle-axis-'+field;
			
			// append to xvar selector
			xvar_select.append($('<option>', {
				value: field,
				text: field,
			}));
			
			// append to fieldset
			var style_disp = (field=='time'?' style="display:none" ':'');
			fieldset.append('\
				<div class="data_row"' + style_disp + '>\
					<label class="checkbox" for="' + checkbox_id + '">' + field + '</label>\
					<input type="checkbox" class="param_selector" id="' + checkbox_id + '">\
					<label class="toggle blue" for="' + toggle_id + '">Left Axis</label>\
					<input type="checkbox" class="axis_selector" id="' + toggle_id + '" />\
				</div>');
		});
		
		
		// UI graphics

		$("#sel_x_axis").selectmenu({
			change: function(){
				var sel_ind = parseInt($('select#sel_plots').val());
				if (sel_ind > -1){
					var param_name = $(this).val();
					Plotter.plot_parameters_array[sel_ind].xvar = param_name;
					Plotter.plot_parameters_array[sel_ind].addParameter(Plotter.data_sources, param_name, '', true);
					
					plotSelectChange();
					Plotter.redraw();
				}
			}
		});
		
		$("#plot_management_modal input.param_selector")
			.checkboxradio()
			.change(function(e){
				// get selected plot
				var plot_ind = $('select#sel_plots').val();
				if (plot_ind > -1){
					var target = $(e.target);
					
					// get changed parameter
					var param_name = target.siblings("label[for='"+target.attr('id')+"']").text().trim();
					
					if (target.is(":checked")){
						// get left/right axis
						var is_primary = !target.siblings("input.axis_selector").is(":checked");
						Plotter.plot_parameters_array[plot_ind].addParameter(Plotter.data_sources, param_name, '', is_primary);
					} else{
						Plotter.plot_parameters_array[plot_ind].removeParameter(Plotter.data_sources, param_name);
						if (Plotter.plot_parameters_array[plot_ind].xvar == param_name){
							Plotter.plot_parameters_array[plot_ind].xvar = 'time';
							Plotter.plot_parameters_array[plot_ind].addParameter(Plotter.data_sources, 'time', '', true);
							
							plotSelectChange();
						}
					}
					
					Plotter.redraw();
				}
			});
			
		$("#plot_management_modal input.axis_selector")
			.button()
			.change(function(e){
				var target = $(e.target);
				
				// UI change
				if (target.is(":checked"))
					target.siblings("label[for='"+target.attr('id')+"']").text("Right Axis");
				else
					target.siblings("label[for='"+target.attr('id')+"']").text("Left Axis");
				
				// get selected plot
				var plot_ind = $('select#sel_plots').val();
				if (plot_ind > -1){
					// associated parameter name
					var param_name = target.siblings("label.checkbox").text().trim();
					
					if (Plotter.plot_parameters_array[plot_ind].parameters.hasOwnProperty(param_name)){
						Plotter.plot_parameters_array[plot_ind].removeParameter(Plotter.data_sources, param_name);
						Plotter.plot_parameters_array[plot_ind].addParameter(Plotter.data_sources, param_name, '', !target.is(":checked"));
						Plotter.redraw();
					}
				}
			});;
		
		// refresh parameter selection states
		plotSelectChange();
	});
	
	// Add a plot
	$('#plot_management_modal button.add').click(function(){
		var new_len = Plotter.plot_parameters_array.length+1;
		var plot_parameters = new PlotParameters('Plot '+new_len);
		plot_parameters.addParameter(Plotter.data_sources, 'time', '', true);
		Plotter.plot_parameters_array.push(plot_parameters);
		
		// add plot canvas
		$('main').append('<div class="plot_container">\
			<canvas class="plot_main" width="5" height="5"></canvas>\
		</div>');
		Plotter.redraw();
		
		// select menu and parameter list
		regeneratePlotSelect(new_len-1);
		plotSelectChange();
	});
	
	// Rename a plot
	$('#plot_management_modal button.edit').click(function(){
		var sel_ind = parseInt($('select#sel_plots').val());
		if (sel_ind > -1){
			var title = Plotter.plot_parameters_array[sel_ind].title;
			
			$('#plot_management_modal #sel_plots_row').hide(0);
			$('#plot_management_modal #plot_title_row').show(0);
			$('#plot_management_modal #plot_title').val(title);
		}
	});
	var showSelectionAgain = function(){
		// abandon changes
		$('#plot_management_modal #sel_plots_row').show(0);
		$('#plot_management_modal #plot_title_row').hide(0);
	};
	$('#plot_management_modal #plot_title').keypress(function(e){
		if(e.which == 13) {
			$('#plot_management_modal #ok_plot_title').click();
		}
	});
	$('#plot_management_modal #ok_plot_title').click(function(){
		var sel_ind = parseInt($('select#sel_plots').val());
		Plotter.plot_parameters_array[sel_ind].title = $('#plot_management_modal #plot_title').val();
		
		// redo the selection
		regeneratePlotSelect(sel_ind);
		
		showSelectionAgain();
	});
	$('#plot_management_modal #cancel_plot_title').click(function(){
		showSelectionAgain();
	});
	
	// Remove a plot
	$('#plot_management_modal button.delete').click(function(){
		var sel_ind = parseInt($('select#sel_plots').val());
		if (sel_ind > -1){
			// remove data set
			Plotter.plot_parameters_array.splice(sel_ind, 1);
			
			// plot selector change
			regeneratePlotSelect();
			plotSelectChange();
			
			// remove canvas
			$('main').children(".plot_container:eq("+sel_ind+")").remove();
		}
	});
	
	
	/* Data Management Modal*/
	
	$('#btn_data_management').click(function(){
		$('#data_modal').dialog('close');
		$('#data_management_modal').dialog({
			dialogClass: "no-close",
			position: {my: "center", at: "center", of: window},
			closeOnEscape: true,
			resizable: false,
			draggable: false,
			title: 'Data Sources',
			modal: true,
			width: 'auto',
			buttons: [
			{
				text: "Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
			],
		});
		
		var accept = "";
		for (var i=0; i<Plotter.accepted_extensions.length; i++)
			accept += ((i==0)?"":",") + Plotter.accepted_extensions[i]
		$("input#file_add_data").attr("accept", accept);
	});
	
	$('#btn_add_data').click(function(){
		$('#file_add_data').click();
	});
	
	$('#file_add_data').change(function(e){
		// asynchronous read
		var file = e.target.files[0];
		Plotter.read(file, 
			function(progress){
				// on reading function
			
				$("#btn_add_data").hide(0);
				$("#data_progress").show(0).progressbar({
					value: progress
				});
			}, 
			function(){
				// complete function
			
				$("#data_progress").hide(0);
				$("#btn_add_data").show(0);
				
				// clear file input
				$('#file_add_data').val("");
			
				// add row to data layout
				var id = file.name.replaceAll(' ', '-');
				if ($('input[filename="' + file.name + '"]').length == 0){
					$('#data_management_modal fieldset').append('\
						<div class="data_row">\
							<label class="checkbox" for="checkbox-' + id + '">' + id + '</label>\
							<input type="checkbox" id="checkbox-' + id + '" filename = "' + file.name + '" ">\
							<button class="orange delete"><i class="fa fa-times fa-lg" aria-hidden="true"></i></button>\
						</div>');
					
					// make checkbox
					$('input[filename="' + file.name + '"]')
						.change(function(){
							var filename = $(this).attr("filename");
							Plotter.data_sources[filename].active = this.checked;
						})
						.checkboxradio()
						.prop("checked", true)
						.checkboxradio("refresh");
						
					// delete button
					$('input[filename="' + file.name + '"]').siblings("button.delete").click(function(){
						delete Plotter.data_sources[file.name];
						$(this).parent().remove();
					});
				}
				
				// redraw plots
				Plotter.redraw();
			});
	});
	
	/* Zoom dialog */
	
	var zoomEvents = (function(){
		var coordinates_start = [0,0];
		var coordinates_end = [0,0];
		
		return {
			start: function(is_horizontal, ev){
				var target_obj = $(ev.target);
				coordinates_start[0] = Math.max(0,ev.pageX - target_obj.offset().left);
				coordinates_start[1] = Math.max(0,ev.pageY - target_obj.offset().top);
			},
			
			end: function(is_horizontal, ev){
				$('canvas.plot_main')
					.css('cursor', 'default')
					.off('mousedown mouseup dblclick');
				
				var target_obj = $(ev.target);
				coordinates_end[0] = Math.max(0,ev.pageX - target_obj.offset().left);
				coordinates_end[1] = Math.max(0,ev.pageY - target_obj.offset().top);
				
				// realize zooming
				if (is_horizontal){
					Plotter.zoomHorizontal($(target_obj.parent()).index(), [coordinates_start[0], coordinates_end[0]]);
				} else {
					Plotter.zoomVertical($(target_obj.parent()).index(), [coordinates_start[1], coordinates_end[1]]);
				}
			},
		};
	})();
	
	$('#btn_zoom_x').click(function(){
		$('#zoom_modal').dialog('close');
		$('canvas.plot_main')
			.css('cursor', 'col-resize')
			.off("mousedown mouseup")
			.mousedown(function(e){
				zoomEvents.start(true, e);
			})
			.mouseup(function(e){
				zoomEvents.end(true, e);
			});
	});
	
	$('#btn_zoom_y').click(function(){
		$('#zoom_modal').dialog('close');
		$('canvas.plot_main')
			.css('cursor', 'row-resize')
			.off("mousedown mouseup")
			.mousedown(function(e){
				zoomEvents.start(false, e);
			})
			.mouseup(function(e){
				zoomEvents.end(false, e);
			});
	});
	
	$('#btn_zoom_revert').click(function(){
		$('#zoom_modal').dialog('close');
		var canvases = $('canvas.plot_main')
			.css('cursor', 'default')
			.off('mousedown mouseup dblclick');
		
		for (var i=0; i<canvases.length; i++){
			Plotter.zoomHorizontal(i, [-1, -1], true);
			Plotter.zoomVertical(i, [-1, -1], true);
		}
		
		Plotter.redraw();
	});
}


$(document).ready(function(){
	// small screen user menu trigger
	$('#mobile_menu_trigger').click(function(e){
		showMobileMenu();
		e.stopPropagation();
	});
	
	// global click action
	$('html').click(function() {
		hideMobileMenu();
	});
	
	modal_preconstruction();
	
	// refresh button
	$('.btn_refresh').click(function(){
		var onreading = function(progress){
			// on reading function
			
			$("button.btn_refresh").parent().hide(0);
			$("#refresh_progress").show(0).progressbar({
				value: progress
			});
		};
		
		var onfinish = function(files, file_ind){
			// complete function
			
			$("#refresh_progress").hide(0);
			$("button.btn_refresh").parent().show(0);
			
			// continue reading through files
			if (++file_ind < files.length)
				Plotter.read(files, onreading, onfinish, file_ind)
			else
				Plotter.redraw();
		}
	
		Plotter.reload(onreading, onfinish);
	});
	
	// data button
	$('.btn_data').click(function(){
		$('#data_modal').dialog({
			dialogClass: "no-close",
			closeOnEscape: true,
			resizable: false,
			draggable: false,
			title: 'Plotting',
			modal: true,
			buttons: [
			{
				text: "Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
			],
		});
	});
	
	// load button
	$('.btn_load').click(function(){
		$('#load_modal').dialog({
			dialogClass: "no-close",
			closeOnEscape: true,
			resizable: false,
			draggable: false,
			title: 'Load',
			modal: true,
			buttons: [
			{
				text: "Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
			],
		});
	});
	
	// save button
	$('.btn_save').click(function(){
		$('#save_modal').dialog({
			dialogClass: "no-close",
			closeOnEscape: true,
			resizable: false,
			draggable: false,
			title: 'Save',
			modal: true,
			buttons: [
			{
				text: "Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
			],
		});
	});
	
	// zoom button
	$('.btn_zoom').click(function(){
		$('#zoom_modal').dialog({
			dialogClass: "no-close",
			closeOnEscape: true,
			resizable: false,
			draggable: false,
			title: 'Zoom',
			modal: true,
			buttons: [
			{
				text: "Close",
				click: function() {
					$(this).dialog( "close" );
				}
			}
			],
		});
		
	});
});