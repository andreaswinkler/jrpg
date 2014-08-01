/*
** Entity manager class
** composes entities, retrieves components for given entities
*/
var EntityManager = {

    // private members
    _hero: null, 

    // all the blueprints
    blueprints: null, 

    // all currently active entities (within the current map)
    stack: [],
    
    currentId: 0, 
    
    // the order the components are asked during the entity loop
    entityLoopComponents: ['HealthComponent', 'ManaComponent', 'MoveComponent', 'AggroComponent', 'AbilitiesComponent', 'HitTestComponent'], 
    
    create: function(blueprint) {
    
        console.log('EntityManager.create <' + blueprint.type + '>');
    
        var e = new Entity(blueprint);
        
        _.each(blueprint, function(value, key) {
            
            if (key.indexOf('Component') !== -1) {

                e[key] = new window[key](e, value);
            
            }
        
        }, this);
    
        this.stack.push(e);
        
        e._id = ++this.currentId;
        
        // set the entities flags
        // creature?
        if (e.HealthComponent && e.type != 'hero') {
        
            e.isCreature = true;
        
        }
        
        EventManager.subscribe(e, 'entityDestroyed', function(ev) {
        
            // this was the last enemy
            if (this.stack.filter(function(i) { return i.isCreature; }).length < 2) {
            
                EventManager.publish('lastCreatureKilled', this);
            
            }
        
        }, this);
        
        EventManager.publish('entityCreated', this, { newEntity: e });
        
        return e;
    
    }, 
    
    createHero: function(data) {
    
        var hero = this.create({ 
            type: 'hero', 
            name: 'The Hero',
            superType: 'hero',
            width: 300,
            height: 300,   
            MoveComponent: {
                speed: data.speed
            }, 
            HealthComponent: {
                total: data.vitality * 10, 
                lifePerSecond: 1 + data.vitality / 100
            },
            LevelComponent: {
                experience: data.experience
            },
            ManaComponent: {
                total: data.intelligence * 2, 
                manaPerSecond: 1 + data.intelligence / 10
            }, 
            GoldComponent: { 
                amount: data.gold 
            }, 
            InventoryComponent: { 
                inventories: { 
                    main: { 
                        width: 16, 
                        height: 10 
                    }, 
                    stash0: { 
                        width: 16, 
                        height: 16 
                    } 
                } 
            },
            EquipmentComponent: {
                
            }, 
            StatsComponent: { 
                vitality: 5, 
                strength: 4, 
                dexterity: 3, 
                intelligence: 2 
            },
            DamageComponent: {
            
            }, 
            RenderComponent: {
                useMirroredSprites: true, 
                drawHitArea: false, 
                textureRowDead: 5
            },
            AbilitiesComponent: { }
        }); 
        
        hero.refresh();
        
        hero.EquipmentComponent.equip(DropSystem.createItem('smallsword', 1, 0, 0, 0));
        
        hero.refresh();
    
    }, 
    
    // lazy-load the hero from the stack
    hero: function() {
    
        if (!this._hero) {
        
            this._hero = _.find(this.stack, function(i) { return i.type == 'hero' });
        
        }  
        
        return this._hero;  
    
    }, 
    
    // returns the current stack without the hero
    suspendStack: function() {
    
        return this.stack.filter(function(i) { return i.type != 'hero'; });
    
    }, 
    
    loadSuspendedStack: function(stack) {
    
        // get the hero from the active stack
        var hero = this.hero();
        
        // replace the stack with the new one
        this.stack = stack;
        
        // add the hero to the new stack
        this.stack.push(hero);
    
    }, 
    
    loadStackFromMap: function(list) {
    
        _.each(list, function(i) {

            switch (i.type) {
            
                case 'spawnpoint':
                
                    this.spawnEntities(i, i.settings);
                    
                    break;
            
                default:
                
                    this.createByType(i.settings.type, i.settings);

                    break;
            
            }        
        
        }, this);
    
    }, 
    
    createByType: function(type, settings) {
    
        return this.create(this.loadModifiedBlueprint(type, settings));
    
    },
    
    loadModifiedBlueprint: function(type, settings) {
    
        var blueprint = $.extend(this.blueprints[type], settings);
        
        return blueprint;    
    
    }, 
    
    // spawn some creatures based on modified blueprint
    spawnEntities: function(spawnPoint, settings) {
    
        var blueprint = this.loadModifiedBlueprint(settings.type, settings),
            i;
        
        blueprint.x = spawnPoint.x;
        blueprint.y = spawnPoint.y;
        
        for (i = 0; i < settings.amount; i++) {

            this.create(blueprint);
        
        }            
    
    },
    
    getAggroTargets: function(srcType) {
    
        return _.filter(this.stack, function(i) { return i.type == 'hero' && i.HealthComponent.tsDeath == undefined; });
    
    }, 
    
    // process all entities each frame
    loop: function(ticks) {
    
        _.each(this.stack, function(i) {
        
            _.each(this.entityLoopComponents, function(c) {
            
                if (i[c]) {
                
                    i[c].loop(ticks);
                
                }
            
            }, this);
        
        }, this);
    
    }, 
    
    // HELPER
    printStack: function() {
    
        console.log('--------------S-T-A-C-K--------------');
    
        _.each(this.stack, function(i) {
        
            console.log(i.toString());
        
        }, this);
        
        console.log('-------------------------------------');
    
    }

}