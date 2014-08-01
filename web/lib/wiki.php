<?php

$sidebar = array(
    "monsters" => (object)array(
        "name" => "Monsters", 
        "items" => array(
            "hystrix" => (object)array(
                "name" => "Hystrix", 
                "content" => "<img src=\"{ROOT}img/hystrix.jpg\" /><p style=\"width:380px\">A small, slow creature which can be found on the shard of {SHARD_WESTERN_GOTHIC}.</p><p>It hates strangers and it's own kind alike and therefore wanders the fields and woods all by itself. It tries to flee if approached but will throw its razor-sharp spikes at anyone dumb enough to pursue it."
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
    ), 
    "masteries" => (object)array(
        "name" => "Masteries", 
        "content" => "<p>Often use your weapons and abilities to gain masteries in various categories. Each mastery rank will grant you a specific bonus when using the according weapons or skills.</p><p>Some weapon types also require a minimum rank to be used.</p>", 
        "items" => array(
            "warrior" => (object)array(
                "name" => "Warrior Masteries",
                "content" => "<p>Use melee-range weapons like swords to master this category.</p>", 
                "data" => (object)array(
                    "headers" => array("Kills with melee weapons", "Bonus"), 
                    "rows" => array(
                        (object)array(
                            "name" => "Apprentice Warrior", 
                            "values" => array("100", "+2% attack speed<br />+2% damage") 
                        ), 
                        (object)array(
                            "name" => "Fellow Warrior", 
                            "values" => array("1,000", "+4% attack speed<br />+5% damage") 
                        ), 
                        (object)array(
                            "name" => "Master Warrior", 
                            "values" => array("10,000", "+7% attack speed<br />+10% damage<br />you can use phase blades") 
                        ), 
                        (object)array(
                            "name" => "Grandmaster Warrior", 
                            "values" => array("100,000", "+10% attack speed<br />+15% damage<br />enables dual-wielding of 2-hand weapons") 
                        ), 
                        (object)array(
                            "name" => "Warrior Legend",
                            "values" => array("1,000,000", "+20% damage<br />+50% critical hit chance<br />+100% critical hit damage") 
                        ) 
                    )
                )                        
            ), 
            "hunter" => (object)array(
                "name" => "Hunter Masteries",
                "content" => "<p>Use bows and cross-bows to master this category.</p>", 
                "data" => (object)array(
                    "headers" => array("Kills with ranged weapons", "Bonus"), 
                    "rows" => array(
                        (object)array(
                            "name" => "Apprentice Hunter", 
                            "values" => array("100", "+2% attack speed<br />+2% damage") 
                        ), 
                        (object)array(
                            "name" => "Fellow Hunter", 
                            "values" => array("1,000", "+4% attack speed<br />+5% damage") 
                        ), 
                        (object)array(
                            "name" => "Master Hunter", 
                            "values" => array("10,000", "+7% attack speed<br />+10% damage<br />you can use shadow bows") 
                        ), 
                        (object)array(
                            "name" => "Grandmaster Hunter", 
                            "values" => array("100,000", "+10% attack speed<br />+15% damage<br />enables dual-wielding of 1-hand cross-bows") 
                        ), 
                        (object)array(
                            "name" => "Hunter Legend",
                            "values" => array("1,000,000", "+20% damage<br />+50% critical hit chance<br />+100% critical hit damage") 
                        ) 
                    )
                )                        
            ), 
            "mage" => (object)array(
                "name" => "Mage Masteries",
                "content" => "<p>Use elemental offensive skills to master this category.</p>", 
                "data" => (object)array(
                    "headers" => array("Kills with elemental attacks", "Bonus"), 
                    "rows" => array(
                        (object)array(
                            "name" => "Apprentice Mage", 
                            "values" => array("100", "+2% attack speed<br />+2% damage") 
                        ), 
                        (object)array(
                            "name" => "Fellow Mage", 
                            "values" => array("1,000", "+4% attack speed<br />+5% damage") 
                        ), 
                        (object)array(
                            "name" => "Master Mage", 
                            "values" => array("10,000", "+7% attack speed<br />+10% damage<br />you can use orbs") 
                        ), 
                        (object)array(
                            "name" => "Grandmaster Mage", 
                            "values" => array("100,000", "+10% attack speed<br />+15% damage<br />you can use source shields") 
                        ), 
                        (object)array(
                            "name" => "Sorcerer Legend",
                            "values" => array("1,000,000", "+20% damage<br />+50% critical hit chance<br />+100% critical hit damage") 
                        ) 
                    )
                )                        
            ),
            "priest" => (object)array(
                "name" => "Priest Masteries",
                "content" => "<p>Use healing skills to master this category.</p>", 
                "data" => (object)array(
                    "headers" => array("Amount of life healed<br />using healing skills", "Bonus"), 
                    "rows" => array(
                        (object)array(
                            "name" => "Apprentice Priest", 
                            "values" => array("10k", "???") 
                        ), 
                        (object)array(
                            "name" => "Fellow Priest", 
                            "values" => array("1M", "???") 
                        ), 
                        (object)array(
                            "name" => "Master Priest", 
                            "values" => array("10M", "???") 
                        ), 
                        (object)array(
                            "name" => "Grandmaster Priest", 
                            "values" => array("100M", "???") 
                        ), 
                        (object)array(
                            "name" => "Priest Legend",
                            "values" => array("1,000M", "???") 
                        ) 
                    )
                )                        
            ),
            "summoner" => (object)array(
                "name" => "Summoner Masteries",
                "content" => "<p>Summon creatures to master this category.</p>", 
                "data" => (object)array(
                    "headers" => array("Amount of damage dealt<br />by summoned creatures", "Bonus"), 
                    "rows" => array(
                        (object)array(
                            "name" => "Apprentice Summoner", 
                            "values" => array("10k", "your creatures have 10% more life and last 5% longer") 
                        ), 
                        (object)array(
                            "name" => "Fellow Summoner", 
                            "values" => array("1M", "your creatures damage is increased by 15%") 
                        ), 
                        (object)array(
                            "name" => "Master Summoner", 
                            "values" => array("10M", "you can use druid masks") 
                        ), 
                        (object)array(
                            "name" => "Grandmaster Summoner", 
                            "values" => array("100M", "the life and damage of your creatures is doubled") 
                        ), 
                        (object)array(
                            "name" => "Summoner Legend",
                            "values" => array("1,000M", "each time you summon creatures, they appear in pairs") 
                        ) 
                    )
                )                        
            ), 
            "assassin" => (object)array(
                "name" => "Assassin Masteries",
                "content" => "<p>Use traps, mines and turrets to master this category.</p>", 
                "data" => (object)array(
                    "headers" => array("Amount of creatures hurt<br />by your traps, mines and turrets", "Bonus"), 
                    "rows" => array(
                        (object)array(
                            "name" => "Apprentice Assassin", 
                            "values" => array("10k", "assassin spells deal 10% more damage") 
                        ), 
                        (object)array(
                            "name" => "Fellow Assassin", 
                            "values" => array("1M", "assassin spells last 10% longer") 
                        ), 
                        (object)array(
                            "name" => "Master Assassin", 
                            "values" => array("10M", "you can use claws") 
                        ), 
                        (object)array(
                            "name" => "Grandmaster Assassin", 
                            "values" => array("100M", "the attack speed of your turrets is increased by 100%") 
                        ), 
                        (object)array(
                            "name" => "Assassin Legend",
                            "values" => array("1,000M", "increase the area of effect of assassin spells by 200%") 
                        ) 
                    )
                )                        
            ) 
        )
    ), 
    "maths" => (object)array(
        "name" => "Maths", 
        "content" => "<p>There is quite some maths going on in this game. This section details about the various calculations.</p>", 
        "items" => array(
            "damage" => (object)array(
                "name" => "Damage calculation", 
                "content" => "<h2>Weapon DPS</h2><p><code>(DMG_MIN + DMG_MAX) / 2 * AS</code></p><h2>Character DPS</h2><p><code>AVG_DMG * STRENGTH_BONUS * MAIN_SKILL_BONUS * PASSIVES_BONUS * MASTERY_BONUS * (CRIT_DMG * CRIT_CHANCE) * AS</code></p><h2>Damage</h2><p><code>DMG - DMG_REDUCTION - ABSORB - BLOCK - ARMOR - RES</code></p>"
            ), 
            "defense" => (object)array(
                "name" => "Defense calculation",
                "content" => "<h2>Armor</h2><p><code>Armor / (Armor + 50 * MonsterLevel)</code></p><h2>Resistance</h2><p><code>Resistance / (Resistance + 5 * MonsterLevel)</code></p>"
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