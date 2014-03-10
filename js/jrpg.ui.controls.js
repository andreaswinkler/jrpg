JRPG.UI.Controls = function() {

    // the heros xp bar
    this.progress = new JRPG.UI.XpProgressBar(JRPG.hero, { showValue: false });
    
    // the heros life
    this.life = new JRPG.UI.Sphere(JRPG.hero, 'life');
    
    // the heros mana
    this.mana = new JRPG.UI.Sphere(JRPG.hero, 'mana');
    
    this.e = $('<div class="controls"></div');
    
    this.e.append(this.life.e);
    this.e.append(this.progress.e);
    this.e.append(this.mana.e);
    
    $('#jrpg_ui').append(this.e);      

}