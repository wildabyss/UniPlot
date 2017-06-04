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
});