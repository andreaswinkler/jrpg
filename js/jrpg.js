var JRPG = {

    _id: 0, 

    DamageRank: {
        NORMAL: 0, 
        CRITICAL: 1, 
        CRUSHING_BLOW: 2
    },
    
    colors: {
        white: { hex: '#fff' },       
        grey: { hex: '#a3a3a3' }, 
        blue: { hex: '#00baff' },   
        yellow: { hex: '#f1ce0c' },   
        green: { hex: '#5eed1f' }, 
        orange: { hex: '#f2890c' }, 
        violet: { hex: '#ea0cf2' }
    }, 
    
    goodCreatures: ['hero', 'vendor', 'blacksmith', 'jeweller'], 

    version: 'alpha-1.0', 

    // the logged in user
    user: null, 

    // the current game if any
    game: null,
    
    // the timestamp of the last game loop
    tsLastLoop: null,
    
    lastCalcTime: 0,   

    // the request animation frame object
    rAF: window.requestAnimationFrame || 
         window.mozRequestAnimationFrame || 
         window.webkitRequestAnimationFrame || 
         window.msRequestAnimationFrame, 

    // returns a 'unique identifier' used to 
    // set the ids of creatures, bullets and items
    id: function() {
    
        this._id++;
        
        return this._id;    
    
    }, 
    
    colorByItemRank: function(item) {
        
        if (item instanceof JRPG.Gold) {
        
            return this.colors.yellow;
        
        }
        
        switch (item.rank) {
        
            // can be white or grey based on enhancements (sockets, etheral)
            case 0:
            
                if (item.isEtheral || item.hasSockets()) {
                
                    return this.colors.grey;
                
                } else {
                
                    return this.colors.white;
                
                }
              
                break;
            
            case 1:
            
                return this.colors.blue;
                
                break;
            
            case 2:
            
                return this.colors.yellow;
                
                break;                
        
        }
        
        return this.colors.white;
    
    }, 

    load: function() {
    
        var loadingBar = new JRPG.UI.ProgressBar();
        loadingBar.initProgressBar({ width: $(window).width(), showValue: false, total: 4 });
    
        console.log('JRPG version <' + this.version + '>');
  
        $('#content').append(loadingBar.e);

        _post('itemTypes.list', {}, function(data) {
        
            JRPG.Item.data = data;
            
            loadingBar.refresh(1, 4);
            
            _post('dropTables.list', {}, function(data) {
            
                JRPG.DropFactory.dropTables = data;
                
                loadingBar.refresh(2, 4);
            
                _post('objectData.load', {}, function(data) {
                
                    JRPG.Object.data = data;
                    
                    loadingBar.refresh(3, 4);

                    // TODO: load hero from somewhere
                    JRPG.hero = new JRPG.Character('hero', 'Hero', 1);
                    JRPG.hero.animation('move', new JRPG.Animation(JRPG.hero, 0, 0, 7, 'auto', true));
                    
                    /* lets give the hero a sword and shield to see
                    what happens */
                    JRPG.hero.equip(JRPG.DropFactory.createItem('smallsword', 1, 0, 0)); 
                    JRPG.hero.equip(JRPG.DropFactory.createItem('smallshield', 1, 0, 0));

                    // load all textures necessary to display the hero
                    // the hero will then be accessible via the 
                    // hero_complete texture
                    JRPG.Textures.character(JRPG.hero, function() {
                    
                        loadingBar.refresh(4, 4);
                    
                        if (JRPG.onLoad) {
                
                            JRPG.onLoad.call();
                        
                        }
                    
                    }, loadingBar);
                
                });
            
            });
        
        });
    
    }, 
    
    loop: function() {
    
        var ts = +new Date(), 
            ticks = ts - (this.tsLastLoop || +new Date());
    
        if (!this.game) {
        
            return;
        
        }
    
        if (ticks >= 33.33) {
        
            this.tsLastLoop = ts;
    
            this.game.loop(ticks);
        
            this.lastCalcTime = +new Date() - ts;
        
            JRPG.UI.refreshInfoBox();
        
            if (this.game.active) {
            
                this.rAF.call(window, $.proxy(this.loop, this));
            
            }
        
        } else {
        
            if (!this.tsLastLoop) {
            
                this.tsLastLoop = +new Date();
            
            }
        
            this.rAF.call(window, $.proxy(this.loop, this));    
        
        }
    
    }, 
    
    // restarts the game after the game was paused
    restartGame: function() {
    
        this.game.active = true;
    
        this.rAF.call(window, $.proxy(this.loop, this));
    
    }, 
    
    startGame: function() {
    
        // we should derive the map from somewhere (dropdown, hero)
        var mapId = 'baaaab';
        
         _post('map.load', { id: mapId }, $.proxy(function(t) {
         
            // load all map textures
            JRPG.Textures.map(t, $.proxy(function() {
         
                 JRPG.UI.init();
         
                // initialize a game with the newly loaded map
                this.game = new JRPG.Game(t); 
    
                this.loop();
            
            }, this));
         
         }, this));
    
    }, 
    
    leaveGame: function() {
    
        // save stuff
        this.game = null;
        
        JRPG.UI.module('startscreen');
    
    }, 

    setUser: function(user) {
    
        this.user = user;
        
        this.write('user', this.user);
    
    }, 

    isAuthenticated: function() {
    
        if (this.user == null) {
        
            this.user = this.read('user');

        }
        
        return this.user != null;
    
    }, 
    
    read: function(key) {
    
        try {
        
            return JSON.parse(localStorage.getItem('jrpg14_' + key));    
        
        } catch (ex) {
        
            console.error('Could not load <' + key + '> from local storage. ' + ex);
        
        }
        
        return null;
    
    }, 
    
    write: function(key, obj) {
    
        localStorage.setItem('jrpg14_' + key, JSON.stringify(obj));
    
    }

}

JRPG.Timer = function() {

    this.ts = 0;
    this.total = 0;
    
    this.reset = function() {
    
        this.ts = +new Date();
    
    };
    
    this.current = function() {
    
        return +new Date() - this.ts;
    
    };

}

JRPG.Enum = {

    getKey: function(enumeration, val) {
    
        for (var key in enumeration) {
        
            if (enumeration[key] == val) {
            
                return key;
            
            }
        
        }
        
        return '';
    
    }

}

function _log(s, timer) {

    if (timer) {
    
        s = '[' + timer.current() + ' ms] ' + s;
    
    }
    
    console.log(s);

}

function _dlg(e) {

    return $(e).parents('.dialog').get(0).ref;

}

function _post(key, data, success) {

    data.service = key;

    $.post('s.php?' + Math.random(), data, success, 'json').fail(function(t) { console.error('call <' + key + '> failed.'); console.dir(t); });

}

function _rot(x1, y1, x2, y2) {

    var d = _dist(x1, y1, x2, y2), 
        ax = (x2 - x1) / d;
        
    return y2 - y1 > 0 ? Math.acos(ax) - Math.PI : Math.acos(ax * -1);

}

function _dist(x1, y1, x2, y2) {

    if (x1 instanceof JRPG.Object) {
        x2 = y1.x;
        y2 = y1.y;
        y1 = x1.y;
        x1 = x1.x;
    }

    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));    

}

function _random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

function _randomPositionAround(x, y, maxDistance, minDistance) {

    var x2, y2, dist, cnt = 0;
    
    do {
    
        x2 = _random(x - maxDistance, x + maxDistance);
        y2 = _random(y - maxDistance, y + maxDistance);
        
        dist = _dist(x, y, x2, y2);
        
        cnt++;
    
    } while (cnt < 1000 && (dist > maxDistance || dist < minDistance));
    
    return { x: x2, y: y2 };

}

function _centroid(list) {

    var x = _.reduce(list, function(memo, i) { return memo + i.x }, 0), 
        y = _.reduce(list, function(memo, i) { return memo + i.y }, 0);
    
    return { x: x / list.length, y: y / list.length };

}

function _normalVector(x1, y1, x2, y2) {

    var d = _dist(x1, y1, x2, y2);

    if (d > 0) {
    
        return {
            x: (x2 - x1) / d, 
            y: (y2 - y1) / d
        }
    
    } else {
    
        return { x: 0, y: 0 };
    
    }    

}

function _radians(degrees) {

    return degrees * (Math.PI / 180);

}

function _degrees(radians) {

    return radians * (180 / Math.PI);

}

function _rgb2Int(r, g, b) {

    return ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);

}

function _int2Rgb(v) {

    return {
        red: v >> 16 & 0x0ff, 
        green: v >> 8 & 0x0ff, 
        blue: v & 0x0ff 
    };    

}

Array.prototype.remove = function(item) {

    for (var i = 0; i < this.length; i++) {
    
        if (this[i] == item) {
        
            this.splice(i, 1);
        
        }    
    
    }

}

Array.prototype.random = function(amount) {

    var amount = amount || 1, 
        items, notUsed;

    if (this.length > 0) {

        if (amount == 1) {
        
            return this[_.random(0, this.length - 1)];
        
        } else {
        
            items = [];
            notUsed = [];
        
            for (i = 0; i < this.length; i++) {
            
                notUsed[i] = this[i];
            
            }
        
            while (items.length < amount && notUsed.length > 0) {
            
                randomIndex = _.random(0, notUsed.length - 1);
                
                items = items.concat(notUsed.splice(randomIndex, 1));
            
            }
            
            return items;
        
        }
    
    }
    
    return null;

}