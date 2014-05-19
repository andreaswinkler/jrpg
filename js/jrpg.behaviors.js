/* 2014/5/18 */
JRPG.Behaviors = {
    
    // creates a drop
    // the src object is the object that drops something
    // the obj object is the target, relevant because of 
    // magic and gold find and other limitiations for 
    // duplicate drops
    drop: function(src, obj) {
    
        var drop = JRPG.DropFactory.createDrop(src, obj);
    
        // we only drop something once
        src.behavior('click', null);
    
        // play the objects drop animation if any
        src.animate('drop', $.proxy(function(drop) {

            JRPG.game.drop(this.x, this.y, drop);           
        
        }, src), [drop]);
    
    }
    
}