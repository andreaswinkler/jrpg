/*
** ABILITIES COMPONENT
**
** handles the use of all skills and abilities
*/
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
        
        // generally we can't move and use abilities at the same time
        if (this._e.MoveComponent) {
        
            this._e.MoveComponent.stop();
        
        }
        
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
                // to kill him from this distance
                abilities = _.filter(this.abilities, function(i) {
                
                    return i.range >= this._e.AggroComponent.distance;
                
                }, this);
                
                // we could attack from here
                if (abilities.length > 0) {
                
                    // let's find all the abilties we could actually use
                    // -> no coolodwn, effordable mana costs
                    abilities = _.filter(abilities, function(i) {
                    
                        return i.activeCooldown == 0 && 
                               i.manaCost <= this._e.ManaComponent.current;
                    
                    }, this);
                    
                    // let's get a random one
                    // TODO: choose this by using some brain
                    ability = abilities.random(); 
                    
                    if (ability != null) {
                    
                        this.useAbility(ability, this._e.AggroComponent.target);
                    
                    }               
                
                }
                // we are too far away, let's see if we could move close
                else {
                
                    if (this._e.MoveComponent) {
                    
                        this._e.MoveComponent.moveTo(this._e.AggroComponent.target.x, this._e.AggroComponent.target.y);
                    
                    }
                
                }
            
            }

        }   
    
    }
    
    _.each(settings.abilities, function(i) {
    
        i.activeCooldown = 0;
    
        this.abilities.push(i);
    
    }, this);

}

AbilitiesComponent.adjustDamage = function(settings, src) {

    settings.DamageComponent.minimumDamage = src.DamageComponent.minimumDamage * settings.DamageComponent.multiplier || 1;
    settings.DamageComponent.maximumDamage = src.DamageComponent.maximumDamage * settings.DamageComponent.multiplier || 1;        

}

AbilitiesComponent.abilities = {

    single_projectile: function(src, target, settings) {
    
        AbilitiesComponent.adjustDamage(settings, src);

        var p = EntityManager.createByType(settings.type, settings);
        
        p.updatePosition(src.x, src.y);
        
        console.log(src.toString() + ' launch single projectile on ' + src.x + '/' + src.y + ' -> ' + target.x + '/' + target.y);
        
        p.MoveComponent.moveTo(target.x, target.y);          
    
    }, 
    
    bash: function(src, target, settings) {
    
        target.HealthComponent.applyDamage(src, settings.DamageComponent.multiplier);    
    
    }

}