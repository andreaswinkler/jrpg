var Timer = function(timeout) {

    this.startTime = 0;
    this.timeout = timeout;
    
    this.refresh = function() {
    
        if (this.startTime > 0 && +new Date() - this.startTime >= this.timeout) {
        
            this.stop();
        
            EventManager.publish('timerElapsed', this);    
        
        }
    
    };
    
    this.stop = function() {
    
        this.startTime = 0;
    
    };
    
    this.start = function() {
    
        this.startTime = +new Date();
    
    };

}