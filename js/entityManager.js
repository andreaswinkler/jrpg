"use strict";

(function() {

    if (typeof _ === 'undefined' && typeof require !== 'undefined') {
    
        var _ = require('../js/underscore/underscore.min.js');
    
    }

    var EntityManager = {

        index: 0, 

        blueprints: null, 
        
        status: {
            IDLE: 0,
            ATTACKING: 1
        }, 

        loop: function(e, ticks, stack) {

            // handle aggro stuff
            if (e.aggroRange) {
            
                this.aggro(e, stack);
            
            }

            // move stuff
            if (e.speed > 0 && e.target) {
                
                this.move(e, ticks);
            
            }
            
            // life per second
            if (e.lps > 0 && this.life_c < this.life) {
            
                this.life_c = Math.min(this.life_c + this.lps / 1000 * ticks, this.life);
            
            }
            
            // mana per second
            if (e.mps > 0 && this.mana_c < this.mana) {
            
                this.mana_c = Math.min(this.mana_c + this.mps / 1000 * ticks, this.mana);
            
            }
        
        },
        
        // handle aggro target
        aggro: function(e, stack) {
        
            var i;
        
            // we have an aggro target, let's check if we are still in range
            if (e.aggroTarget) {
            
                // we are out of range, let's forget about it
                if (!this.inRange(e, e.aggroTarget, e.aggroRange)) {
                
                    e.aggroTarget = null;    
                
                } 
            
            }
            
            // we don't have an aggro target, let's check if we can find one
            if (e.aggroTarget == null) {
                
                for (i = 0; i < stack.length; i++) {
                
                    if (stack[i].t == 'hero' && this.inRange(e, stack[i], e.aggroRange)) {
                    
                        e.aggroTarget = stack[i];
                        
                        break;
                    
                    }
                
                }        
            
            }
            
            // we have an aggro target and nothing else to do, 
            // let's try to attack it
            if (e.aggroTarget && e.status == this.status.IDLE) {

                this.attack(e, e.aggroTarget);
            
            }
        
        }, 
        
        attack: function(e, target, attack) {
        
            var attack = attack || this.selectAttack(e, target);

            // if we are in range, we attack the bastard
            if (attack && this.inRange(e, target, attack.range)) {
                
                e.status = this.status.ATTACKING;
                    
                // do attacking
            
            } 
            // otherwise we try to move closer (if we can move at all)
            else if (e.speed > 0) {
            
                this.moveTo(e, target.x, target.y);
            
            }    
        
        }, 
        
        selectAttack: function(e, target) {
        
            var distance = this.distance(e.x, e.y, target.x, target.y), 
                attacks = [], 
                i;
            
            for (i = 0; i < e.skills.length; i++) {
            
                if (e.skills[i].manaCost <= e.mana_c && 
                    distance <= e.skills[i].range) {
                    
                    attacks.push(e.skills[i]);    
                
                }
            
            }
            
            if (attacks.length > 0) {
            
                return attacks[0];
            
            }
            
            return null;
        
        }, 
        
        moveTo: function(e, x, y) {
        
            var distance = this.distance(e.x, e.y, x, y);
            
            e.target = { 
                x: x, 
                y: y, 
                dx: (x - e.x) / distance, 
                dy: (y - e.y) / distance 
            };

            this.updateRotation(e, x, y);
        
        }, 
        
        move: function(e, ticks) {
            
            // speed = 1 means 1px/ms
            var speed_c = e.speed * ticks / 10, 
                nx = (e.x + e.target.dx * speed_c),
                ny = (e.y + e.target.dy * speed_c);

            // let's try to update our position to the new coordinates
            if (this.updatePosition(e, nx, ny)) {
            
                // if we are in range of 50px of the target we stop
                if (this.inRange(e, e.target, 50)) {
                
                    e.target = null;
                
                }
                
            } 
            // we could not update our position, because we hit a wall or 
            // the end of the world or something
            else {
            
                e.target = null;
            
            }   
        
        },  

        refresh: function(e) {
        
            // calculate all dependend values
            e.life = (e.vit || 0) * 10;
            e.mana = (e.int || 0) * 5;
            
            e.life_c = Math.min(e.life_c || e.life, e.life);
            e.mana_c = Math.min(e.mana_c || e.mana, e.mana);
            
            this.refreshHitBox(e);
        
        },
        
        refreshHitBox: function(e) {
        
            e.hb[0] = parseInt(e.x - e.w / 2);
            e.hb[1] = parseInt(e.y - e.h);
            e.hb[2] = parseInt(e.x + e.w / 2);
            e.hb[3] = parseInt(e.y);
        
        }, 
        
        updatePosition: function(e, x, y) {
        
            // TODO: we need a check against the map here, if we 
            // can reach this position
        
            e.x = x;
            e.y = y;
            
            this.refreshHitBox(e);
            
            return true;
        
        }, 
        
        // updates the rotation attribute of the position component by 
        // calculating the vector between its position and given x/y coordinates
        updateRotation: function(e, x, y) {
        
            e.rotation = this.direction(e.x, e.y, x, y);
        
        },
        
        // check if the current position equals a given one
        atPosition: function(e, x, y) {
        
            return e.x == x && e.y == y;
        
        },  
        
        hitTest: function(e, x, y) {
        
            return e.hb[0] <= x && e.hb[2] >= x && e.hb[1] <= y && e.hb[3] >= y;    
        
        }, 
        
        // rect is [x, y, x2, y2]
        hitTestRect: function(e, rect) {
        
            return e.hb[0] < rect[2] && e.hb[2] > rect[0] && e.hb[1] < rect[3] && e.hb[3] > rect[1];    
        
        }, 
        
        distance: function(x, y, x2, y2) {
        
            return Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));  
        
        }, 
        
        direction: function(x, y, x2, y2) {
        
            var ax = (x2 - x) / this.distance(x, y, x2, y2);
            
            return y2 - y > 0 ? Math.cos(ax) - Math.PI : Math.acos(ax * -1);
        
        },
        
        inRange: function(e1, e2, range) {
        
            var found, i;
        
            if (e2 instanceof Array) {
            
                found = false;
            
                for (i = 0; i < e2.length; i++) {
                
                    if (this.inRange(e1, e2[i], range)) {
                    
                        found = true;
                        break;
                    
                    }
                
                }
                
                return found;
            
            }
        
            return this.distance(e1.x, e1.y, e2.x, e2.y) <= range;
        
        },

        create: function(type, settings) {
    
            var blueprint = this.blueprints[type],     
                e = {
                    id: ++this.index, 
                    t: settings.t || blueprint.t || '', 
                    n: settings.n || blueprint.n || '', 
                    w: settings.w || blueprint.w || 0, 
                    h: settings.h || blueprint.h || 0, 
                    x: 0, 
                    y: 0, 
                    z: 0,
                    hb: [0, 0, 0, 0],
                    r: 0,
                    speed: settings.speed || blueprint.speed || 0,
                    life: 0,
                    lps: settings.lps || blueprint.lps || 0,
                    mana: 0,
                    mps: settings.mps || blueprint.mps || 0,
                    xp: settings.xp || blueprint.xp || 0,
                    gold: settings.gold || blueprint.gold || 0,
                    vit: settings.vit || blueprint.vit || 0,
                    str: settings.str || blueprint.str || 0,
                    int: settings.int || blueprint.int || 0,
                    dex: settings.dex || blueprint.dex || 0,
                    aggroRange: blueprint.aggroRange || 0, 
                    skills: blueprint.skills || [],
                    aggroTarget: null, 
                    status: this.status.IDLE
                };
                
            if (blueprint.mirrorSprites) {
            
                e.mirrorSprites = true;
            
            }
            
            if (blueprint.textureRowDead != 'undefined') {
            
                e.textureRowDead = blueprint.textureRowDead;
            
            }
            
            this.refresh(e);
    
            return e;  
             
        },
        
        findAtPosition: function(stack, x, y) {
        
            var i;
            
            for (i = 0; i < stack.length; i++) {
            
                if (this.hitTest(stack[i], x, y)) {
                
                    return stack[i];
                
                }
            
            }
            
            return null;
        
        }, 
        
        processActions: function(actions, e, stack) {
        
            var i, target;
            
            for (i = 0; i < actions.length; i++) {
            
                switch (actions[i][0]) {
                
                    case 'moveTo':
                    
                        target = this.findAtPosition(actions[i][1], actions[i][2]);
                        // check if target is in range or an interactable
                        // etc.
                        
                        this.moveTo(e, actions[i][1], actions[i][2]);
                    
                        break;
                
                }
            
            }
        
        }
    
    };

    if (typeof module !== 'undefined') {
    
        module.exports = EntityManager;
    
    } else {
    
        window.EntityManager = EntityManager;
    
    }

}).call(this);