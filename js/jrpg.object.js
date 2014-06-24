JRPG.SUPERTYPE = {
    LOOTABLE: 0,
    PROJECTILE: 1,
    ANIMAL: 2,
    HUMAN: 3,
    DEMON: 4
}

JRPG.Object = function(type, name, level) {
  
    // the unique identifier
    this.id = 0;
    // the name of the object
    this.name = '';
    // the objects supertype
    this.supertype = '';
    // the objects type
    this.type = '';
    // the position in global coordinates
    this.x = 0;
    this.y = 0;
    // the dimensions of the object
    this.width = 0;
    this.height = 0;
    // the objects rotation
    this.rotation = 0;
    // the objects level
    this.level = 0;
    // the objects attributes
    this.attributes = null;
    // objects spawned by this object
    this.children = null;
    // changing values like life, mana
    this.currentAttributeValues = null;
    // the time of death
    this.tsDeath = 0;
    // the attack target
    this.aggroTarget = null;
    // the owner of this object if any
    this.owner = null;
    // a flag if the object is on the dark side
    // only creatures are evil, chest etc aren't (except for 
    // evil chests of course)
    this.isEvil = false;
    // the hitbox of the object
    this.hitBox = null;
    // behaviors of the object
    this.behaviors = null;
    // animations of the object
    this.animations = null;
    
    this.initObject = function(type, name, level) {
    
        var data = JRPG.Object.data[type] || {};
    
        this.initEventHandler();
    
        this.id = JRPG.id();
        
        this.type = type;
        this.name = name;
        this.level = level || 0;
        
        this.supertype = JRPG.Object.getSupertype(type);
        
        this.attributes = {};
        this.children = [];
        
        this.currentAttributeValues = {};
        
        this.width = data.width || 0;
        this.height = data.height || 0;
        
        this.hitBox = new JRPG.HitBox(this);
        
        this.behaviors = {};
        
        this.animations = {};

    };
    
    this.animate = function(key, callback, data) {
    
        var animation = this.animation(key);

        if (animation) {

            animation.tsStart = +new Date();
            animation.callback = callback;
            animation.data = data;
        
        } else if (callback) {
        
            callback.apply(data);
        
        }
    
    };
    
    this.stopAnimation = function(key) {
    
        var animation = this.animation(key);
        
        if (animation) {
        
            animation.tsStart = -1;
        
        }
    
    };
    
    this.animation = function(key, value, callback, data) {
    
        if (value != undefined) {
        
            this.animations[key] = value;
            
            if (key == 'now') {
            
                this.animations.now.tsStart = +new Date();
                this.animations.now.callback = callback;
                this.animations.now.data = data;
            
            }
        
        } else if (key != undefined) {
        
            return this.animations[key];
        
        } else {
    
            return _.find(this.animations, function(i) { return i.tsStart > -1; });
        
        }
    
    };
    
    this.removeBehavior = function(event) {
    
        this.behaviors[event] = null;
    
    };
    
    this.behavior = function(event, value) {
    
        if (value == undefined) {
        
            return this.behaviors[event];
        
        } else {
        
            this.behaviors[event] = value;
        
        }
    
    };
    
    this.initCurrentAttributeValue = function(key) {
    
        this.currentAttributeValues[key] = this.attr(key);
    
    };
    
    this.changeCurrentAttributeValue = function(key, amount) {
    
        if (amount < 0) {
        
            this.attr(key + '-current', Math.max(0, this.attr(key + '-current') + amount));
        
        } else {
        
            this.attr(key + '-current', Math.min(this.attr(key), this.attr(key + '-current') + amount));
        
        }
    
    };
    
    this.addLife = function(amount) {
    
        var amount = amount || this.attr('life');
    
        this.changeCurrentAttributeValue('life', amount);
    
    };
    
    /*
    ** remove life
    *
    ** returns true if the object was killed the amount of life lost        
    */    
    this.removeLife = function(amount, src) {
        
        this.changeCurrentAttributeValue('life', amount * -1);
        
        if (this.attr('life-current') == 0) {
        
            this.die(src);
            
            return true;
        
        }
        
        return false;
    
    };
    
    this.addMana = function(amount) {
    
        var amount = amount || this.attr('mana');
    
        this.changeCurrentAttributeValue('mana', amount);    
    
    };
    
    this.removeMana = function(amount) {
    
        this.changeCurrentAttributeValue('mana', amount * -1);
    
    };
    
    /*
    ** kill the object 
    */    
    this.die = function(src) {
    
        this.tsDeath = +new Date();
        
        this.emit('death', { src: src });
    
    };
    
    this.loop = function(ticks) {
    
        if (!this.isDead()) {
        
            this.objectLoop(ticks);
        
        }
    
    };
    
    this.isDead = function() {
    
        var ts = +new Date();
        
        if (this.tsDeath > 0) {
        
            if (ts - this.tsDeath > 10000) {
        
                this.remove();
                
            }    
            
            return true;
        
        }
        
        return false;
    
    }
        
    /*
    ** handle everything a static object does in a single frame
    */    
    this.objectLoop = function(ticks) {
    
        var ts = +new Date(),
            attack;
    
        if (this.channeling) {
        
            if (ts - this.channeling.ts >= this.channeling.duration) {
            
                this.channeling.func(this.channeling.data);
                
                this.channeling = null;
            
            }
        
        }
        
        if (this.attacking) {
        
            // half the attack time has passed
            // now we either attack or close the attack
            if (ts - this.attacking.ts >= this.attacking.duration) {
            
                // prior to attacking
                if (this.attacking.state == 0) {
                
                    this.attacking.ts = ts;
                    
                    this.attacking.data.attack.invoke(this.attacking.data.target);
                    
                    this.attacking.state = 1;
                
                } 
                // we attacked already
                else {
                
                    this.attacking = null;    
                
                }    
            
            }    
        
        } 
        // we are evil creatures, let's try to kill something
        else if (this.isEvil) {
        
            // we don't have a target yet, let's check if we see
            // the hero
            if (this.aggroTarget == null) {
            
                // check the distance between us and the hero
                if (_dist(this, JRPG.hero) < this.attr('aggroRange')) {
                
                    this.aggroTarget = JRPG.hero;
                
                }    
            
            }
            
            // ok, we have a target, let's see if we can attack it
            // or if we have to move towards it
            if (this.aggroTarget) {
            
                attack = this.chooseAttack();
                
                if (this.targetInRange(attack)) {
                
                    this.attack(this.aggroTarget, attack);    
                
                } else {
                
                    this.approachTarget();
                
                }    
            
            }               
        
        }
        
        _.invoke(this.children, 'loop', ticks);
    
    };
    
    /*
    ** use a skill
    */    
    this.useSkill = function(skill, target) {

        skill.invoke(target);
    
    };
    
    /*
    ** place the object on a specific position
    */    
    this.updatePosition = function(x, y) {
    
        this.x = x;
        this.y = y;
        
        this.hitBox.refresh();
    
    };
    
    /*
    ** checks if a target is within the range of 
    ** the selected attack    
    */
    this.targetInRange = function(attack) {

        return _dist(this, this.aggroTarget) < attack.range;
    
    };    
    
    /*
    ** a target was found and now we check if it's close enough
    ** to be attacked    
    */    
    this.approachTarget = function() {
    
        // we can't move so we don't
    
    };  
    
    /*
    ** returns a damage value based on min/max damage, equipped items, 
    ** chance for critical hits and crushing blow    
    */    
    this.damage = function() {
    
        var damage = {
              damage: 0, 
              rank: JRPG.DamageRank.NORMAL, 
              src: this
            }, 
            dmg = this.randomDamage(), 
            critChance = this.attr('critChance') / 100, 
            crushingBlowChance = this.attr('crushingBlow') / 100,  
            r = Math.random();
        
        if (r <= crushingBlowChance) {
        
            damage.rank = JRPG.DamageRank.CRUSHING_BLOW;
        
        } else if (r <= critChance) {
        
            damage.rank = JRPG.DamageRank.CRITICAL;
            
            dmg += dmg * (this.attr('critDmg') / 100);
        
        }
        
        damage.damage = dmg;
        
        return damage;        

    };
    
    /*
    ** returns a damage value based on min/max damage and strength value
    */
    this.randomDamage = function() {
    
        var dmg = _.random(this.attr('minDmg'), this.attr('maxDmg'));
        
        return dmg + dmg * this.attr('str') / 100;
    
    };
    
    /*
    ** returns the average damage based on min/max damage and strength value
    */
    this.averageDamage = function() {
    
        var dmg = (this.attr('minDmg') + this.attr('maxDmg')) / 2;
        
        return dmg + dmg * this.attr('str') / 100;
    
    }
    
    /*
    ** returns the average damage per second
    */
    this.dps = function() {
    
        var dmg = this.averageDamage(), 
            critChance = this.attr('critChance') / 100,
            critDmg = dmg * (this.attr('critDmg') / 100), 
            attackSpeed = this.attr('attackSpeed');
            
        return (dmg + (attackSpeed * (critChance) * critDmg)) * attackSpeed;
    
    };    
    
    /*
    ** applies damage to this creature
    */ 
    this.receiveDamage = function(damage) {
    
        var result = {
                damage: 0, 
                lethal: false, 
                dodged: false
            }, 
            dmg = damage.damage, 
            r = Math.random();
        
        // apply dodge chance
        if (r <= this.attr('dodgeChance')) {
        
            result.dodged = true;
            
            JRPG.Renderer.write('dodged', 'dodged', this);
        
        } 
        // the damage was not dodged
        else {
        
            // crushing blow damage is always 25% of 
            // the creature's life
            if (damage.rank == JRPG.DamageRank.CRUSHING_BLOW) {
            
                dmg = this.attr('life-current') * 0.25;    
            
            }
            
            // apply reduction by armor
            dmg -= this.attr('armor');
            
            result.damage = dmg;
            
            if (this.removeLife(dmg, damage.src)) {
            
                result.lethal = true;
            
            } 
            
            JRPG.Renderer.write('damage-' + damage.rank, result.damage.toFixed(1), this);
        
        } 
        
        return result;     
    
    };   
    
    /*
    ** returns the display name of the object or creature
    ** the display name is shown when the object is hovered over          
    */    
    this.displayName = function() {
    
        return this.name;
    
    };
    
    /*
    ** get or set an attribute
    */    
    this.attr = function(key, value) {
    
        if (key == 'dps') {
        
            return this.dps();
        
        }
    
        // the value is not set so we want to GET the value
        if (value == undefined) {
        
            // first let's check if we're asked for the current value of the
            // attribute
            if (key.indexOf('-current') != -1) {
            
                return this.currentAttributeValues[key.replace(/\-current/, '')] || 0;     
            
            }
        
            // the base value for the given attribute kan be derived 
            // either from the attributes set or directly from the object 
            // (e.g. speed); otherwise its set to 0
            var value = this.attributes[key] || this[key] || 0;
            
            // if we have equipment we check all equipped items if they
            // modify this attribute
            if (this.equipment) {
            
                value = this.equipment.attr(key, value);
            
            }
                        
            // some attributes are getting applied a special modifier
            switch (key) {
            
                // the value of 'life' is multiplied by 10% of the amount
                // of vitality the creature has
                case 'life':
                
                    value += value * this.attr('vit') / 10;
                
                    break;
                
                // the value of 'mana' is multiplied by 2.5% of the amount
                // of intelligence/focus the creature has
                case 'mana':
                
                    value += value * this.attr('int') / 25;
                    
                    break; 
                
                // the attack speed is calculated from the weapon and 
                // improved by ias
                case 'attackSpeed':
                
                    value += (value / 100 * this.attr('ias')); 
                
                    break;
            
            }
            
            return value;
        
        } 
        // we have a value, let's SET the attribute to this value
        else {
        
            // first let's check if we're asked to set the current value
            // of the attribute
            if (key.indexOf('-current') != -1) {
  
                this.currentAttributeValues[key.replace(/\-current/, '')] = value;  
            
            } else {
        
                this.attributes[key] = value;
            
            }
            
            this.emit('attributeChanged', { key: key, value: value });
            this.emit('attributeChanged_' + key, { value: value });
        
        }    
    
    };
    
    /*
    ** channel an action
    */    
    this.channel = function(duration, func, data) {
    
        this.channeling = { 
            ts: +new Date(), 
            duration: duration, 
            func: func, 
            data: data 
        };
    
    };
    
    /*
    ** validate if we can perform an attack    
    */
    this.canAttack = function() {
    
        return !this.channeling && !this.attacking;
    
    };    
    
    /*
    ** perform an attack
    ** handle channeling, delay, etc    
    */
    this.attack = function(target, attack) {
    
        var data = { target: target, attack: attack };
    
        if (this.canAttack()) {
    
            this.stop();
    
            var channelDuration = data.channelDuration || 0, 
                attackSpeed;
        
            if (channelDuration) {
            
                data.channelDuration = 0;
            
                this.channel(channelDuration, $.proxy(this.attack, this), data);
            
            } else {
            
                attackSpeed = this.attr('attackSpeed');

                // if we don't have an attack speed we probably don't have 
                // a weapon -> so: bad luck
                if (attackSpeed > 0) {
            
                    this.attacking = {
                        ts: +new Date(), 
                        state: 0, 
                        data: data, 
                        // this is half the attack duration
                        // attack speed is in attacks per second
                        duration: 1000 / attackSpeed / 2                            
                    }; 
                
                }
            
            } 
        
        }       
    
    };
    
    /*
    ** choose from our attack options
    **
    ** creatures can always use their main attack (mostly bash) but
    ** can also decide to use a skilled attack (e.g. ranged, aoe, etc) 
    ** if they have enough mana                
    */    
    this.chooseAttack = function() {
    
        // TODO: validate options and stuff
        return this.skills.random();
    
    };  
    
    this.stop = function() {
    
        this.channeling = null;
    
    };
    
    /*
    ** remove an object either from the game stack or from 
    ** its parent    
    */      
    this.remove = function() {
    
        if (this.owner) {
        
            this.owner.children.remove(this);
        
        } else {
        
            JRPG.game.stack.remove(this);
        
        }
    
    };
    
    /*
    ** determines if the object an be used by clicking on it
    */
    this.canBeUsed = function() {
    
        return this.behavior('click') != undefined;    
    
    }; 
    
    /*
    ** uses the object
    */       
    this.use = function(src) {
    
        var behavior = this.behavior('click');
        
        if (behavior) {
        
            behavior(this, src);        
        
        }
    
    };
    
    if (type) {
    
        this.initObject(type, name, level);
    
    }  

}
JRPG.Object.prototype = new JRPG.EventHandler();

JRPG.Object.types = {
    lootable: ['chest', 'grandchest'],
    projectile: ['fireball'],  
    animal: ['spider'],
    human: ['hero', 'swordsman', 'priest', 'rogue'], 
    demon: ['spirit']
}

JRPG.Object.getSupertype = function(type) {
    
    for (var supertype in JRPG.Object.types) {
    
        if (_.contains(JRPG.Object.types[supertype], type)) {
        
            return supertype;
        
        }
    
    }
    
    return undefined;

}