JRPG.DropFactory = {

    dropTables: null, 

    createItem: function(type, level, magicFind, goldFind, rank) {
    
        var magicFind = 1 + (magicFind || 0), 
            goldFind =  1 + (goldFind || 0), 
            rank = rank || null, amount, item;
        
        if (type == "gold") {
        
            amount = _.random(1, level * level * 5) * goldFind;
        
            return new JRPG.Gold(amount);
        
        } else {
        
            if (rank == null) {
            
                rank = this.rollRank(type, magicFind);
            
            }
        
            return new JRPG.Item(type, level, rank);
        
        }  
    
    },
    
    rollRank: function(type, magicFind) {
    
        var data = JRPG.Item.data[type], 
            rand = Math.random(), 
            rank = JRPG.Item.Rank.NORMAL;
        
        if (data.minRank == JRPG.Item.Rank.UNRANKED) {
        
            return JRPG.Item.Rank.UNRANKED;
        
        }
        
        if (rand >= 0.995) {
        
            rank = JRPG.Item.Rank.LEGENDARY;
        
        } else if (rand >= 0.99) {
        
            rank = JRPG.Item.Rank.SET;
        
        } else if (rand >= 0.925) {
        
            rank = JRPG.Item.Rank.RARE;
        
        } else if (rand > 0.6) {
        
            rank = JRPG.Item.Rank.MAGIC;
        
        } 
        
        return Math.max(rank, data.minRank);
    
    },  

    createEquipment: function(src) {
    
        return [];
    
    }, 

    createDrop: function(src, hero) {
    
        var dropTable = this.dropTable(src), 
            amount = dropTable.amount(), 
            items = [], i, type, item;
    
        // if the amount turns out to be zero => bad luck
        if (amount > 0) {
        
            dropTable = this.dropTable(src);
        
            for (i = 0; i < amount; i++) {
            
                type = dropTable.type(src.level);
                
                // if we couldn't get a type => bad luck
                if (type != null) {
                
                    item = this.createItem(
                        type,
                        src.level,  
                        hero.attr('magicFind'), 
                        hero.attr('goldFind')
                    );
                
                    items.push(item);
                
                }
            
            }     
        
        }
        
        return items;
    
    }, 
    
    createDropTest: function(src, hero, amount) {
    
        var result = { gold: 0, drops: [], total: 0, avg: 0, normalItems: [], magicItems: [], rareItems: [], setItems: [], legendaryItems: [], runes: [], gems: [], names: [] }, 
            i, j, item;
            
        for (i = 0; i < amount; i++) {
        
            items = this.createDrop(src, hero);
            
            result.drops.push(items);
        
            result.gold += _.reduce(items.filter(function(i) { return i instanceof JRPG.Gold }), function(memo, i) { return memo + i.amount }, 0);
            result.normalItems = result.normalItems.concat(items.filter(function(i) { return i.rank == JRPG.Item.Rank.NORMAL }));
            result.magicItems = result.magicItems.concat(items.filter(function(i) { return i.rank == JRPG.Item.Rank.MAGIC }));
            result.rareItems = result.rareItems.concat(items.filter(function(i) { return i.rank == JRPG.Item.Rank.RARE }));
            result.setItems = result.setItems.concat(items.filter(function(i) { return i.rank == JRPG.Item.Rank.SET }));
            result.legendaryItems = result.legendaryItems.concat(items.filter(function(i) { return i.rank == JRPG.Item.Rank.LEGENDARY }));
            result.runes = result.runes.concat(items.filter(function(i) { return i.baseType == 'bt_rune' }));
            result.gems = result.gems.concat(items.filter(function(i) { return i.superType == 'st_gem' }));
            
            result.names = result.names.concat(items.map(function(i, key) { return i.name; }).filter(function(i) { return i != undefined; }));
            
            result.total += items.length;
        
        }
        
        result.avg = result.total / amount;
        
        return result;    
    
    }, 
    
    dropTable: function(src) {
    
        // return drop table based on supertype [animal,human,demon,lootable]
        
        // { lootable: { chest: { amount: { min: 0, max: 3 }, types: {} }
        
        if (this.dropTables[src.supertype] && this.dropTables[src.supertype][src.type]) {
        
            return new JRPG.DropTable(this.dropTables[src.supertype][src.type]);
        
        }
        
        return null;
    
    }

}

JRPG.DropTable = function(data) {

    this.minMaxAmount = { min: data.amount[0], max: data.amount[1] };
    this.types = data.types;
    
    this.amount = function() {
    
        return _.random(this.minMaxAmount.min, this.minMaxAmount.max);
    
    }, 
    
    this.type = function(level) {

        var r = Math.random(), 
            types = [];
        
        _.each(this.types, function(i, key) {
        
            var data = JRPG.Item.data[key];
            
            if (i.chance >= r && level >= data.minDropLevel && level <= data.maxDropLevel) {
            
                types.push(key);
            
            }
        
        });
        
        return types.random();
    
    }

}