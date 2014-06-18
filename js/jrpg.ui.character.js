/* 
** 2014/02/12
*/
JRPG.UI.CharacterWindow = function(hero) {

    this.hero = hero;
    
    this.inventory = null;
    
    this.eGold = null;

    this.overallStats = [
        { label: 'Vitality', attr: 'vit' }, 
        { label: 'Strength', attr: 'str' }, 
        { label: 'Dexterity', attr: 'dex' }, 
        { label: 'Force', attr: 'int' }, 
        { label: 'Armor', attr: 'armor' }, 
        { label: 'Damage', attr: 'dps', digits: 2 }
    ];
    
    this.detailledStats = [
        { label: 'Life', attr: 'life' }, 
        { label: 'Life/s', attr: 'lifePerSecond' }, 
        { label: 'Focus', attr: 'mana' },
        { label: 'Focus/s', attr: 'focusPerSecond' }, 
        { label: 'Attack speed', attr: 'as' }, 
        { label: 'Movement speed', attr: 'speed' } 
    ];
    
    this.initCharacterWindow = function() {

        this.initWindow('The Hero', { position: 'right', width: '600px' });
        
        var e = $('<div class="details hidden"></div><div class="overview"><div class="stats"></div><div class="gold"></div><input type="button" class="show-details" value="Details" /></div><div class="equipment"></div><div class="inventory"></div>');

        this.e.find('.window-content').append(e); 
        
        // create the inventory instance from the heros main inventory
        // and append it into the inventory container
        this.inventory = new JRPG.UI.Inventory(this.hero.inventories.main, this.e.find('.inventory'));
        
        // create the equipment instance from the heros equipment 
        // and append it into the equipment container
        this.equipment = new JRPG.UI.Equipment(this.hero.equipment, this.e.find('.equipment')); 
        
        // create all overall stat elements
        _.each(this.overallStats, function(i) {
        
            this.e.find('.overview .stats').append(this._statElement(i));    
        
        }, this);
        
        // create all detailled stat elements
        _.each(this.detailledStats, function(i) {
        
            this.e.find('.details').append(this._statElement(i));
        
        }, this);
        
        // get a reference to the gold display
        this.eGold = this.e.find('.gold');
        
        // clicking the 'details' button toggles the visiblity of the 
        // details pane which is attached to the left of the 
        // character screen
        this.e.find('.show-details').click($.proxy(function(ev) {
        
            this.e.find('.details').toggleClass('hidden');
        
        }, this));
        
        // if the hero earns or looses gold, refresh the gold display
        this.hero.on('attributeChanged_gold', this.updateGold, this);
        
        // if any of the heros stats are changed, refresh the overall 
        // and detailled stats screen
        this.hero.on('attributeChanged', this.updateStats, this);
        
        // initally update all stats, amount of gold, etc
        this.update();
    
    };
    
    /*
    ** private
    ** helper function that creates a label+value element for use with 
    ** overall and detailled stats, also appends the result to the 
    ** stat object           
    */    
    this._statElement = function(stat) {
    
        var e = $('<div><label>' + stat.label + '</label><span class="value" data-attr="' + stat.attr + '"></span></div>');
        
        stat.e = e.find('.value');
        
        return e;
    
    };
    
    this.update = function() {
    
        // update the amount of gold the hero has
        this.updateGold();
        
        // update the overall stats (vit, dex, int, str, armor)
        // and detailled stats (ias, life, mana, resis, mf, gf, etc)
        this.updateStats();
    
    };
    
    this.updateGold = function() {
    
        this.eGold.html(this.hero.gold);
    
    }; 
    
    this.updateStats = function() {
    
        // update all overall stats
        _.each(this.overallStats, function(i) {
        
            i.e.html(this.hero.attr(i.attr).toFixed(i.digits || 0));
        
        }, this);

        
        // update all detailled stats
        _.each(this.detailledStats, function(i) {
        
            i.e.html(this.hero.attr(i.attr));
        
        }, this);  
    
    };
    
    this.initCharacterWindow();   

}
JRPG.UI.CharacterWindow.prototype = new JRPG.UI.Window();