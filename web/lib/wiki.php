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
                "content" => "<p>There are three types of weapons: melee, ranged and staffs. Staffs provide relatively low melee damage but greatly enhance your magic.</p>", 
                "items" => array(
                    "one-hand" => (object)array(
                        "name" => "One-hand weapons",
                        "content" => "<p>One-hand weapons are often faster when compared to their two-hand versions but normally provide less damage output.</p><p>They allow you however to use a shield for some additional protection against the forces of evil.",  
                        "items" => array(
                            "small-sword" => (object)array(
                                "name" => "Small Sword", 
                                "content" => "<p>Rather a knife than a sword it outputs less-than-great damage at a rather mediocre speed. It will however be sufficient to defend yourselves against the weakest of enemies.</p><p>Loot chests and the corpses of sword-swinging enemies to find better versions of this kind of weapon. They may provide you with sockets or other bonuses.</p><p class=\"stats\">Damage: 1-4<br />Attack speed: 1.2<br /><strong>3.5 dps</strong><br /><br /><br />requires level 1</p>", 
                                "legendaries" => array(
                                    (object)array(
                                        "name" => "Blade of Sarkas", 
                                        "attributes" => "Damage: 4-7<br />Attack speed: 1.26", 
                                        "modifiers" => "+3-5% chance for Crushing Blow<br />+10 Life on Hit<br />+10-12 Strength<br /><br />+2 random magic properties", 
                                        "text" => "Sarkas was one of the great heroes in the times before the skies fell on Withermore.", 
                                        "rank" => "unique", 
                                        "level" => 10, 
                                        "sockets" => array(), 
                                        "type" => "smallsword"
                                    ), 
                                    (object)array(
                                        "name" => "Moon's Edge", 
                                        "attributes" => "Damage: 4-8<br />Attack speed: 1.2", 
                                        "modifiers" => "+10-15% attack speed<br />1 socket<br /><br />+4 random magic properties", 
                                        "text" => "", 
                                        "rank" => "unique", 
                                        "level" => 10,
                                        "sockets" => array(), 
                                        "type" => "smallsword"
                                    ),
                                    (object)array(
                                        "name" => "Seraph Shiv", 
                                        "attributes" => "Damage: 9<br />Attack speed: 1.32", 
                                        "modifiers" => "2 sockets<br /><br />+5 random magic properties", 
                                        "text" => "", 
                                        "rank" => "legendary", 
                                        "level" => 10,
                                        "sockets" => array(), 
                                        "type" => "smallsword"
                                    ) 
                                )
                            )    
                        )                    
                    ), 
                    "magic-weapons" => (object)array(
                        "name" => "Magic weapons", 
                        "content" => "<p>Magic versions of any weapon type can have up to two (one prefix and one suffix) of the affixes listed below.</p><p>Rare versions can even have up to 5.</p>", 
                        "data" => (object)array(
                            "headers" => array("modifiers"),
                            "rows" => array(
                                (object)array(
                                    "name" => "Sharp", 
                                    "values" => array("+2-5 minimum damage")
                                ), 
                                (object)array(
                                    "name" => "Wicked", 
                                    "values" => array("+1-3% critical hit chance")
                                ), 
                                (object)array(
                                    "name" => "Cruel", 
                                    "values" => array("+10-20% critical hit damage")
                                ), 
                                (object)array(
                                    "name" => "Fast", 
                                    "values" => array("+3-6% attack speed")
                                ),
                                (object)array(
                                    "name" => "Socketed", 
                                    "values" => array("+1-2 socket(s)")
                                ),  
                                (object)array(
                                    "name" => "of Brutality", 
                                    "values" => array("+2-5 maximum damage")
                                ), 
                                (object)array(
                                    "name" => "of Bleeding", 
                                    "values" => array("+1-3% chance for Open Wounds")
                                ), 
                                (object)array(
                                    "name" => "of Pain", 
                                    "values" => array("+1-2% chance for Crushing Blow")
                                ), 
                                (object)array(
                                    "name" => "of Strength", 
                                    "values" => array("+2-6 Strength")
                                ), 
                                (object)array(
                                    "name" => "of Dexterity", 
                                    "values" => array("+2-6 Dexterity")
                                ), 
                                (object)array(
                                    "name" => "of Focus", 
                                    "values" => array("+2-6 Focus")
                                ), 
                                (object)array(
                                    "name" => "of Vitality", 
                                    "values" => array("+2-6 Vitality")
                                ), 
                            )
                        ) 
                    )
                )
            )
        )
    ), 
    "misc" => (object)array(
        "name" => "Miscellaneous", 
        "items" => array(
            "gems" => (object)array(
                "name" => "Gems", 
                "content" => "<p>They exist in various colors and qualities. Socket some into your items to enhance them.</p><p>Visit the jeweller to create higher quality gems or combine different gems into jewels.", 
                "items" => array(
                    "ruby" => (object)array(
                        "name" => "Ruby", 
                        "content" => "<p>Useful for melee characters. It increases strenght and improves the damage of your weapons.</p>", 
                        "data" => (object)array(
                            "headers" => array("Weapons", "Body Armor", "Helm", "Jewellery"), 
                            "rows" => array(
                                (object)array(
                                    "name" => "Ruby", 
                                    "values" => array("+1-2 damage", "+5 strength", "+15% experience", "+25 life on hit")
                                ), 
                                (object)array(
                                    "name" => "Square Ruby", 
                                    "values" => array("+4-8 damage", "+15 strength", "+23% experience", "+50 life on hit")
                                ),
                                (object)array(
                                    "name" => "Perfect Ruby", 
                                    "values" => array("+10-20 damage", "+45 strength", "+32% experience", "+100 life on hit")
                                ),
                                (object)array(
                                    "name" => "Imperial Ruby", 
                                    "values" => array("+22-44 damage", "+100 strength", "+41% experience", "+200 life on hit")
                                ),
                                (object)array(
                                    "name" => "Royal Ruby", 
                                    "values" => array("+46-92 damage", "+180 strength", "+50% experience", "+400 life on hit")
                                )
                            )                                
                        )
                    )
                )
            ), 
            "gold" => (object)array(
                "name" => "Gold", 
                "content" => "<p>Well, it's gold. It buys you goods and services.</p>"
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
        
        if (isset($activeElement->data)) {
        
            $content.= _table($activeElement->data);
        
        }
        
        if (isset($activeElement->legendaries)) {
        
            $content.= "<h2>Special items</h2>";
        
            foreach ($activeElement->legendaries as $legendary) {
            
                $content.= _item($legendary);
                        
            }
        
        }
    
    }

}

?>