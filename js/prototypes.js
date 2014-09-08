Array.prototype.remove = function(e) {

    var i;
    
    for (i = 0; i < this.length; i++) {
    
        if (this[i] === e) {
        
            this.splice(i, 1);
            i--;
        
        }
    
    }

}

Array.prototype.random = function(amount) {

    var amount = amount || 1, 
        items, notUsed;

    if (this.length > 0) {

        if (amount == 1) {
        
            return this[_.random(0, this.length - 1)];
        
        } else {
        
            items = [];
            notUsed = [];
        
            for (i = 0; i < this.length; i++) {
            
                notUsed[i] = this[i];
            
            }
        
            while (items.length < amount && notUsed.length > 0) {
            
                randomIndex = _.random(0, notUsed.length - 1);
                
                items = items.concat(notUsed.splice(randomIndex, 1));
            
            }
            
            return items;
        
        }
    
    }
    
    return null;

}

Array.prototype.hitTest = function(x, y, exclude) {

    var i;
    
    for (i = 0; i < this.length; i++) {
    
        if (exclude.indexOf(this[i]) == -1 && this[i].hitTest(x, y)) {
        
            return this[i];
        
        }
    
    }
    
    return null;

}