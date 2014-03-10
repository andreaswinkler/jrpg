JRPG.UI.ProgressBar = function(options) {

    this.refresh = function(current, total) {
    
        if (total != undefined) {
        
            this.options.total = total;
        
        }
        
        if (current != undefined) {
        
            this.options.current = Math.min(current, this.options.total);
        
        }
        
        this.render();

    };
    
    this.render = function() {
    
        if (this.options.total > 0) {
        
            var percent = this.options.current / this.options.total, 
                totalWidth = this.eFullBar.width();
            
            this.eBar.width(totalWidth * percent);
        
        } else {
        
            this.eBar.width(0);
        
        }
        
        this.renderValue();
        this.renderText();         
    
    };
    
    this.renderValue = function() {
    
        if (this.options.showValue) {
        
            this.eValue.html(this.options.current + '/' + this.options.total);
        
        }    
    
    };
    
    this.renderText = function() {
    
    
    };

    this.options = null;
    this.e = null;
    this.eFullBar = null;
    this.eBar = null;
    this.eValue = null;
    this.eText = null;
    
    this.initProgressBar = function(options) {

        this.options = $.extend({
            current: 0, 
            total: 0, 
            text: '', 
            showValue: true, 
            width: 100, 
            mode: 'default'  
        }, options || {});
    
        this.e = $('<div class="progress-bar"><div class="progress-bar-container"><div class="progress-bar-filled"></div><div class="progress-bar-value"></div></div><div class="progress-bar-text"></div></div>');
        this.eFullBar = this.e.find('.progress-bar-container');
        this.eBar = this.e.find('.progress-bar-filled');
        this.eValue = this.e.find('.progress-bar-value');
        this.eText = this.e.find('.progress-bar-text');
        
        this.eFullBar.width(this.options.width);
        
        this.refresh(this.options.current);
    
    }

}
JRPG.UI.XpProgressBar = function(character, options) {

    this.getCurrent = function(character) {
    
        return character.xp - character.currentLevelXp();
    
    };
    
    this.getTotal = function(character) {
    
        return character.nextLevelXp() - character.currentLevelXp();
    
    };

    this.refresh = function() {
    
        this.options.current = this.getCurrent(this.character);
        this.options.total = this.getTotal(this.character);
        
        this.render();
    
    };

    this.character = character;

    options.current = this.getCurrent(character);
    options.total = this.getTotal(character);

    this.initProgressBar(options);    

}
JRPG.UI.XpProgressBar.prototype = new JRPG.UI.ProgressBar();