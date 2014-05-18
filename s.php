<?php

function _newId($path) {

    require_once("lib/alphaid.php");

    $cnt = 1;

    $d = dir($path); 
    
    while (false !== ($e = $d->read())) {
    
        if ($e != "list.json" && strlen($e) > 5 && substr($e, -5) == ".json") {
    
            $cnt++;  
        
        }  
    
    }
    
    return alphaID($cnt, false, 6);

}

function _list($path) {

    $a = array();

    if (!file_exists($path."/list.json")) {
    
        $d = dir($path);
        
        while (false !== ($e = $d->read())) {
    
            if ($e != "list.json" && strlen($e) > 5 && substr($e, -5) == ".json") {
        
                $a[] = json_decode(file_get_contents($path."/".$e));
            
            }  
        
        }
    
        _write($path."/list.json", json_encode($a));
    
    }
    
    return file_get_contents($path."/list.json");
}

function _write($path, $s) {

    $h = fopen($path, "w");
    fwrite($h, $s);
    fclose($h);    

}

function _read($path, $key) {

    $path = $path."/".$key.".json";
    
    if (file_exists($path)) {
    
        return file_get_contents($path);
    
    }
    
    return "";

}

function _remove($path) {

    if (file_exists($path)) {
    
        unlink($path);
    
    }    

}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

switch ($_REQUEST["service"]) {

    case "map.save":
    
        $id = $_POST["id"];
        
        if ($id == 0) {
        
            $id = _newId("store/maps");        
        
        }
    
        $map = json_encode((object)array("id" => $id, "name" => $_POST["name"], "theme" => $_POST["theme"], "size" => $_POST["size"]));
        
        _write("store/maps/".$id.".json", $map);
    
        _remove("store/maps/list.json");
    
        echo $map; 
    
        break; 
        
    case "maps.list":
    
        echo _list("store/maps");
    
        break; 
     
    case "map.load":
    
        $map = json_decode(_read("store/maps", $_POST["id"]));
    
        $map->positions = array((object)array("isDefault" => true, "x" => 1000, "y" => 1000));
        $map->objects[] = (object)array("type" => "chest", "x" => 800, "y" => 800);
        $map->objects[] = (object)array("type" => "chest", "x" => 1200, "y" => 1200);
        $map->objects[] = (object)array("type" => "grandchest", "x" => 800, "y" => 1200);
        
        echo json_encode($map);

        break; 
    
    case "objectData.load":
    
        echo _read("store", "objectData");
    
        break;
    
    case "itemTypes.list":
    
        $items = (object)array(
            "gold" => (object)array(
                "name" => "Gold", 
                "baseType" => "bt_gold", 
                "superType" => "st_gold", 
                "category" => "gold", 
                "durability" => -1, 
                "minDropLevel" => 1, 
                "maxDropLevel" => 100, 
                "minRank" => 0
            ),            
            "leatherarmor" => (object)array(
                "name" => "Leather Armor", 
                "baseType" => "bt_chestarmor", 
                "superType" => "st_armor", 
                "category" => "c_equipment", 
                "durability" => 10,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 10, 
                "minRank" => 0,
                "inventoryWidth" => 2, 
                "inventoryHeight" => 3, 
                "maxStackAmount" => 1,  
                "etheralChance" => 0.05, 
                "attributes" => (object)array(
                    "armor" => array(1, 2)
                ), 
                "setPieces" => array(
                    (object)array(
                        "name" => "Woodcutter's Heart",
                        "set" => "Woodcutter's Garments",
                        "minLevel" => 5,   
                        "modifiers" => (object)array(
                            "armor" => array(3, 4), 
                            "vit" => array(10, 10), 
                            "str" => array(10, 10), 
                            "sockets" => array(2, 2)    
                        )
                    )
                )
            ),
            "helm" => (object)array(
                "name" => "Helm", 
                "baseType" => "bt_headgear", 
                "superType" => "st_armor", 
                "category" => "c_equipment", 
                "durability" => 10,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 10, 
                "minRank" => 0, 
                "inventoryWidth" => 2, 
                "inventoryHeight" => 2, 
                "maxStackAmount" => 1, 
                "attributes" => (object)array(
                    "armor" => array(2, 4)
                ), 
                "setPieces" => array(
                    (object)array(
                        "name" => "Woodcutter's Brain",
                        "set" => "Woodcutter's Garments", 
                        "minLevel" => 6,  
                        "modifiers" => (object)array(
                            "armor" => array(2, 3), 
                            "vit" => array(6, 6), 
                            "str" => array(6, 6), 
                            "sockets" => array(1, 1)    
                        )
                    )
                )
            ),
            "leatherpants" => (object)array(
                "name" => "Leather Pants", 
                "baseType" => "bt_pants", 
                "superType" => "st_armor", 
                "category" => "c_equipment", 
                "durability" => 10,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 10, 
                "minRank" => 0, 
                "inventoryWidth" => 2, 
                "inventoryHeight" => 2,
                "maxStackAmount" => 1,  
                "attributes" => (object)array(
                    "armor" => array(1, 2)
                ), 
                "setPieces" => array(
                    (object)array(
                        "name" => "Woodcutter's Pants",
                        "set" => "Woodcutter's Garments",
                        "minLevel" => 7,   
                        "modifiers" => (object)array(
                            "armor" => array(2, 3), 
                            "vit" => array(6, 6), 
                            "str" => array(6, 6), 
                            "sockets" => array(1, 1)    
                        )
                    )
                )
            ),
            "smallshield" => (object)array(
                "name" => "Small Shield", 
                "baseType" => "bt_shield", 
                "superType" => "st_armor", 
                "category" => "c_equipment", 
                "durability" => 10,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 10, 
                "minRank" => 0, 
                "inventoryWidth" => 2, 
                "inventoryHeight" => 2,
                "maxStackAmount" => 1,  
                "attributes" => (object)array(
                    "armor" => array(1, 2)
                )
            ),
            "smallsword" => (object)array(
                "name" => "Small Sword", 
                "baseType" => "bt_sword", 
                "superType" => "st_weapon", 
                "category" => "c_equipment", 
                "durability" => 10,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 10, 
                "minRank" => 0, 
                "inventoryWidth" => 2, 
                "inventoryHeight" => 2,
                "maxStackAmount" => 1,  
                "attributes" => (object)array(
                    "minDmg" => array(1, 1), 
                    "maxDmg" => array(3, 3), 
                    "attackSpeed" => array(0.95, 0.95)
                )  
            ),
            "token" => (object)array(
                "name" => "Token", 
                "baseType" => "bt_token", 
                "superType" => "st_token", 
                "category" => "c_equipment", 
                "durability" => -1,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 100, 
                "minRank" => 1,
                "inventoryWidth" => 1, 
                "inventoryHeight" => 1,
                "maxStackAmount" => 1,   
                "legendaries" => array(
                    (object)array(
                        "name" => "Jade Hound",
                        "minLevel" => 8,  
                        "modifiers" => (object)array(
                            "dmg" => array(3, 5), 
                            "life" => array(10, 12), 
                            "ias" => array(0.1, 0.15), 
                            "vit" => array(5, 7), 
                            "str" => array(5, 7)
                        )
                    )
                )
            ),
            "woodenstaff" => (object)array(
                "name" => "Wooden Staff", 
                "baseType" => "bt_staff", 
                "superType" => "st_weapon", 
                "category" => "c_equipment", 
                "durability" => -1,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 100, 
                "minRank" => 1, 
                "inventoryWidth" => 2, 
                "inventoryHeight" => 2,
                "maxStackAmount" => 1, 
                "attributes" => (object)array(
                    "minDmg" => array(1, 1), 
                    "maxDmg" => array(3, 3), 
                    "attackSpeed" => array(0.95, 0.95)
                )  
            ),
            "rune_el" => (object)array(
                "name" => "El", 
                "baseType" => "bt_rune", 
                "superType" => "st_rune", 
                "category" => "c_socketable", 
                "durability" => -1,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 100,
                "minRank" => 10,
                "maxStackAmount" => 100,   
                "modifiers" => (object)array(
                    "headgear" => (object)array(
                        "dex" => array(1, 1)
                    ),  
                    "armor" => (object)array(
                        "vit" => array(1, 1)
                    ),   
                    "weapon" => (object)array(
                        "str" => array(1, 1)
                    ),  
                    "shield" => (object)array(
                        "int" => array(1, 1)
                    ),     
                ) 
            ),
            "chippedruby" => (object)array(
                "name" => "Chipped Ruby", 
                "baseType" => "bt_ruby", 
                "superType" => "st_gem", 
                "category" => "c_socketable", 
                "durability" => -1,  
                "minDropLevel" => 1, 
                "maxDropLevel" => 20,
                "minRank" => 10, 
                "maxStackAmount" => 1000, 
                "modifiers" => (object)array(
                    "headgear" => (object)array(
                        "dex" => array(1, 1)
                    ),  
                    "armor" => (object)array(
                        "vit" => array(1, 1)
                    ),   
                    "weapon" => (object)array(
                        "str" => array(1, 1)
                    ),  
                    "shield" => (object)array(
                        "int" => array(1, 1)
                    ),     
                ) 
            ),
            "bt_staff" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Fire", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("fireball" => array(1, 1))), 
                    (object)array("name" => "of Ice", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("iceshard" => array(1, 1))), 
                    (object)array("name" => "of Lightning", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("lightningbolt" => array(1, 1)))
                ), 
                "rareNames1" => array(
                    "Vile", "Zonc", "Maid", "Pain", "Weld", "Proc"        
                ), 
                "rareNames2" => array(
                    "Ward", "Sting", "Mesh", "Storm", "Wind", "Net"                
                )    
            ), 
            "bt_sword" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Fire", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("fireball" => array(1, 1))), 
                    (object)array("name" => "of Ice", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("iceshard" => array(1, 1))), 
                    (object)array("name" => "of Lightning", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("lightningbolt" => array(1, 1)))
                ), 
                "rareNames1" => array(
                    "Vile", "Zonc", "Maid", "Pain", "Weld", "Proc"        
                ), 
                "rareNames2" => array(
                    "Ward", "Sting", "Mesh", "Storm", "Wind", "Net"                
                )    
            ), 
            "bt_shield" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Fire", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("fireball" => array(1, 1))), 
                    (object)array("name" => "of Ice", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("iceshard" => array(1, 1))), 
                    (object)array("name" => "of Lightning", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("lightningbolt" => array(1, 1)))
                ), 
                "rareNames1" => array(
                    "Vile", "Zonc", "Maid", "Pain", "Weld", "Proc"        
                ), 
                "rareNames2" => array(
                    "Ward", "Sting", "Mesh", "Storm", "Wind", "Net"                
                )    
            ),   
            "bt_chestarmor" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Toughness", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("armor" => array(1, 3)))
                ), 
                "rareNames1" => array(
                    "Vile", "Zonc", "Maid", "Pain", "Weld", "Proc"        
                ), 
                "rareNames2" => array(
                    "Ward", "Sting", "Mesh", "Storm", "Wind", "Net"                
                )
            ), 
            "bt_token" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Strength", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("str" => array(2, 4)))
                ), 
                "rareNames1" => array(
                    "Virgo", "Ursa", "Altair"
                ), 
                "rareNames2" => array(
                    "Helix", "Minor", "Major"
                )
            ), 
            "bt_pants" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Strength", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("str" => array(2, 4)))
                ), 
                "rareNames1" => array(
                    "Virgo", "Ursa", "Altair"
                ), 
                "rareNames2" => array(
                    "Helix", "Minor", "Major"
                )
            ), 
            "bt_headgear" => (object)array(
                "suffixes" => array(
                    (object)array("name" => "of Strength", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("str" => array(2, 4))), 
                    (object)array("name" => "of Vitality", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("vit" => array(2, 4)))
                ),
                "prefixes" => array(
                    (object)array("name" => "Brutal", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("dex" => array(1, 3))),  
                    (object)array("name" => "Sacred", "minLevel" => 1, "maxLevel" => 10, "modifiers" => (object)array("int" => array(1, 3)))   
                ), 
                "rareNames1" => array(
                    "Virgo", "Ursa", "Altair"
                ), 
                "rareNames2" => array(
                    "Helix", "Minor", "Major"
                )
            )               
        );
        echo json_encode($items);
    
        break; 
        
    case "dropTables.list":
    
        $dropTables = (object)array(
            "lootable" => (object)array(
                "chest" => (object)array(
                    "amount" => array(0, 2), 
                    "types" => (object)array(
                        "leatherarmor" => (object)array("chance" => 0.5),
                        "smallshield" => (object)array("chance" => 0.5), 
                        "helm" => (object)array("chance" => 0.5), 
                        "gold" => (object)array("chance" => 1.0), 
                        "token" => (object)array("chance" => 0.1), 
                        "woodenstaff" => (object)array("chance" => 0.15), 
                        "rune_el" => (object)array("chance" => 0.005), 
                        "chippedruby" => (object)array("chance" => 0.01)
                    )
                ), 
                "grandchest" => (object)array(
                    "amount" => array(2, 8), 
                    "types" => (object)array(
                        "leatherarmor" => (object)array("chance" => 0.5),
                        "smallshield" => (object)array("chance" => 0.5), 
                        "helm" => (object)array("chance" => 0.5), 
                        "gold" => (object)array("chance" => 1.0), 
                    )
                )
            )
        );
        echo json_encode($dropTables);
        
        break;

}

?>