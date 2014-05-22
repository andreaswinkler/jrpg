<?php

include("bin/init.php");

$OUT = file_get_contents("html/site.html");

$topNavigation = "";

$topNavigationItems = array(
    "home" => "Home / News", 
    "game" => "Game", 
    "wiki" => "Wiki"
);

foreach ($topNavigationItems as $k => $v) {

    $active = $k == $R->page;

    $topNavigation.= "<li".($active ? " class=\"active\"" : "")."><a href=\"{ROOT}".$k."\">".$v."</a></li>";

}

$OUT = _a($OUT, "top_navigation", $topNavigation);

$content = "";
$contentSidebar = "";

$templatePath = "html/".$R->page.".html";

if (file_exists($templatePath)) {

    $content = file_get_contents($templatePath);

}

$contentProcessorScript = "lib/".$R->page.".php";

if (file_exists($contentProcessorScript)) {

    include($contentProcessorScript);

}

$OUT = _a($OUT, "content", $content);
$OUT = _a($OUT, "content_sidebar", $contentSidebar);

$OUT = _a($OUT, "page", $R->page);
$OUT = _a($OUT, "root", ROOT);

echo $OUT;

?>