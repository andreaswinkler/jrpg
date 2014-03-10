/* 
** 2014/02/12
*/
JRPG.UI.BlacksmithWindow = function(blacksmith) {

    /*
    ** The main blacksmith window shows the current level of the 
    ** blacksmith along with the progress to the next level and the 
    ** actions to buy an upgrade        
    */    
    this.mainContent = function() {
    
        var e = $('<div></div>');
        
        e.append('<span class="level"></span>');
        e.append(this.progress.e);
        e.append('<input type="button" value="upgrade" class="upgrade" />');
        e.append('<div class="next-upgrade-cost"></div>');
        
        e.find('.upgrade').click($.proxy(function(ev) {
        
            var nextUpgradeCost = this.nextUpgradeCost();
            
            // there is another stage/level and we know what it costs
            if (nextUpgradeCost) {
            
                // the hero can afford the costs and was already invoiced
                if (JRPG.hero.pay(nextUpgradeCost)) {
                
                    this.blacksmith.addXp(1);

                }
                // the hero can't afford the costs
                else {
                
                    // play failed sound
                
                }
            
            } 
            
            this.refreshMainContent();
        
        }, this));
        
        return e;       
    
    };
    
    /*
    ** updates the main window of the blacksmith screen with the current 
    ** blacksmith level and upgrade costs    
    */    
    this.refreshMainContent = function() {
    
        this.e.find('.level').html('Level ' + this.blacksmith.level);
        
        var s = JSON.stringify(this.nextUpgradeCost());        
        this.e.find('.next-upgrade-cost').html(s);
    
        this.progress.refresh(this.blacksmith);
        
        // there is no upgrade defined, no button needed anymore
        if (!this.nextUpgradeCost()) {
            
            this.e.find('.upgrade, .next-upgrade-cost').addClass('hidden');    
            
        }    
    
    };
    
    /*
    ** the repair window contains the UI-mode toggle 'repair' which allows 
    ** the player to individually repair items by clicking them in the 
    ** hero's inventory
    ** additionally it contains a 'repair all' button that repairs all items
    ** in the hero's equipment and inventory
    ** the total repair costs are displayed too                    
    */    
    this.repairContent = function() {
    
        var e = $('<div></div>');
        
        e.append('<span class="repair-costs"></span>');
        e.append('<input type="button" value="repair" class="repair-single" />');
        e.append('<input type="button" value="repair all" class="repair-all" />'); 
        
        e.find('.repair-single').click($.proxy(function(ev) {
        
            JRPG.UI.switchMode(JRPG.UI.Mode.REPAIR);
        
        }));
        
        e.find('.repair-all').click($.proxy(function(ev) {
        
            JRPG.hero.repairAll();
            
            this.refreshRepairContent();
  
        }, this));
        
        return e;   
    
    };
    
    /*
    ** updates the repair window of the blacksmith screen with the current 
    ** repair costs and activates or deactivates the action buttons accordingly    
    */  
    this.refreshRepairContent = function() {
    
        var totalRepairCosts = JRPG.hero.repairCost();
    
        this.e.find('.repair-costs').html(totalRepairCosts);
        
        if (totalRepairCosts > 0) {
        
            this.e.find('.repair-single, .repair-all').removeClass('hidden');
        
        } else {
        
            this.e.find('.repair-single, .repair-all').addClass('hidden');
        
        }
    
    }  
    
    /*
    ** the craft window contains a list of all available recipes
    ** once a recipe was selected an anvil is shown along width additional
    ** crafting costs (gold, mats)
    ** if a matching item was placed on the anvil the craft button will 
    ** be shown                
    */    
    this.craftContent = function() {
    
        // TODO
        return '';
    
    };
    
    /*
    ** the salvage window contains a button 'salvage' which sets the 
    ** UI-mode 'salvage' and allows the player to click on items in his 
    ** inventory to salvage them: the resulting mats are then added to 
    ** his inventory            
    */    
    this.salvageContent = function() {
    
        // TODO
        return '';
    
    };
    
    /*
    ** gets the cost of the next blacksmith upgrade based upon the current
    ** blacksmith experience    
    */    
    this.nextUpgradeCost = function() {
    
        return JRPG.Creature.data.blacksmith.upgradeCosts[this.blacksmith.xp];

    };

    // the reference to the blacksmith
    this.blacksmith = blacksmith;

    // the blacksmith's experience bar
    this.progress = new JRPG.UI.XpProgressBar(this.blacksmith, { showValue: false }); 
    
    this.initWindow('Blacksmith', {});
        
    this.addTab('main', this.mainContent());
    this.addTab('craft', this.craftContent());
    this.addTab('repair', this.repairContent());
    this.addTab('salvage', this.salvageContent());   
    
    this.refreshMainContent(); 
    this.refreshRepairContent();   
       

}
JRPG.UI.BlacksmithWindow.prototype = new JRPG.UI.Window();