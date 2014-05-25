<?php

// replaces a token in a template string
function _a($s, $key, $value) {

    if (!is_object($value)) {

        return str_ireplace("{".$key."}", $value, $s);
    
    }
    
    return $s;

}

// returns a config value or the given default value if not set
function _config($key, $defaultValue) {

    global $CONFIG;
    
    $parts = explode(".", $key);
    
    $value = $CONFIG;
    
    foreach ($parts as $part) {
    
        if (isset($value->$part)) {
        
            $value = $value->$part;
        
        } 
        // the config value could not be found
        else {
        
            return $defaultValue;
        
        }
    
    }
    
    return $value;

}

// returns a get param if set otherwise the default value
function _get($key, $default) {

    return isset($_GET[$key]) ? $_GET[$key] : $default;

}

// write a file
function _write($path, $content) {

    $h = fopen($path, "w");
    fwrite($h, $content);
    fclose($h);

}

// render sidebar
function _sidebar($sidebar, $activeItems = array(), $path = "{ROOT}") {

    $s = "<ul>";
    
    $a = array_shift($activeItems);
    
    foreach ($sidebar as $k => $v) {
    
        $active = $k == $a;
    
        $s.= "<li".($active ? " class=\"active\"" : "").">";
        $s.= "<a href=\"".$path.$k."\">";
        $s.= $v->name;
        $s.= "</a>";
        
        if (isset($v->items)) {
        
            $s.= _sidebar($v->items, $activeItems, $path.$k."/");
        
        }
        
        $s.= "</li>";    
    
    }
    
    $s.= "</ul>";
    
    return $s;

}

function _treeActiveElement($tree, $path = array()) {

    $key = array_shift($path);
    
    if ($key != "") {
    
        foreach ($tree as $k => $v) {
        
            if ($k == $key) {
            
                if (count($path) == 0) {
                
                    return $v;
                
                } else if (isset($v->items)) {
                
                    return _treeActiveElement($v->items, $path);
                
                }
            
            }    
        
        }
    
    }
    
    return null;

}

function _table($data) {

    $s = "<table>";
    $s.= "<thead><tr><th></th>";
    
    foreach ($data->headers as $th) {
    
        $s.= "<th>".$th."</th>";
    
    }
    
    $s.= "</tr></thead><tbody>";
    
    foreach ($data->rows as $tr) {
    
        $s.= "<tr><td>".$tr->name."</td>";
        
        foreach ($tr->values as $td) {
        
            $s.= "<td>".$td."</td>";    
        
        }
        
        $s.= "</tr>";
    
    }
    
    $s.= "</tbody></table>";
    
    return $s;
    
}

function _itemType($item) {

    return ucfirst($item->rank)." Small Sword";

}

function _itemImage($item) {

    $s = "<span class=\"image sockets-".count($item->sockets)."\">";
    $s.= "<img src=\"{ROOT}../tex/ui-".$item->type.".png\" />";
    foreach ($item->sockets as $socket) {
        
    }
    $s.= "</span>";
    
    return $s;

}

function _item($item) {

    $s = "";

    $s.= "<p class=\"item ".$item->rank."\">";
    $s.= "<strong>".$item->name."</strong>";
    $s.= _itemImage($item);
    $s.= _itemType($item)."<br /><br />";
    $s.= $item->attributes;
    $s.= "<br /><br />";
    $s.= $item->modifiers;
    $s.= "<br /><br />Requires level ".$item->level;
    $s.= "<cite>".$item->text."</cite>";
    $s.= "</p>";
    
    return $s;

}

?>