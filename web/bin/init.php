<?php

define("ROOT", dirname($_SERVER['SCRIPT_NAME'])."/");

include("bin/utils.php");

$R = (object)array();
$R->page = _get("page", "home");
$R->path = explode("/", _get("path", ""));

?>