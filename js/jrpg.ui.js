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
        One: 49, 
        ALT: 18, 
        CTRL: 17   
    },  

    currentMode: 0,
    
    cursorPosition: { x: 0, y: 0 }, 
    
    tooltip: null,  
    
    moduleData: null,
    
    itemTooltips: [],
    
    eLog: null,  

    log: function(type, s) {
    
        this.eLog.prepend('<span class="log-' + type + '">' + s + '</span>');
    
    },

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
        this.eInfoBoxStack.html(_.reduce(JRPG.game.stack, function(memo, i) { return memo + (i.children ? i.children.length : 0) + 1 }, 0));    
    
    }, 
    
    updateObjectInfo: function(obj) {
    
        this.eObjectInfo.attr('class', '');
    
        if (obj != null && !obj.item && !((obj.type == 'chest' || obj.type == 'grandchest') && obj.behavior('click') == null)) {
        
            this.eObjectInfo.find('.title').html(obj.displayName());
            this.eObjectInfo.addClass('rank-' + obj.rank);
        
            this.eObjectInfo.css('display', 'block');
        
        } else {
        
            this.eObjectInfo.css('display', 'none');
        
        }
    
    }, 
    
    init: function() {
    
        this.characterWindow = new JRPG.UI.CharacterWindow(JRPG.hero);
        this.skillsWindow = null;
        this.eInfoBoxCalc = $('#jrpg_ui_infobox .calc');
        this.eInfoBoxStack = $('#jrpg_ui_infobox .stack');
        this.eObjectInfo = $('#jrpg_object_info');
        this.eLog = $('#jrpg_log');
    
        $(document).keydown($.proxy(function(ev) {
        
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
                
                case JRPG.UI.KeyCode.ALT:
                    
                    JRPG.Renderer.showDroppedItemTooltips = true;
                    
                    break;
                
                case JRPG.UI.KeyCode.CTRL:
                
                    _.invoke(this.itemTooltips, 'toggleStatRollRangeInfo');
                
                    break;
            
            }
        
        }, this));
        
        $(document).keyup($.proxy(function(ev) {
        
            JRPG.Renderer.showDroppedItemTooltips = false;   
        
        }, this));
        
        $(document).mousemove($.proxy(function(ev) {
        
            JRPG.UI.cursorPosition.x = ev.pageX;
            JRPG.UI.cursorPosition.y = ev.pageY;
            
            var obj = JRPG.Renderer.objectAtPosition(ev.pageX, ev.pageY);
            
            this.updateObjectInfo(obj);

        }, this));
        
        $('#jrpg_game').click($.proxy(function(ev) {

            var obj = JRPG.Renderer.objectAtPosition(ev.pageX, ev.pageY), 
                global, skill; 

            if (obj != null) {
            
                if (obj instanceof JRPG.Creature) {
                
                    skill = JRPG.hero.skills[0];
                    
                    if (_inRange(JRPG.hero, obj, skill.range)) {
                
                        JRPG.hero.useSkill(skill, obj);
                    
                    } else {
                    
                        JRPG.hero.moveTo(obj.x, obj.y);
                    
                    }
                
                } else if (obj.canBeUsed()) {
                
                    obj.use(JRPG.hero);
                
                }
          
            } else {
            
                global = JRPG.Renderer.toGlobal(ev.pageX, ev.pageY);
                
                JRPG.hero.moveTo(global.x, global.y);
            
            }
            
        }, this));
    
    } 

}     