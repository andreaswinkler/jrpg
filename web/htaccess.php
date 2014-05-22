<?php

include("bin/init.php");

$OUT = file_get_contents(".htaccess.template");

$OUT = _a($OUT, "root", ROOT);

_write(".htaccess", $OUT);

?>