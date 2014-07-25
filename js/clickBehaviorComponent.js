var ClickBehaviorComponent = function(entity, settings) {

    this._e = entity;
    
    this.key = settings.key;
    
    this.run = function() {
    
        ClickBehaviorComponent.behaviors[this.key](this._e);    
    
    }

}

ClickBehaviorComponent.behaviors = {
    
    startCurrentArena: function(e) {
    
        Arena.start();    
    
    }
    
}