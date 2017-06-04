<?php 

$ROOT = "../";
$APPLICATION = $ROOT."application/";
$CONTROLLERS = $APPLICATION."controllers/";
$VIEWS = $APPLICATION."views/";

// Asset load
require_once $ROOT."vendor/autoload.php";

// Switch between mobile and desktop
$detect = new Mobile_Detect;
if ($detect->isMobile()){
	require_once $CONTROLLERS."mobile_plot.php";
} else {
	require_once $CONTROLLERS."desktop_plot.php";
}
