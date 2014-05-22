<?php

$sidebar = array(
    "monsters" => (object)array(
        "name" => "Monsters", 
        "items" => array(
            "hystrix" => (object)array(
                "name" => "Hystrix", 
                "content" => "<p>A small, slow creature which can be found on the shard of {SHARD_WESTERN_GOTHIC}.</p><p>It hates strangers and it's own kind alike and therefore wanders the fields and woods all by itself. It tries to flee if approached but will throw its razor-sharp spikes at anyone dumb enough to pursue it."
            )
        )
    ), 
    "items" => (object)array(
        "name" => "Items",
        "items" => array(
            "weapons" => (object)array(
                "name" => "Weapons", 
                "items" => array(
                    "smallsword" => (object)array(
                        "name" => "Small Sword", 
                        "content" => "<p>Rather a knife than a sword it outputs less-than-great damage at a rather mediocre speed. It will however be sufficient to defend yourselves against the weakest of enemies.</p><p>Loot chests and the corpses of sword-swinging enemies to find better versions of this kind of weapon. They may provide you with sockets or other bonuses.</p><p class=\"stats\">Damage: 1-4<br />Attack speed: 1.2<br /><strong>3.5 dps</strong><br /><br /><br />requires level 1</p>"
                    )
                )
            )
        )
    )
);

$contentSidebar = _sidebar($sidebar, $R->path, "{ROOT}wiki/");

$activeElement = _treeActiveElement($sidebar, $R->path);

if ($activeElement != null) {

    $content = "<h1>".$activeElement->name."</h1>";
    
    if (isset($activeElement->content)) {
    
        $content.= $activeElement->content;
    
    }

}

?>