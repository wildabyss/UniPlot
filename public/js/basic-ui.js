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