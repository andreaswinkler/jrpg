JRPG.UI = {

    Mode: {
        NORMAL: 0, 
        REPAIR: 1, 
        SELL: 2, 
        SALVAGE: 3    
    },
    
    KeyCode: {
        ENTER: 13, 
        ESC: 27, 
        T: 84, 
        I: 73, 
        S: 83, 
        One: 49  
    },  

    currentMode: 0,
    
    cursorPosition: { x: 0, y: 0 }, 
    
    moduleData: null,

    module: function(key, containerId, data) {
    
        var containerId = containerId || 'content';
        
        JRPG.UI.moduleData = data;
    
        $('#' + containerId).load('html/' + key + '.html?' + Math.random());
    
    },
    
    switchMode: function(newMode) {
    
        this.currentMode = newMode;
    
    }, 
    
    getMode: function() {
    
        return JRPG.Enum.getKey(JRPG.UI.Mode, this.currentMode).toLowerCase();
    
    }, 
    
    /* unclean */
    refreshInfoBox: function() {

        this.eInfoBoxCalc.html(JRPG.lastCalcTime);
        this.eInfoBoxStack.html(_.reduce(JRPG.game.stack, function(memo, i) { return memo + i.children.length + 1 }, 0));    
    
    }, 
    
    init: function() {
    
        this.characterWindow = new JRPG.UI.CharacterWindow(JRPG.hero);
        this.skillsWindow = null;
        this.eInfoBoxCalc = $('#jrpg_ui_infobox .calc');
        this.eInfoBoxStack = $('#jrpg_ui_infobox .stack');
    
        $(document).keydown(function(ev) {
        
            switch (ev.which) {
            
                case JRPG.UI.KeyCode.ESC:
                
                    new JRPG.UI.Dialog('esc_menu', 500, {});
                
                    break; 
                    
                case JRPG.UI.KeyCode.T:
                
                    if (JRPG.game) {
                    
                        JRPG.game.createTownPortal();
                    
                    }
                
                    break; 
                 
                case JRPG.UI.KeyCode.I:
                
                    this.characterWindow.toggle();
                
                    break;
                
                case JRPG.UI.KeyCode.S:
                
                    //this.skillsWindow.toggle();
                    
                    break; 
                
                case JRPG.UI.KeyCode.One:
                
                    if (JRPG.hero.skills[2]) {
                    
                        JRPG.hero.useSkill(JRPG.hero.skills[2], JRPG.UI.cursorPosition);    
                    
                    }
                
                    break; 
            
            }
        
        });
        
        $(document).mousemove(function(ev) {
        
            JRPG.UI.cursorPosition.x = ev.pageX;
            JRPG.UI.cursorPosition.y = ev.pageY;
        
        });
    
    } 

}     