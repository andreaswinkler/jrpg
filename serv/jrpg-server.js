"use strict";

module.exports = {

    _em: require('../js/entityManager.js'),
    _is: require('../js/inputSystem.js'),

    version: '1.0',
    
    games: [],
    
    gamesSequenceNo: 0, 
    
    players: [], 
    
    arenas: [
        { id: 1, name: 'arena1', mapId: 'caaaab' }
    ],
    
    tsLastLoop: 0, 
    
    msFrame: 1000, 
    
    msUpdate: 2000,
    
    msDisconnect: 2000,   
    
    gameById: function(gameId) {
    
        var i;
        
        for (i = 0; i < this.games.length; i++) {
        
            if (this.games[i].id == gameId) {
            
                return this.games[i];
            
            }
        
        }
        
        return null;    
    
    },
    
    joinGame: function(gameId, player) {
    
        var game = this.gameById(gameId); 
        
        if (game) {
        
            game.maps[0].players.push(player);
        
        }   
        
        return game;
    
    }, 
    
    closePlayerGames: function(player) {
    
        var i, j, k, playerCount = 0;
        
        player.socket.game = null;
        player.socket.map = null;
        
        for (i = 0; i < this.games.length; i++) {
        
            for (j = 0; j < this.games[i].maps.length; j++) {
            
                for (k = 0; k < this.games[i].maps[j].players.length; k++) {
                
                    if (this.games[i].maps[j].players[k] == player) {
                
                        this.games[i].maps[j].players.splice(k, 1);
                        break;
                    
                    }    
                
                }
                
                playerCount += this.games[i].maps[j].players.length;
            
            }
            
            if (playerCount == 0) {
            
                this.games.splice(i, 1);
            
            }
        
        }
    
    }, 
    
    publicGameList: function(player) {
    
        var i, j, k, list = [], playerFound, playerCount;
        
        for (i = 0; i < this.games.length; i++) {
        
            playerFound = false;
            playerCount = 0;
        
            for (j = 0; j < this.games[i].maps.length; j++) {
            
                for (k = 0; k < this.games[i].maps[j].players.length; k++) {
                
                    if (this.games[i].maps[j].players[k] == player) { 
                    
                        playerFound = true;
                    
                    } 
                    
                    playerCount += this.games[i].maps[j].players.length;  
                
                }
            
            }
        
            if (!playerFound) {
                
                list.push({ id: this.games[i].id, name: this.games[i].name, playerCount: playerCount });
                
            }
        
        }
        
        return list;
    
    }, 
    
    loop: function() {
    
        var ts = +new Date(), 
            i, j, ctx = this;
    
        if (this.tsLastLoop + this.msFrame < ts) {
        
            this.tsLastLoop = ts;
            
            for (i = 0; i < this.games.length; i++) {
            
                if (this.games[i].running) {
                
                    this.gameLoop(this.games[i], ts - this.games[i].tsLastLoop);
                    
                    this.games[i].tsLastLoop = ts;
                
                }
            
            }
            
            for (i = 0; i < this.players.length; i++) {
            
                // check if player was disconnected too long ago
                if (this.players[i].socket.tsDisconnect != -1 && ts - this.players[i].socket.tsDisconnect > this.msDisconnect) {
                    
                    this.closePlayerGames(this.players[i]);
                    
                    this.players.splice(i, 1);
                    
                    i--;
                    
                }
            
            }
        
        } 
        
        if (ts < this.tsLastLoop + this.msFrame - 16) {
    
            setTimeout(function() { ctx.loop(); });
        
        } else {
            
            setTimeout(function() { ctx.loop(); });
        
        }
    
    }, 
    
    gameLoop: function(g, ticks) {
    
        var now = +new Date(), 
            fullStackUpdate = false, 
            i, j, lastInput, m, p, s, actions;
        
        // loop through all maps in this game
        for (i = 0; i < g.maps.length; i++) {
        
            m = g.maps[i];
        
            // we process the stack only if there are players on this map
            if (m.players.length > 0) {
            
                for (j = 0; j < m.players.length; j++) {
                    
                    p = m.players[j];
                    s = p.socket;
                    
                    if (s.inputs.length > 0) {
                    
                        console.log(s.inputs.length + ' inputs processed');
                    
                        // process all inputs for the player
                        actions = this._is.processInputs(s.inputs);
                        
                        this._em.processActions(actions, s.hero, m.stack);
                        
                        lastInput = s.inputs.pop();
                        
                        s.lastProcessedInputNo = lastInput[0];
                    
                        s.inputs = []; 
                    
                    }     
                    
                }
            
                // process all proxies

                for (j = 0; j < m.proxies.length; j++) {
                
                    p = m.proxies[j];

                    if (!p.active && p.range && this._em.inRange(p, m.heroes, p.range)) {
                    
                        p.active = true;
                    
                    }
                    
                    if (p.active && p.stacks.length > 0) {
                    
                        m.stack = m.stack.concat(p.stacks.shift());
                        
                        fullStackUpdate = true;
                    
                    }
                    
                    if (p.stacks && p.stacks.length == 0) {
                    
                        m.proxies.splice(i, 1);
                        i--;
                    
                    }
                
                }
            
                // process all living game objects
                for (j = 0; j < m.stack.length; j++) {
                
                    this._em.loop(m.stack[j], ticks, m.stack);                
                
                }
                
                for (j = 0; j < m.players.length; j++) {
                
                    s = m.players[j].socket;
                    
                    if (fullStackUpdate) {
                    
                        s.emit('update', {
                            stack: m.stack
                        });
                    
                    }
                    
                    if (now - s.tsLastUpdate > this.msUpdate) {
                    
                        s.tsLastUpdate = now;
                    
                        s.emit('update', {
                            n: s.lastProcessedInputNo,
                            updates: this.updates(m)
                        });
                    
                    }
                
                }
            
            }
        
        }
    
    }, 
    
    updates: function(map) {
    
        var list = [], 
            i;
        
        for (i = 0; i < map.stack.length; i++) {
        
            list.push({ id: map.stack[i].id, x: map.stack[i].x, y: map.stack[i].y });
        
        }    
        
        return list;
    
    }, 
    
    startGame: function(player) {
        
        var g = { 
                sts: +new Date(), 
                maps: [], 
                currentMap: function(player) {
                    for (var i = 0; i < this.maps.length; i++) {
                        if (this.maps[i].players.indexOf(player) > -1) {
                            return this.maps[i];
                        }
                        return null;
                    }
                },
                running: false, 
                tsLastLoop: 0, 
                owner: player,
                id: ++this.gamesSequenceNo,
                name: 'Game #' + this.gamesSequenceNo
            };

        this.games.push(g);
        
        return g;    
        
    },
    
    /*
    ** This is the method that loads a map. This can be an yet unknown 
    ** map or an previous loaded one. It is called when the game is started 
    ** or the hero travels to a distant location through a town portal, 
    ** waypoint or something similar.
    **
    ** Parameters:
    **    mapId [string]: the key of the map that should be loaded                            
    */    
    loadMap: function(game, player, mapId) {
    
        var map, blueprint, i, j, o, e, p;
    
        game.active = false;

        map = require('../store/maps/' + mapId + '.json');
        
        map.stack = [];
        map.players = [];
        map.heroes = [];
        map.proxies = [];
        
        map.players.push(player);
       
        for (i = 0; i < map.objects.length; i++) {
        
            o = map.objects[i];
            
            switch (o.type) {
            
                case 'spawnpoint':
                
                    p = { x: o.x, y: o.y, stacks: [], range: o.range || 0, active: false };                
                    p.stacks.push([]);
                
                    for (j = 0; j < o.settings.amount; j++) {
                    
                        e = this._em.create(o.settings.type, o.settings);
                    
                        this._em.updatePosition(e, o.x, o.y);
                        
                        p.stacks[0].push(e);
                    
                    }
                    
                    map.proxies.push(p);
                
                    break;
                
                default:
                
                    e = this._em.create(o.settings.type, o.settings);
                    
                    this._em.updatePosition(e, o.x, o.y);
                
                    map.stack.push(e);
                
                    break;
            
            }        
        
        }

        game.maps.push(map);
    
    },
        
    startArenaGame: function(player, arenaId) {
    
        // get a new game object
        var g = this.startGame(player); 
        
        // resolve the map needed for the arena
        for (var i = 0; i < this.arenas.length; i++) {
        
            if (this.arenas[i].id == arenaId) {
            
                g.arena = this.arenas[i];
                break;
            
            }
        
        }
        
        this.loadMap(g, player, g.arena.mapId);
        
        return g;   
    
    }        
         
}