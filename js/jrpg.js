var JRPG = {

    version: 'alpha-1.1',
    
    socket: null, 
    
    // the logged in user
    user: null, 
    
    // the users character
    hero: null, 
    
    // the current map (including the stack)
    map: null, 

    // timestamp of last loop
    tsLastLoop: undefined,
    
    // holds the user inputs since the last game loop
    currentInputs: [],  
    
    // the request animation frame object
    rAF: window.requestAnimationFrame || 
         window.mozRequestAnimationFrame || 
         window.webkitRequestAnimationFrame || 
         window.msRequestAnimationFrame,  
    
    eGame: null,
    
    paused: false,  
    
    // the game loop
    loop: function() {
    
        var ts = +new Date(), 
            ticks = ts - (this.tsLastLoop || +new Date());
    
        if (ticks >= 16.6) {
        
            this.tsLastLoop = ts;
    
            if (!this.paused) {
            
                this.gameLoop(ticks);
            
            }
            
            this.rAF.call(window, function() { JRPG.loop(); });
        
        } else {
        
            if (!this.tsLastLoop) {
            
                this.tsLastLoop = +new Date();
            
            }
        
            this.rAF.call(window, function() { JRPG.loop(); });
        
        }
    
    },
    
    gameLoop: function(ticks) {
    
        // handle current inputs
        var actions = InputSystem.processInputs(this.currentInputs), 
            i;

        EntityManager.processActions(actions, JRPG.hero, JRPG.map.stack);

        // clear current inputs
        this.currentInputs = [];
        
        // call the loop method for all entities in the stack
        for (i = 0; i < this.map.stack.length; i++) {
        
            EntityManager.loop(this.map.stack[i], ticks, this.map.stack);
        
        }
        
        Renderer.update();
    
    }, 
    
    init: function() {
    
        JRPG.connect();        
    
        UI.init();
    
    },
    
    authenticate: function(devkey) {
    
        if (this.socket.socket.connected) {
    
            this.socket.emit('auth', { username: devkey, password: '' });
        
        } else {
        
            this.onConnectionError();
        
        }   
    
    }, 
    
    // start an arena game by passing in the selected
    // arenaId
    startArenaGame: function(arenaId) {
    
        this.socket.emit('startArenaGame', { arenaId: arenaId });
    
    }, 
    
    // join a public game
    joinPublicGame: function(gameId) {
    
        this.socket.emit('joinPublicGame', { gameId: gameId });
    
    }, 
    
    handleInput: function(key, shifted) {
    
        var input = InputSystem.input(key, shifted);
    
        this.currentInputs.push(input);
    
        this.socket.emit('input', input);
    
    }, 
    
    registerUserInputHandlers: function() {
    
        this.eGame.unbind().click($.proxy(function(ev) {
        
            this.handleInput(-2, ev.shiftKey);    
        
        }, this)).bind('contextmenu', $.proxy(function(ev) {
        
            this.handleInput(-1, ev.shiftKey);
            
            ev.preventDefault();
            
            return false;
        
        }, this)).mousemove($.proxy(function(ev) {
        
            InputSystem.mouseX = ev.pageX;
            InputSystem.mouseY = ev.pageY;
        
        }, this));
        
        $(document).keydown($.proxy(function(ev) {
        
            this.handleInput(ev.keyCode, ev.shiftKey);
        
        }, this)).keyup($.proxy(function(ev) {
        
            InputSystem.keyUp(ev.keyCode);
        
        }, this));
    
    }, 
    
    onConnectionError: function() {
    
        UI.loginScreen();
            
        UI.messageWindow('Could not establish connection to server. (Error: 0)');
        
        this.connect();    
    
    }, 
    
    // connect to the server
    connect: function() {
    
        this.eGame = $('#jrpg_game');
    
        Renderer.localRoot = { x: 0, y: 0 };
    
        console.log('Try to connect to server.');
    
        this.socket = io.connect('http://localhost:1337'); 
        
        this.socket.on('error', $.proxy(this.onConnectionError, this));
        
        // the server greeted us, let's authenticate
        this.socket.on('handshake', $.proxy(function(data) {
        
            console.log('Connected to JRPG Server <' + data.version + '>');
            
            UI.loginScreen();
        
        }, this));
        
        // we got an auth result
        // let's check if it was successful and if so, load the other
        // stuff
        this.socket.on('authResult', $.proxy(function(data) {
      
            UI.startScreen();
        
            JRPG.user = data.user;
            JRPG.hero = data.hero;

            EventManager.publish('arenasLoaded', this, data.arenas);
            
            this.socket.emit('publicGameList');
        
        }, this));
        
        // we got an error on authentication
        this.socket.on('authError', $.proxy(function(data) {
        
            UI.loginScreen();
            
            UI.messageWindow('Invalid username or password. (Error: 1)');
        
        }, this));
        
        this.socket.on('publicGameList', $.proxy(function(data) {
            
            console.log('public game list loaded');
            
            EventManager.publish('publicGameListLoaded', this, data);
            
        }, this));
        
        // we got disconnected from the server
        // let's try to reconnect
        this.socket.on('disconnect', function() {
        
            console.warn('Disconnected from JRPG Server. Try to reconnect.');
            
            setTimeout(JRPG.connect, 2000);
        
        });
        
        // the server sent us a new map object
        // we show a loading screen, set everything up and once we finished
        // we remove the loading screen and tell the server we want to play
        this.socket.on('map', $.proxy(function(map) {
        
            console.log('Map loaded. <' + map.name + '>');
        
            JRPG.map = map;
        
            EventManager.publish('map', this, map);
            
            // load all necessary textures
            TextureSystem.loadMapTextures(map, $.proxy(function() {
            
                // all necessary textures are available
                // let's setup minimap and the renderer
                Renderer.initMap(map);
                
                // the map is now pre-rendered and the minimap is setup
                // let's tell everyone we're finished
                EventManager.publish('mapSetup', this, map);    
                
                // let's tell the server we are ready to play
                this.socket.emit('ready');
                
                // let's register the event handlers
                this.registerUserInputHandlers();
                
                // start the game
                this.loop();
            
            }, this));   
        
        }, this)); 
        
        // the server sent us a new stack object
        // let's update ours
        this.socket.on('stack', $.proxy(function(stack) {
        
            console.log('Stack loaded. <' + stack.length + '>');
            
            this.updateStack(stack);
        
        }, this)); 
        
        this.socket.on('update', $.proxy(function(data) {
        
            var i, j;
            
            // we got a full stack update, let's update everything
            if (data.stack) {
            
                this.updateStack(data.stack);
            
            } else {
            
                /*for (i = 0; i < data.updates.length; i++) {
                
                    for (j = 0; j < this.map.stack.length; j++) {
                    
                        if (this.map.stack[j].id == data.updates[i].id) {
                        
                            this.map.stack[j].x = data.updates[i].x;
                            this.map.stack[j].y = data.updates[j].y;    
                        
                        }
                    
                    }
                
                }*/
            
            }
        
        }, this));   
    
    },
    
    entityById: function(id) {
    
        return _.find(this.map.stack, function(i) { return i.id == id; }, this);
    
    }, 
    
    updateStack: function(newStack) {
    
        // we can't just replace the stack because we would loose all
        // entity references (hero, aggroTarget, etc)
        _.each(newStack, function(i) {
        
            var e = this.entityById(i.id);
            
            if (e) {
            
                // we know the entity already, let's update it
                $.extend(e, i);
                
                if (e.id == JRPG.hero.id) {
                
                    JRPG.hero = e;
                
                }
            
            } else {
            
                // we don't know the entity yet, let's add it to the
                // stack
                this.map.stack.push(i);
            
            }
        
        }, this);
    
    }
    
}

/*

// TODO: load hero from somewhere
                    JRPG.hero = new JRPG.Character('hero', 'Hero', 1);
                    JRPG.hero.animation('move', new JRPG.Animation(JRPG.hero, 0, 0, 7, 'auto', true));
                    
                    ///lets give the hero a sword and shield to see
                    what happens //
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
                    
                    
    
        this.ePerfGameLoop = $('#jrpg_perf .gameloop');
    
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
*/


/*var JRPG = {

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
    
    YARD: 100, 
    
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
                    
                     lets give the hero a sword and shield to see
                    what happens 
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
            ticks = ts - (this.tsLastLoop || +new Date()), 
            timer;
    
        if (!this.game) {
        
            return;
        
        }
    
        if (ticks >= 25) {
        
            this.tsLastLoop = ts;
    
            timer = +new Date();
    
            this.game.loop(ticks);
            
            this.ePerfGameLoop.html(+new Date() - timer);
        
            this.lastCalcTime = +new Date() - ts;
        
            JRPG.UI.refreshInfoBox();
        
            if (this.game.active) {
            
                this.rAF.call(window, function() { JRPG.loop(); }); //this.rAF.apply(this, this.loop); //call(window, $.proxy(this.loop, this));
            
            }
        
        } else {
        
            if (!this.tsLastLoop) {
            
                this.tsLastLoop = +new Date();
            
            }
        
            this.rAF.call(window, function() { JRPG.loop(); });
        
        }
    
    }, 
    
    // restarts the game after the game was paused
    restartGame: function() {
    
        this.game.active = true;
    
        this.rAF.call(window, $.proxy(this.loop, this));
    
    }, 
    
    startGame: function() {
    
        this.ePerfGameLoop = $('#jrpg_perf .gameloop');
    
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

function _inRange(obj1, obj2, range) {

    return _dist(obj1.x, obj1.y, obj2.x, obj2.y) <= range;

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

function _randomPositionAwayFrom(x, y, avoidX, avoidY, minDistance, maxDistance) {

    var nv = _normalVector(avoidY, avoidY, x, y),
        distance = _dist(x, y, avoidX, avoidY),  
        newDistance = _random(minDistance, maxDistance), 
        diff = Math.max(0, newDistance - distance);
    
    return { 
        x: x + nv.x * diff, 
        y: y + nv.y * diff
    };    

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

}*/