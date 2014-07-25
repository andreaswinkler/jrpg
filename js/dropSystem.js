/*
** 2014/07/21
**
** This is the DROP SYSTEM. If a drop is created, or any item for that matter
** it is handled by this system. 
*/
var DropSystem = {

    // the drop tables
    // TODO: this should be loaded from somewhere
    dropTables: {
        'chest': {
            min: 0, 
            max: 2, 
            types: {
                'chestarmor': 0.5, 
                'shield': 0.5, 
                'helm': 0.5, 
                'gold': 1, 
                'token': 0.1, 
                'staff': 0.15
            }
        }
    }, 
    
    // probabilities to roll an item of a specific rank
    // rank0, rank1, rank2, rank3, rank4, rank5
    rankRollProbabilities: [0, 0, 0.6, 0.925, 0.995, 0.999],  
    
    /*
    ** Here we actually create items (or piles of gold)
    **
    ** Parameters:
    **    type [string]: the type the item should have
    **    level [int]: the level the item should have
    **    magicFind [float]: the increased magic find percentage of 
    **       the hero (1 = +100%)
    **    goldFind [float]: the increased gold find percentage of 
    **       the hero (1 = +100%)
    **    rank [int]: the rank the item should have (optional)
    **       if the rank is omitted, the rollRank method is called 
    **
    ** Returns:
    **    either a Gold or Item instance                                                   
    */    
    createItem: function(type, level, magicFind, goldFind, rank) {
    
        var magicFind = 1 + (magicFind || 0), 
            goldFind =  1 + (goldFind || 0), 
            rank = rank || null, 
            amount;
        
        // a pile of gold is requested, so we calculate the amount 
        // by the (source) level and the gold find probability of 
        // the finder
        if (type == 'gold') {
        
            // we get a random value between source level and  
            // source level square and increase it by the 
            // gold find probability
            amount = _.random(level, level * level) * goldFind;
        
            return new Gold(amount);
        
        } else {
        
            // the rank was omitted, let's roll one based 
            // on the item type and the magic find probability
            if (rank == null) {
            
                rank = this.rollRank(type, magicFind);
            
            }

            return new Item(type, level, rank);
        
        }  
    
    },
    
    /*
    ** Here we roll a rank
    ** A rank determines the quality of an item (mainly the amount of 
    ** additional modifiers)
    **        
    ** The following item ranks are available:
    **   0: a quest item (it has basically no rank) 
    **   1: a normal item
    **   2: a magic item
    **   3: a rare item
    **   4: a set or legendary item
    **   5: a super-unique item                           
    **
    ** Parameters:
    **    type [string]: the item type
    **    magicFind [float]: the increased magic find percentage (1 = 100%) 
    **
    ** Returns:
    **    a random rank [int] within the range of min/max for the given type                            
    */    
    rollRank: function(type, magicFind) {
    
        var r = Math.random() * magicFind, 
            minRank = Item.data[type].minRank, 
            maxRank = Item.data[type].maxRank, 
            i;
    
        // we loop from the max rank down to the min rank and 
        // return the highest one available for our rolled value
        for (i = maxRank; i >= minRank; i--) {
        
            if (r >= this.rankRollProbabilities[i]) {
            
                return i;
            
            }    
        
        }
        
        // if we could not determine a rank for some reason
        // we return the minimum rank available for the given item type
        return minRank;
    
    }, 
    
    /*
    ** Here we roll an item type
    ** Types finally determine the item itself (e.g. a small sword 
    ** or a chipped ruby)    
    **
    ** Parameters:
    **    dropTable [object]: an object holding the possible types and their
    **       probabilities and level ranges
    **    level [int]: the source level
    **
    ** Returns:
    **    the rolled type [string] or null (if no type could be derived)                                
    */    
    rollType: function(dropTable, level) {
    
        var r = Math.random(), 
            types = [];
    
        // we loop through all types allowed for the provided drop table
        _.each(dropTable.types, function(i, key) {
        
            // we get the blueprint for an item type
            var data = Item.data[key];
            
            // we add all types with a level range containing our source level
            // and a matching probability
            if (i.chance >= r && level >= data.minDropLevel && level <= data.maxDropLevel) {
            
                types.push(key);
            
            }
        
        });
        
        return types.random();        
    
    }, 

    /*
    ** Here we create a complete drop based on the type and level 
    ** of the drop source
    **
    ** We first get the sources drop table and determine a random 
    ** amount of items to drop
    ** Afterwards we try to roll the item types, create the items 
    ** and return them as a list
    **
    ** Parameters:
    **   srcType [string]: the type of the dropping entity
    **   srcLevel [int]: the level of the dropping entity
    **   magicFind [float]: the increased magic find percentage (1 = 100%) 
    **   goldFind [float]: the increased gold find percentage (1 = 100%)
    **
    ** Returns:
    **   the dropped items [array], can be empty                                                           
    */    
    createDrop: function(srcType, srcLevel, magicFind, goldFind) {
    
        var dropTable = this.dropTables[srcType], 
            amount = _.random(dropTable.min, dropTable.max), 
            items = [], i, type;

        // the amount was rolled within the min/max range of the drop table
        // if it's greater then zero we try to create as many items
        if (amount > 0) {
        
            for (i = 0; i < amount; i++) {
            
                // here we roll the type of an item
                type = this.rollType(dropTable, srcLevel); 
                
                // if we couldn't get a type => bad luck
                if (type != null) {
                
                    items.push(this.createItem(type, srcLevel, magicFind, goldFind));
                
                }
            
            }     
        
        }
        
        return items;
    
    }

}