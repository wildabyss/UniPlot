<!DOCTYPE html>
<html>
	<head>
		<!-- content type -->
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="Content-Style-Type" content="text/css">
		
		<!-- layout and styles -->
		<title>UniPlot</title>
		<link rel="stylesheet" href="/css/integrated.css" type="text/css" media="screen">
		<link rel="stylesheet" href="/css/jquery-ui.structure.min.css" type="text/css" media="screen">
		<link rel="stylesheet" href="/css/jquery-ui.theme.min.css" type="text/css" media="screen">
		<link rel="stylesheet" href="/css/integrated.css" type="text/css" media="screen">
	</head>
	<body>
		<script src="/js/jquery.min.js"></script>
		<script src="/js/jquery-ui.min.js"></script>
		<script src="/js/utils.js"></script>
		<script src="/js/basic-ui.js"></script>
		<script src="/js/plot_data.js"></script>
		<script src="/js/plotter.js"></script>
		
		<div id="haze" class="ui-widget-overlay"></div>
		<div id="global">
			<header>
				<div id="mobile_menu_trigger"></div>
				<a class="logo">UniPlot</a>
				
				<ul id="desktop_menu" class="button_group">
					<li><button class="green" id="btn_add_data">Data</button></li>
					<li><button class="blue" id="btn_add_data">Load</button></li>
					<li><button class="blue" id="btn_save">Save</button></li>
					<li><button class="teal" id="btn_annotate">Annotate</button></li>
					<li><button class="teal" id="btn_zoom">Zoom</button></li>
				</ul>
				
				<ul id="mobile_menu">
					<li><a>Data</a></li>
					<li><a>Load</a></li>
					<li><a>Save</a></li>
					<li><a>Annotate</a></li>
				</ul>
				
			</header>
			
			<aside class="modal_container" id="data_modal">
				<ul class="button_group modal_button_group">
					<li><button class="green" id="btn_data_management">Data Files</button></li>
					<li><button class="green" id="btn_plots_management">Plotting</button></li>
				</ul>
			</aside>
			
			<aside class="modal_container" id="load_modal">
				<ul class="button_group modal_button_group">
					<li><button class="blue" id="btn_load_session">Session</button></li>
					<li><button class="blue" id="btn_load_template">Template</button></li>
				</ul>
			</aside>
			
			<aside class="modal_container" id="save_modal">
				<ul class="button_group modal_button_group">
					<li><button class="blue" id="btn_save_session">Session</button></li>
					<li><button class="blue" id="btn_save_template">Template</button></li>
					<li><button class="blue" id="btn_save_pdf">PDF</button></li>
				</ul>
			</aside>
			
			<main>