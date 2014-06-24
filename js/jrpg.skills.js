/*
** 2014/02/13
*/

JRPG.Skill = function(key, src, range, invoke, speed, cooldown) {

    this._invoke = invoke;

    this.key = key;
    this.src = src;
    this.range = range;
    this.speed = speed || 0;
    
    // cooldown can be a value in ms or the string 'attackSpeed'
    this.cooldown = cooldown || 0;
    this.ts = 0;
    
    /*
    ** invokes the skill if ready
    */    
    this.invoke = function() {
    
        if (this.cooldownStatus() == 1) {
        
            this.ts = +new Date();
            
            this._invoke.apply(this, arguments);
        
        } 
    
    };
    
    /* 
    ** returns the current cooldown status of this skill
    ** range between 0 (not cooldowned/not available) and 1 (fully cooldowned/available)
    */    
    this.cooldownStatus = function() {
      
        var cooldown;
        
        if (this.cooldown == 'attackSpeed') {
        
            cooldown = this.src.attr('attackSpeed') * 1000;
        
        } else {
        
            cooldown = this.cooldown;
        
        }
    
        return cooldown == 0 ? 1 : Math.min(1, (+new Date() - this.ts) / cooldown); 
    
    };
    
    /*
    ** resets the cooldown
    */
    this.resetCooldown = function() {
    
        this.ts = 0;
    
    }

}; 

JRPG.Skills = {

    MasteryType: {
        NONE: 0,
        MELEE: 1,  
        RANGED: 2, 
        MAGIC: 3        
    }, 

    skillLog: [], 

    log: function(skill, src, target, damage, result) {
    
        var id = this.skillLog.length;
    
        this.skillLog.push({
            id: id,
            skill: skill,    
            src: src.name, 
            target: target.name, 
            damage: damage, 
            result: result, 
            ts: +new Date(), 
        });
        
        // remove
        JRPG.UI.log('attack', src.name + ' attacks ' + target.name + ' for ' + damage.damage + ' damage' + (damage.rank == 1 ? ' (critical)' : (damage.rank == 2 ? ' (crushing blow)' : '')));
        
        return id;
    
    }, 
    
    /*
    ** apply damage from a given source to a given target 
    ** and log that action
    **
    ** the damage value is calculated from the source 
    ** and the result holds the actual damage that was received
    ** by the target and if the damage was lethal                    
    */    
    applyDamage: function(type, src, target) {
    
        var damage = src.damage(), 
            result = target.receiveDamage(damage);
        
        // masteries
        // mastery is only increased if there was actually damage applied
        // TODO: calculate some meaningful xp value
        if (src.type == 'hero' && result.damage > 0) {
        
            switch (type) {
            
                case 'bash':
                    src.addMasteryXp('melee', 1);
                    break;
                
                case 'fireball':
                    src.addMasteryXp('ranged', 1);
                    break;
                
                case 'arrow':
                    src.addMasteryXp('magic', 1);
                    break;
            
            }
        
        }
             
        JRPG.Skills.log(type, src, target, damage, result);    
    
    }, 

    /*
    ** returns a skill
    */    
    get: function(type, src) {
    
        return this[type](src);
    
    }, 

    /*
    ** bash performs a single hit against a given target
    ** the damage is calculated by the src    
    */    
    bash: function(src) {
    
        return new JRPG.Skill('Bash', src, 75, function(target) {
    
            JRPG.Skills.applyDamage('bash', this.src, target);
        
        });
   
   },
   
   /*
   ** needle sends a projectile against the given target
   */
   needle: function(src) {
   
      return new JRPG.Skill('Needle', src, 500, function(target) {
      
          var projectile = new JRPG.Projectile('needle', this.src, target, this.speed, this.range, 40, 5);
          
          this.src.children.push(projectile);
      
      }, 0.5);
   
   },      
    
    /*
    ** fireball sends a projectile towards the target, 
    ** the attack is logged once the fireball hits its target    
    */ 
    fireball: function(src) {
    
        return new JRPG.Skill('Fireball', src, 1000, function(target) {
    
            var projectile = new JRPG.Projectile('fireball', this.src, target, this.speed, this.range);
            
            this.src.children.push(projectile);
        
        }, 0.5);
    
    },
    
    /*
    ** 
    */
    nova: function(src) {
    
        return new JRPG.Skill('Nova', src, 100, function(target) {
        
            // launch nova
        
        });
    
    },       
    
    /*
    ** primary weapon skill
    */
    weaponPrimary: function(src) {
    
        return new JRPG.Skill('WeaponPrimary', src, 50, function(target) {
    
            var weapon = this.src.getWeapon();
            
            if (weapon) {
            
                switch (weapon.baseType) {
                
                    case 'bt_bow':
                    
                        var projectile = new JRPG.Projectile('arrow', this.src, target, 0.5, 2000);
                        
                        this.src.children.push(projectile);
                    
                        break;
                    
                    default:
                    
                        JRPG.Skills.applyDamage('weapon_' + weapon.type, this.src, target);
                    
                        break;
                
                }
            
            }
        
        }, 0, 'attackSpeed');
    
    }, 
    
    /*
    ** secondary weapon skill
    */ 
    weaponSecondary: function(src) {
    
        return new JRPG.Skill('WeaponSecondary', src, 0, function(src, target) {
    
            var weapon = this.src.getWeapon();
            
            if (weapon) {
            
                switch (weapon.baseType) {
                
                    case 'bt_bow':
                    
                        var projectile = new JRPG.Projectile('arrow', this.src, target, 0.5, 2000);
                        
                        this.src.children.push(projectile);
                    
                        break;
                    
                    default:
                    
                        JRPG.Skills.applyDamage('weapon_' + weapon.type, this.src, target);
                    
                        break;
                
                }    
            
            }
        
        }, 0, 'attackSpeed');
    
    }            

}