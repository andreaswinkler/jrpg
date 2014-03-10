/*
** 2014/02/13
*/

JRPG.Skill = function(key, src, range, invoke, speed) {

    this.key = key;
    this.src = src;
    this.range = range;
    this.invoke = invoke;
    this.speed = speed || 0;

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
    
        return new JRPG.Skill('WeaponPrimary', src, 0, function(target) {
    
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
        
        });
    
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
        
        });
    
    }            

}