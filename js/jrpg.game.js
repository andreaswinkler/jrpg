/*
** 2014/02/17
*/
JRPG.Game = function(map) {

    // the current shard object
    this.shard = { village: { name: 'Skara Brae', mapId: 'caaaab' }, positions: { townportal: { x: 100, y: 100 } } }, 
    // the current map object
    this.map = null;
    // the current processed objects
    this.stack = [];
    // the disposed map cached
    this.cache = {};
    // a timer object
    this.timer = new JRPG.Timer();
    // is the game running?
    this.active = false;
    //
    this.requestMapSwitch = null;
    
    this.initGame = function(map) {
    
        this.timer.reset();
    
        this.initMap(map);
        
        _log('init game <' + map.name + '> complete', this.timer);
        
        _scenarioA();
    
    };
    
    this.stop = function() {
    
        this.active = false;
    
    };
    
    this.loop = function(ticks) {
    
        // a map switch was requested by a town portal or gate
        if (this.requestMapSwitch) {
        
            if (this.map.id != this.requestMapSwitch.newMapId) {
            
                // we stop the game loop
                this.stop();
                
                // we switch the map
                this.switchMap(this.requestMapSwitch.newMapId);
            
            } else {
            
                JRPG.hero.updatePosition(this.requestMapSwitch.x, this.requestMapSwitch.y);
            
            }
        
        } else {
    
            _.invoke(this.stack, 'loop', ticks);
            
            JRPG.UI.Minimap.update(JRPG.hero);
        
        }
    
    };
    
    /*
    ** our hero died, now we resurrect him and place him on the last
    ** known checkpoint
    */        
    this.resurrectHero = function() {
    
        // restore the hero to full health
        JRPG.hero.addLife();
        
        // restore the hero to full mana
        JRPG.hero.addMana();
        
        // reset the dead flag
        JRPG.hero.tsDeath = 0;
    
        // TODO: get the last known checkpoint
        JRPG.hero.updatePosition(0, 0);
    
    };
    
    /*
    ** removes aggro from all creatures
    **
    ** used e.g. in case of death of the hero or in case of
    ** a level switch            
    */
    this.clearAggroTargets = function() {
    
        _.each(this.stack, function(i) {
        
            i.aggroTarget = null;
        
        }, this);
    
    };    
    
    /*
    ** we initialize a map by setting the reference and by looping through
    ** all map objects to process them
    ** we also find the a position for the hero and put it on the stack        
    ** after the method has finished, the map is completely set up and 
    ** ready to render         
    */    
    this.initMap = function(map, oldMapId) {
    
        var position;
    
        // set the current map
        this.map = new JRPG.Map(map);
        
        // add each map item to the stack
        _.each(map.objects, this.processMapObject, this); 
        
        // place the hero
        this.initHeroPosition(oldMapId);
        
        this.active = true;
        
        // initialize minimap
        JRPG.UI.Minimap.initMinimap(this.map);
    
    };
    
    /*
    ** initialize the character position on a newly loaded map
    ** based on where the hero came from 
    *
    ** also adds the hero to the stack         
    */
    this.initHeroPosition = function(oldMapId) {
    
        var position;
    
        if (oldMapId) {
            
            // find the hero's position
            // if the hero comes from another map we try to find the 
            // defined landing position for this map
            position = _.find(this.map.positions, function(i) { return i.previousMapId == oldMapId });
            
        }
            
        // we couldn't find a position so far or this is our first map so let's
        // get the default position
        if (!position) {
        
            position = _.find(map.positions, function(i) { return i.isDefault; });
        
        }
        
        if (position) {
        
            JRPG.hero.updatePosition(position.x, position.y);
            
        } else {
        
            console.warn('No position found for hero.');
        
        } 
        
        // add the hero to the stack
        this.stack.push(JRPG.hero);
    
    }    
    
    /*
    ** load a map by id
    */    
    this.loadMap = function(mapId, oldMapId) {
    
         _post('map.load', { id: mapId }, $.proxy(function(t) {
         
            this.initMap(t, oldMapId);   
         
         }, this));
    
    };
    
    /*
    ** here we switch between maps
    ** e.g. the hero enters a dungeon, or we use a town- or surface-portal    
    */
    this.switchMap = function(newMapId) {
    
        var oldMapId, 
            newMap;
    
        // if we are on a map already we need to back that up
        if (this.map != null) {
        
            oldMapId = this.map.id;
        
            this.cache[this.map.id] = { 
                // we take the old map as it is
                map: this.map, 
                // we take the complete stack without the hero
                stack: _.filter(this.stack, function(i) { 
                    return i.type != 'hero'; }) 
            };
        
        }
        
        // we check if the new map id was already cached before
        if (this.cache[newMapId]) {
        
            this.newMap = this.cache[newMapId];
            this.stack = this.cache[newMapId];
            
            this.initHeroPosition(oldMapId);
            
            this.active = true;
        
        }
        // otherwise we load the map
        else {
        
            this.loadMap(newMapId, oldMapId);
        
        }
    
    };
    
    /*
    ** here we handle all valid map objects
    ** either we create a stack object based on the type or we 
    ** perform a special action (e.g. spawn a bunch of creatures)        
    */    
    this.processMapObject = function(obj) {
    
        switch (obj.type) {
        
            case 'chest':
            
                this.stack.push(new JRPG.Object(0, 'chest', 'Chest', this.map.level));
            
                break;
            
            case 'spawnpoint':
            
                var creatures = this.spawn(obj), 
                    i;
                
                this.stack = this.stack.concat(creatures);
                    
                break;
        
        }    
    
    };
    
    /*
    ** creates a bunch of creatures on a given spawn point
    **
    ** TODO: create champions/unique/bosses out of a spawnpoint, 
    **       create groups of enemies or mixed type sets, etc.           
    */    
    this.spawn = function(spawnPoint) {
    
        var creatures = [], 
            amount = spawnPoint.settings.amount, 
            type = spawnPoint.settings.type, 
            rank = JRPG.Creature.Rank.NORMAL,
            level = this.map.level,  
            creature, i;
        
        for (i = 0; i < amount; i++) {
        
            // create a creature from the calculated settings
            creature = new JRPG.Creature(type, JRPG.Object.data[type].name, level, rank);
            
            // position the creature at the spawn point
            // the creatures will spread on their own
            creature.updatePosition(spawnPoint.x, spawnPoint.y);
            
            // add the creature to the set
            creatures.push(creature);   
        
        }
        
        return creatures;
    
    };
    
    /*
    ** create a town portal next to the hero
    **
    ** channel this for 5 seconds
    ** don't do it if the hero is inside the village           
    */
    this.createTownPortal = function() {
    
        // first we check if the hero is not inside a safe zone (i.e. village)
        var tile = this.map.tileAtPosition(JRPG.hero.x, JRPG.hero.y);
        
        if (!tile.safeZone) {
        
            JRPG.hero.channel(5000, $.proxy(function() {
            
                // the hero has successfully channeled for 
                // 5 seconds, now we create a town portal object
                var townPortal = new JRPG.Object('townportal', 'Portal to ' + this.shard.village.name);
                
                // place the town portal next to the hero
                townPortal.updatePosition(JRPG.hero.x + 50, JRPG.hero.y - 50);
                
                townPortal.on('touch', $.proxy(function(ev) {
                
                    // remove the townportal
                    this.stack.remove(ev.caller);
                
                    this.moveHero(this.shard.village.mapId, this.shard.positions.townportal.x, this.shard.positions.townportal.y);
                
                }, this));
                
                // add the town portal to the stack so it appears
                // in the game
                this.stack.push(townPortal);
                
                _.find(this.stack, function(i) { return i.type == 'townportal' }).emit('touch');
                
            }, this), {});                    
        
        }
    
    };    
    
    /*
    ** move the hero to a different position and/or level
    */
    this.moveHero = function(mapId, x, y) {
    
        // we are already on the right map
        // so we just move the hero to the given position
        if (this.map.id == mapId) {
        
            JRPG.hero.updatePosition(x, y);    
        
        } 
        // otherwise we need to invoke a map switch
        else {
        
            this.requestMapSwitch = { newMapId: mapId, x: x, y: y };
        
        }        
    
    };
    
    /*
    ** perform a hit test
    ** take into account if the object to test is on side of the hero or
    ** the evil   
    */      
    this.hitTest = function(obj) {
    
        var hit = null;
    
        // if the object is on the dark side we check if it 
        // touched the hero and if so, return the hero
        if (obj.isEvil) {
        
            hit = JRPG.hero.hitBox.test(obj) ? JRPG.hero : null;
        
        } 
        // otherwise we test all evil objects and check their hitbox, 
        // we return the first hit
        else {
        
            hit = _.find(this.stack, function(i) { return i.isEvil && i.hitBox.test(obj); });    
        
        }
        
        return hit;
    
    };
    
    this.initGame(map);

}