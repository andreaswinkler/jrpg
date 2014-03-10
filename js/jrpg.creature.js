JRPG.Creature = function(type, name, level, rank) {

    this.rank = 0;
    this.equipment = null;
    this.items = null;
    this.skills = null;
    
    this.initCreature = function(type, name, level, rank) {
    
        // load creature's base settings
        var data = JRPG.Object.data[type] || {}, 
            speed = data.speed || 0, 
            equipmentItems;
        
        // initialize the moving object base type
        this.initMovingObject(type, name, level, speed);
        
        // set the rank of the creature
        // 
        // NORMAL: attributes are only based upon the level
        // CHAMPION: creature has up to 3 additional modifiers, based on 
        //           level and difficulty
        // NAMED: creature has increased damage + additional skill
        // BOSS: creature has multiple modifiers and skills
        // SHARD_BOSS: creature has multiple modifiers, skills and activity
        //             stages 
        this.rank = rank;
        
        // the item array holds references to all items the creature currently
        // has equipped or (in case of characters) in its inventory (does not 
        // include the stash of the hero)
        // this is useful for e.g. calculate repair costs, repair all items
        // etc
        this.items = [];
        
        // set the base attributes
        _.each(data.attributes, function(value, key) {
        
            var levelMultiplier = 2;
        
            value = value + value * (this.level - 1) * levelMultiplier; 
        
            this.attr(key, value);
        
        }, this);
        
        // human creatures can carry equipment
        if (this.supertype == 'human') {
        
            this.equipment = new JRPG.Equipment(this);
        
            equipmentItems = JRPG.DropFactory.createEquipment(this);
            
            _.each(equipmentItems, this.equip);
        
        }
        
        // initialize dynamic values life/mana
        this.initCurrentAttributeValue('life');
        this.initCurrentAttributeValue('mana');
        
        // if the creature is not in the list of 'good' ones, it's an evil one
        this.isEvil = JRPG.goodCreatures.indexOf(this.type) == -1;
        
        // setup the creatures skills
        this.skills = [];
        
        if (data.skills) {
        
            _.each(data.skills, function(i) { 
            
                var skill = JRPG.Skills.get(i, this);
            
                this.skills.push(skill);
            
            }, this);    
        
        } 
    
    };
    
    this.creatureLoop = function(ticks) {
    
        this.movingObjectLoop(ticks);    
    
    };
    
    this.loop = function(ticks) {
    
        this.creatureLoop(ticks);
    
    };
    
    this.equip = function(item) {
    
        if (this.equipment) {
        
            this.items.push(item);
            this.equipment.equip(item);
        
        }    
    
    };
    
    this.getWeapon = function() {
    
        if (this.equipment) {
        
            return this.equipment.getWeapon();
        
        }
        
        return null;
    
    };
    
    if (type) {
    
        this.initCreature(type, name, level, rank);
    
    }

}
JRPG.Creature.prototype = new JRPG.MovingObject();

JRPG.Creature.Rank = {
    NORMAL: 0,
    CHAMPION: 1, 
    NAMED: 2, 
    BOSS: 3, 
    SHARD_BOSS: 4
};