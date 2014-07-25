/*
** Debugger
*/
var Debugger = {

    log: function(ev) {
    
        switch (ev._name) {
        
            case 'entityCreated':
            
                console.log('A new entity was created.');
                console.dir(ev.newEntity);
                
                break;
        
        }
    
    }

}