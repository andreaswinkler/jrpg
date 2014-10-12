var UI = {

    e: null, 

    update: function() {
    
        Renderer.update();
    
    }, 
    
    arenaSelection: function(list) {
    
        this.e.find('.arenas, .startArenaGame').remove();
    
        var arenaSelection = $('<select class="arenas"></select>');
        
        _.each(list, function(i) {
    
            arenaSelection.append('<option value="' + i.id + '">' + i.name + '</option>');
        
        });
        
        this.e.append(arenaSelection);
        this.e.append('<input type="button" class="startArenaGame" value="start arena game" />');
        
        this.e.find('.startArenaGame').click($.proxy(function(ev) {
        
            JRPG.startArenaGame(this.e.find('.arenas').val());
        
        }, this));
        
        // shortcut start arena game
        JRPG.startArenaGame(1);    
    
    },
    
    publicGameList: function(list) {
    
        this.e.find('.public-game-list').remove();
    
        var gameList = $('<div class="public-game-list"></div>');
        
        _.each(list, function(i) {
        
            gameList.append('<div class="public-game"><span>' + i.name + ' (' + i.playerCount + ')</span><input type="button" class="public-game-join" data-id="' + i.id + '" value="join" /></div>');
        
        });
        
        this.e.append(gameList);
        
        this.e.find('.public-game-join').click($.proxy(function(ev) {
        
            JRPG.joinPublicGame($(ev.target).attr('data-id'));
        
        }, this));
    
    },  
    
    init: function() {
    
        this.e = $('#jrpg_game'); 
        this.e.removeClass('login');   
    
    }, 
    
    startScreen: function() {
    
        EventManager.subscribe(null, 'arenasLoaded', UI.arenaSelection, UI);
        EventManager.subscribe(null, 'publicGameListLoaded', UI.publicGameList, UI);
        EventManager.subscribe(null, 'map', UI.onMapLoaded, UI);
        EventManager.subscribe(null, 'rendererInitialized', UI.inGameUI, UI);
        EventManager.subscribe(null, 'entityDeath', UI.onEntityDeath, UI);
    
    },
    
    onEntityDeath: function(e) {
    
        if (e.id == JRPG.hero.id) {
        
            this.e.append('<div class="death"><span>You died.</span><input type="button" value="resurrect" class="resurrect" /></div>');
            
            this.e.find('.resurrect').click($.proxy(function(ev) {
            
                JRPG.resurrect('corpse');
                
                this.e.find('.death').remove();
                
                ev.preventDefault();
                
                return false;
            
            }, this));    
        
        } else {
        
            console.log('<' + e.t + ' #' + e.id + '> died.');
        
        }
    
    }, 
    
    loginScreen: function() {
    
        this.e.addClass('login'); 
        
        this.e.html('');
        
        /*this.e.append('<input type="password" class="login-box" placeholder="dev key" />'); 
        
        this.e.find('.login-box').keydown(function(ev) {
        
            if (ev.which == 13) {
            
                JRPG.authenticate($(ev.target).val());
                
                $(ev.target).remove();
            
            }
        
        });*/  
        
        // shortcut auto-login
        JRPG.authenticate('1983');
    
    }, 
    
    messageWindow: function(message) {
    
        var s = '';
        
        s += '<div class="message-window">';
        s += '<p>' + message + '</p>';
        s += '<input type="button" class="message-window-confirm" value="ok" />';
        s += '</div>';
        
        this.e.append(s);
        
        this.e.find('.message-window-confirm').unbind().click(function(ev) {
        
            $(ev.target).closest('.message-window').remove();
        
        });
    
    },  
    
    onMapLoaded: function() {
    
        this.loadingScreen();
    
    },
    
    inGameUI: function() {
        
        // init the in-game ui
        // controls
        this.eControls = $('<div class="controls"></div>');
        this.eHealthBar = $('<div class="health resource"><div class="current"></div><span class="value"></span></div>');
        this.eManaBar = $('<div class="mana resource"><div class="current"></div><span class="value"></span></div>');
        
        this.eControls.append(this.eHealthBar);
        this.eControls.append(this.eManaBar);
        
        this.e.append(this.eControls);
    
    }, 
    
    loadingScreen: function() {
    
        this.e.html('<div class="loading"></div>');
    
    }, 
    
    update: function() {
    
        var e = JRPG.hero;
    
        this.eHealthBar.find('.current').css('height', (e.life_c / e.life * 100) + '%');
        this.eHealthBar.find('.value').html(Math.floor(e.life_c));
        
        this.eManaBar.find('.current').css('height', (e.mana_c / e.mana * 100) + '%');
        this.eManaBar.find('.value').html(Math.floor(e.mana_c));
    
    }    
    

}