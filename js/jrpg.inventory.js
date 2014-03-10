/* CLASS INVENTORY
** 2014-02-07
**
** represents the item grids used in hero's inventory, stash, vendor's 
** offerings etc
** the class handles adding and removing of items (positioned and automatically
** positioned)
*/
JRPG.Inventory = function(owner, width, height) {

    // the owner of the equipment (usally the hero or an npc)
    this.owner = owner;

    // the dimension of the inventory
    this.width = width;
    this.height = height;
    
    this.cells = [];
    this.stacks = [];
    
    // setup an empty grid
    var index = 0, 
        cell, i, j;
    
    for (i = 0; i < height; i++) {
    
        for (j = 0; j < width; j++) {
    
            cell = new JRPG.Inventory.Cell(i, j);
            
            if (i > 0) {
            
                this.cells[index - width].neighbourBottom = cell; 
            
            }
            
            if (j > 0) {
            
                this.cells[index - 1].neighbourRight = cell;
            
            }
            
            this.cells.push(cell);
            
            index++;
        
        }
    
    }

    this.countItems = function(type) {
    
        return _.reduce(this.stacks, function(memo, i) { return i.type == type ? i.items.length : 0 }, 0);
    
    };

    this.containsItem = function(type, amount) {
    
        return this.countItems(type) >= amount;
    
    };

    this.removeItem = function(type, amount) {
    
        var amount = amount || 1, 
            i, result;
        
        for (i = 0; i < this.stacks.length; i++) {
        
            if (this.stacks[i].type == type) {
            
                result = this.stacks[i].removeItem(amount);
                
                if (amount == 1) {
                
                    if (result) {
                    
                        return true;
                    
                    }
                
                } else if (result) {
                
                    amount -= result.length;
                    
                    if (amount == 0) {
                    
                        return true;
                    
                    }
                
                }
            
            }    
        
        }
        
        return false;     
    
    };

    this.removeStack = function(stack) {
    
        _.each(stack.cells, function(i) {
        
            i.stack = null;
        
        });
        
        this.stacks.splice(this.stacks.indexOf(stack), 1);
    
    };

    this.addStack = function(cell, item) {
    
        var cells = cell.emptyNeighbours(item.inventoryWidth, item.inventoryHeight);
        
        if (cells != null) {
                
            this.stacks.push(new JRPG.Inventory.Stack(this, cells, item));
            
            return true;
        
        } 
        
        return false;    
    
    };

    this.addItem = function(item, cell) {
    
        // we try to place the item to the given cell
        if (cell) {
        
            // we already have a stack on this cell
            // let's try to add the item
            // this will fail if the item is not stackable or the 
            // items type does not match            
            if (cell.stack) {
            
                return cell.stack.addItem(item);    
            
            } 
            // ok, the cell is empty, we check all neighbours
            // and add a stack for this item
            else {
            
                return this.addStack(cell, item);
                
            }
        
        } 
        // lets try to find a suitable cell
        else {
        
            // first we try to find existing stacks
            var existingStack = _.find(this.stacks, function(i) { return i.test(item); });
            
            if (existingStack) {
            
                return existingStack.addItem(item);   
            
            } 
            
            // if we can't find an existing stack we need to find an empty
            // cell
            for (var i = 0; i < this.cells.length; i++) {
            
                if (this.addStack(this.cells[i], item)) {
                
                    return true;
                
                }
            
            }
            
            return false;         
        
        }
    
    };
    
    this.getCell = function(row, column) {
    
        var index = row * column;
    
        if (index < this.cells.length) {
        
            return this.cells[index];
        
        }
        
        return null;
    
    };
    
    this.repairCost = function() {
    
        return _.reduce(this.stacks, function(memo, i) { return memo + i.repairCost(); }, 0);
    
    };

}
JRPG.Inventory.prototype = new JRPG.EventHandler();

JRPG.Inventory.Cell = function(row, col) {

    this.row = row;
    this.col = col;
    this.stack = null;
    this.neighbourRight = null;
    this.neighbourBottom = null;
    
    this.removeStack = function() {
    
        if (this.stack != null) {
        
            return this.stack.remove();
        
        }
        
        return null;
    
    };
    
    this.emptyNeighbours = function(width, height) {
        
        var nc = this, i, cells = [];
        
        cells.push(this);
        
        for (i = 1; i < width; i++) {
        
            nc = nc.neighbourRight;
        
            if (nc && nc.stack == null) {
            
                cells.push(nc); 
 
            
            } else {
            
                return null;
            
            }
        
        }

        for (i = 0; i < width; i++) {
        
            nc = cells[i];
        
            for (j = 0; j < height; j++) {
            
                nc = nc.neighbourBottom;
                
                if (nc && nc.stack == null) {
                
                    cells.push(nc);
                
                } else {
                
                    return null;
                
                }
            
            }            
        
        }

        return cells;
    
    };

}

JRPG.Inventory.Stack = function(owner, cells, item) {

    this.addItem = function(item) {
    
        if (item.type == this.type && this.items.length < item.maxStackAmount) {
        
            this.items.push(item);    
        
            return true;
        
        }
        
        return false;    
    
    };
    
    this.removeItem = function(amount) {
    
        var result;
    
        if (amount) {
        
            result = this.items.splice(0, amount);
        
        } 
        
        result = this.items.shift();
        
        if (this.items.length == 0) {
        
            this.remove();
        
        }
        
        return result;  
    
    };
    
    this.remove = function() {
    
        this.owner.removeStack(this);
    
        return this;
    
    };
    
    this.test = function(item) {
    
        return this.type == item.type && this.items.length < item.maxStackAmount;
    
    };

    this.owner = owner;
    this.cells = cells;
    this.type = item.type;
    
    this.items = [];
    
    this.items.push(item);
    
    _.each(this.cells, $.proxy(function(i) {
    
        i.stack = this;    
    
    }, this));

}