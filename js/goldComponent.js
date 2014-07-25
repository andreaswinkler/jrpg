/*
** The GOLD COMPONENT
** It represents some kind of a purse, so it holds an amount of gold and 
** offers the functionality to take and spend it
*/
var GoldComponent = function(entity, settings) {

    // the amount of gold stored in this purse
    this.amount = settings.amount || 0;
    
    /*
    ** let's spend some gold!
    **     
    ** The method tries to remove the passed amount of gold and 
    ** will return true in case there was enough money in it
    ** to cover the expense otherwise, false is returned.        
    **
    ** Parameters:
    **    amount [int]: the amount to spend  
    **
    ** Returns:
    **    success [bool]                      
    */    
    this.spend = function(amount) {
    
        // if there is enough gold in the purse we remove the 
        // requested amount
        if (this.amount >= amount) {
        
            this.amount -= amount;

            return true;
        
        }    
        
        return false;
    
    };
    
    /*
    ** let's get some gold!
    **
    ** The method adds some gold to this purse
    **
    ** Parameters:
    **    amount [int]: the amount to add to the purse
    **
    ** Returns
    **    nothing                                
    */    
    this.add = function(amount) {
    
        this.amount += amount;
    
    };

}