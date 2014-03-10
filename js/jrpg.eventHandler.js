/*
** 2012/01/30
** 
** handles all sending/receiving of events
** all classes can extend EventHandler and everyone can bind to its events
*/
JRPG.EventHandler = function() {

    this.listeners = null;
    
    /*
    ** instantiate the listeners object to avoid collisions with other
    ** instances of the EventHandler class    
    */    
    this.initEventHandler = function() {
    
        this.listeners = {};
    
    };
    
    /*
    ** bind to an event by key
    ** func: the function called in case the event is raised
    ** context: the object to which the context of the invoked function is set        
    */    
    this.on = function(eventKey, func, context) {
    
        if (!this.listeners[eventKey]) {
        
            this.listeners[eventKey] = [];
        
        }
        
        this.listeners[eventKey].push({ func: func, context: context });
    
    };
    
    /*
    ** unbind a given event listener
    */    
    this.unbind = function(eventKey, func) {
    
        if (this.listeners[eventKey]) {
        
            for (i = 0; i < this.listeners.length; i++) {
            
                if (this.listeners[i] == func) {
                
                    this.listeners.splice(i, 1);
                
                }
            
            }
        
        }
    
    };
    
    /*
    ** raise an event
    ** all registered handlers are called in order of their binding
    ** the event handlers always get passed a event object which 
    ** differs based on the event raised            
    */    
    this.emit = function(key, data) {
    
        //console.log('emit <' + key + '>');
        //console.dir(data);
    
        var listener = this.listeners[key], 
            ev, i;
    
        if (listener) {
        
            ev = { data: data, caller: this };
        
            for (i = 0; i < listener.length; i++) {
            
                listener[i].func.call(listener[i].context, ev);
            
            }    
        
        }
    
    };
    
    this.initEventHandler();

}