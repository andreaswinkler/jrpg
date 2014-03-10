JRPG.UI.JewellerWindow = function(jeweller) {

    this.jeweller = jeweller;
    
    this.initWindow('Jeweller', { });
    
    var mainContent = '', craftContent = '', unsocketContent = '';
    
    // maincontent:
    // jeweller image
    // jeweller level
    // progress bar
    // buy level form
    
    // craftcontent:
    // list of all recipes
    // anvil, cost information
    
    // unsocket content
    // anvil
    
    this.addTab('main', mainContent);
    this.addTab('craft', craftContent);
    this.addTab('salvage', salvageContent);       
       

}
JRPG.UI.JewellerWindow.prototype = new JRPG.UI.Window();