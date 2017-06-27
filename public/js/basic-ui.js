// Shows mobile side menu
var showMobileMenu = function(){
	$('#mobile_menu').show("slide", {direction:"left"},300);
	$('#haze').show();
	disableScroll();
};
// Hides mobile side menu
var hideMobileMenu = function(){
	$('#mobile_menu').hide("slide", {direction:"left"},300);
	$('#haze').hide();
	restoreScroll();
};

// disable page scrolling
var disableScroll = function(){
	$('main').css({
		'overflow': 'hidden',
		'height': '100%'
	});
};
// enable page scrolling
var restoreScroll = function(){
	$('main').css({
		'overflow': 'auto',
		'height': 'auto'
	});
};


// To be evaluated in document.ready function
var modal_preconstruction = function(){
	$('#btn_plots_management').click(function(){
		// TEST ONLY
		/*pp1 = new PlotParameters('Surface Plot 1');
		Plotter.plot_parameters_array.push(pp1);
		pp1.addParameter(Plotter.data_sources, 'time', 's', true);
		pp1.addParameter(Plotter.data_sources, 'ail', 'deg', true);
		pp1.addParameter(Plotter.data_sources, 'mfs', 'deg', false);

		$('main').append('<div class="plot_container">\
			<canvas class="plot_main" width="5" height="5"></canvas>\
		</div>');
		
		
		Plotter.redraw();*/
		
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
		
		$("#sel_plots").selectmenu();
		$("#sel_x_axis").selectmenu();
		
		$("input[type='checkbox']").checkboxradio()
		
		$("#myToggleButton").button();
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
					$('#data_management_modal > fieldset').append('\
					<div class="data_row">\
						<label for="checkbox-' + id + '">' + id + '</label>\
						<input type="checkbox" id="checkbox-' + id + '" filename = "' + file.name + '" ">\
						<button class="orange delete"><i class="fa fa-times fa-lg" aria-hidden="true"></i></button>\
					</div>');
					
					// make checkbox
					$("input[type='checkbox']")
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
});