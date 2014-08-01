var LevelComponent = function(entity, settings) {

    this._e = entity;

    // the current amount of experience
    this.experience = settings.experience || 0;

    // the current level
    this.current = LevelComponent.getLevelByExperience(this._e.type, this.experience);
    
    // the experience threshold for the next level, if set to -1 
    // no level up occurs
    this.nextLevelExperienceThreshold = LevelComponent.nextLevelExperienceThreshold(this._e.type, this.current);
    
    this.gainExperience = function(value) {
    
        if (this.nextLevelExperienceThreshold > -1) {
    
            this.experience += value;
            
            // we reached the next level!
            if (this.experience >= this.nextLevelExperienceThreshold) {
            
                this.current++;
            
                this.nextLevelExperienceThreshold = LevelComponent.nextLevelExperienceThreshold(this._e.type, this.current);   
                
                EventHandler.publish('entityLevelUp', this);                     
            
            }
        
        }
    
    }

}

LevelComponent.experienceThresholds = {
    'hero': [0, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400]
};

LevelComponent.nextLevelExperienceThreshold = function(type, level) {

    var nextLevelExperienceThreshold = -1;
    
    if (LevelComponent.experienceThresholds[type] && LevelComponent.experienceThresholds[type].length > level) {
    
        nextLevelExperienceThreshold = LevelComponent.experienceThresholds[type][level];    
    
    }
    
    return nextLevelExperienceThreshold;

};

LevelComponent.getLevelByExperience = function(type, experience) {

    var i;

    for (i = LevelComponent.experienceThresholds[type].length; i >= 0; i--) {
    
        if (experience >= LevelComponent.experienceThresholds[type][i]) {
        
            return i + 1;
        
        }
    
    }

};