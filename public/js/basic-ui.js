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
	// make checkboxes
	$("input[type='checkbox']").checkboxradio();
	
	$('#btn_plots_management').click(function(){
		// TEST ONLY
		Plotter.data_sources.file1 = new DataSource(true);
		Plotter.data_sources.file1.data = {
			time: [0, 1, 2, 3, 4],
			ail: [3, 4, -5, -5, 2],
			elv: [-2, -2.5, -2, -2.1, -1.5],
			stab: [-3, -3.2, -3.2, 2, -3.2],
			mfs: [0.1, 0.1, 0,2, 0, 0.44],
		};
		Plotter.data_sources.file2 = new DataSource(true);
		Plotter.data_sources.file2.data = {
			time: [0, 1, 2, 3, 4],
			ail: [2, 1, -4.2, -4.9, 1.5],
			elv: [-2.2, -2.7, -2.2, -2.8, -0.4],
			stab: [-3, -3.2, -3.2, 2, -3.2],
			mfs: [0.1, 0.1, 0,2, 0, 0.44],
		};
		
		pp1 = new PlotParameters('Surface Plot 1');
		Plotter.plot_parameters_array.push(pp1);
		pp1.addParameter(Plotter.data_sources, 'time', 's', true);
		pp1.addParameter(Plotter.data_sources, 'ail', 'deg', true);
		pp1.addParameter(Plotter.data_sources, 'elv', 'deg', false);

		$('main').append('<div class="plot_container">\
			<canvas class="plot_main" width="5" height="5"></canvas>\
		</div>');
		
		
		Plotter.redraw();
	});
	
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