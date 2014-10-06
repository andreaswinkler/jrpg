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
        EventManager.subscribe(null, 'mapSetup', UI.onMapSetup, UI);
    
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
    
    onMapSetup: function() {
    
    }, 
    
    loadingScreen: function() {
    
        this.e.html('<div class="loading"></div>');
    
    }    
    

}