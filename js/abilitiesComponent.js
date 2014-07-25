var AbilitiesComponent = function(entity, settings) {

    this._e = entity;
    
    this.abilities = [];
    
    this.speed = settings.speed || 0;
    
    this.active = null;
    
    this.use = function(index) {
    
        if (this.abilities.length > index && this.abilities[index] != null) {
        
            if (this.abilities[index].manaCost == 0 || this._e.ManaComponent.spend(this.abilities[index].manaCost)) {
            
                this.useAbility(this.abilities[index]);   
            
            }       
        
        }
    
    };
    
    this.useAbility = function(ability, target) {
        
        this.active = ability;
        
        AbilitiesComponent.abilities[ability.key](this._e, target, ability);
    
        ability.activeCooldown = ability.cooldown || 0; 
        
        this.active = null;
    
    };
    
    this.loop = function(ticks) {
    
        var abilities, ability;
    
        // handle cooldowns
        _.each(this.abilities, function(i) {
        
            if (i.activeCooldown > 0) {
            
                i.activeCooldown = Math.max(0, i.activeCooldown - ticks);
            
            }
        
        }, this);
    
        // an ability is in use, handle stuff like animations, timings, 
        // etc
        if (this.active) {
        
                
        
        } 
        // otherwise we try to use one
        else {
        
            // first we check if we have an aggro target
            if (this._e.AggroComponent && this._e.AggroComponent.target != null) {
            
                // we have a target, let's see what skills we have 
                // for the distance between us and our target
                // also we check if we can afford the abilitiy and 
                // the ability is not in cooldown
                abilities = _.filter(this.abilities, function(i) { 
                    
                    return i.activeCooldown == 0 &&  
                           i.range >= this._e.AggroComponent.distance && 
                           i.manaCost <= this._e.ManaComponent.current;  
                    
                }, this);
                
                ability = abilities.random();
                
                if (ability != null) {
                
                    this.useAbility(ability, this._e.AggroComponent.target);
                
                } 
            
            }

        }   
    
    }
    
    _.each(settings.abilities, function(i) {
    
        i.activeCooldown = 0;
    
        this.abilities.push(i);
    
    }, this);

}

AbilitiesComponent.abilities = {

    single_projectile: function(src, target, settings) {
    
        settings.DamageComponent.minimumDamage = src.DamageComponent.minimumDamage * settings.DamageComponent.multiplier || 1;
        settings.DamageComponent.maximumDamage = src.DamageComponent.maximumDamage * settings.DamageComponent.multiplier || 1;

        var p = EntityManager.createByType(settings.type, settings);
        
        p.MoveComponent.moveTo(target.x, target.y);          
    
    }

}