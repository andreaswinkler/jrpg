/*
** Event handler class
** allows registering and de-registering to events
*/
var EventManager = {

    stack: {}, 
    
    // registeres an entity method to be called in a given
    // event 
    subscribe: function(entity, eventName, callback, scope) {
    
        if (!this.stack[eventName]) {
        
            this.stack[eventName] = [];
        
        }
        
        this.stack[eventName].push([entity, callback, scope]);    
    
    },
    
    // unregister
    unsubscribe: function(entity, eventName, callback) {
    
        if (this.stack[eventName]) {
        
            this.stack[eventName].remove([entity, callback, scope]);
        
        }
    
    }, 
    
    // fires an event
    publish: function(eventName, entity, event) {
    
        var event = event || {};
        
        event._target = entity;
        event._name = eventName;
    
        if (this.stack[eventName]) {
        
            _.each(this.stack[eventName], function(e) {

                if (e[0] == null || e[0] === entity) {

                    e[1].call(e[2], event);
                
                }    
            
            }, this);

        }    
    
    }   

}