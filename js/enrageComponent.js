var EnrageComponent = function(entity, settings) {

    this.status = EnrageComponent.NOT_ENRAGED;
    
    this.timer = new Timer(settings.timeout ? settings.timeout * 1000 : -1);
    
    this.activate = function() {
    
        this.status = EnrageComponent.ENRAGED;
        
        EventManager.publish('entityEnraged', this);
    
    }
    
    EventManager.subscribe(entity, 'entityAggroGained', this.timer.start, this.timer);
    EventManager.subscribe(entity, 'entityAggroLost', this.timer.stop, this.timer);
    
    EventManager.subscribe(this.timer, 'timerElapsed', this.activate, this);

}

EnrageComponent.NOT_ENRAGED = 0;
EnrageComponent.ENRAGED = 1;