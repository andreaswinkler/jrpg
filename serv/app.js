var app = require('http').createServer(), 
    io = require('socket.io').listen(app), 
    fs = require('fs'), 
    _ = require('../js/underscore/underscore.min.js'),
    js = require('./jrpg-server.js'), 
    em = require('../js/entityManager.js');

app.listen(1337);

io.sockets.on('connection', function (socket) {
  
    socket.on('startArenaGame', function(data) {
    
        var game = js.startArenaGame(socket.player, data.arenaId);
        
        socket.game = game;
        socket.map = game.currentMap(socket.player);

        socket.emit('map', {
            name: socket.map.name, 
            stack: socket.map.stack, 
            theme: socket.map.theme,
            width: socket.map.width,
            height: socket.map.height
        });
    
    });
    
    socket.on('joinPublicGame', function(data) {
    
        var game = js.joinGame(data.gameId, socket.player);
        
        if (game) {
        
            socket.game = game;
            socket.map = game.currentMap(socket.player);
            
            socket.emit('map', {
                name: socket.map.name, 
                stack: socket.map.stack, 
                theme: socket.map.theme,
                width: socket.map.width,
                height: socket.map.height
            });
        
        }
    
    });
    
    socket.on('auth', function(data) {
    
        // todo: validate credentials
        
        // load user file
        try {
        
            var user = require('../store/users/' + data.username + '.json');
            
            socket.player = { id: 1, socket: socket };
            
            js.players.push(socket.player);
            
            socket.hero = em.create('hero', user.hero);
            socket.inputs = [];
            socket.tsLastUpdate = 0;
            socket.tsDisconnect = -1;
            
            socket.emit('authResult', { 
                status: 0, 
                hero: socket.hero,
                user: {
                    name: user.name
                },  
                arenas: js.arenas 
            });
        
        } catch (err) {
        
            socket.emit('authError');    
        
        }
    
    });
    
    socket.on('ready', function(data) {
    
        // client tells us that the player is ready, let's add
        // the character to the stack of its current map
        socket.map.stack.push(socket.hero);
        
        if (!socket.game.running) {
        
            socket.game.running = true;
        
        }
        
        socket.emit('stack', socket.map.stack);
    
    });
    
    socket.on('input', function(input) {
    
        socket.inputs.push(input);
    
    });
    
    socket.on('publicGameList', function() {
    
        socket.emit('publicGameList', js.publicGameList(socket.player));
    
    });
    
    socket.on('disconnect', function() {
    
        console.log('client disconnected');
    
        socket.tsDisconnect = +new Date();
    
    });
    
    socket.emit('handshake', { 
        version: js.version 
    });

});

em.blueprints = require('../store/blueprints.json');

js.loop();