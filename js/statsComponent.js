var StatsComponent = function(entity, settings) {

    this._e = entity;
    this._settings = settings;

    this.strength = 0;
    this.dexterity = 0;
    this.vitality = 0;
    this.intelligence = 0;
    
    this.refresh = function() {
    
        // set all attributes back to the settings 
        // based on the entity level
        this.strength = this._settings.strength * this._e.LevelComponent.current;
        this.dexterity = this._settings.dexterity * this._e.LevelComponent.current;
        this.vitality = this._settings.vitality * this._e.LevelComponent.current;
        this.intelligence = this._settings.intelligence * this._e.LevelComponent.current;
    
        // if the entity has equipment, add all modifiers
        if (this._e.EquipmentComponent) {
        
            this.strength += this._e.EquipmentComponent.sum('strength');
            this.dexterity += this._e.EquipmentComponent.sum('dexterity');
            this.vitality += this._e.EquipmentComponent.sum('vitality');
            this.intelligence += this._e.EquipmentComponent.sum('intelligence');            
        
        }    
    
    }

}