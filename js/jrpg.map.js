/*
** 2014/2/21
*/
JRPG.Map = function(map) {

    this.map = map;
    
    this.id = map.id;
    this.level = map.level;
    
    // TODO: tile array should come from editor
    if (!this.map.tiles) {
        
        this.map.tiles = [];
    
        for (var i = 0; i < this.map.height; i++) {
        
            for (var j = 0; j < this.map.width; j++) {
            
                this.map.tiles.push(0);
            
            }
        
        }
    
    }
    
    for (var i = 0; i < this.map.tiles.length; i++) {
    
        this.map.tiles[i] = new JRPG.Map.Tile(Math.floor(i / this.map.width), i % this.map.width, this.map.tiles[i]);
    
    }    
    
    /*
    ** returns the tile at a position given
    ** in global coordinates
    **
    ** this is used for character/creature positions            
    */    
    this.tileAtPosition = function(x, y) {

        var index = Math.floor(x / JRPG.Map.TILESIZE) + Math.floor(y / JRPG.Map.TILESIZE) * this.map.width;
        
        if (index >= 0 && index < this.map.tiles.length) {
        
            return this.map.tiles[index];
        
        }
        
        return null;     
    
    }; 
    
    /*
    ** check if a creature can move to a position
    *
    ** checks if a tile exists, the tile is walkable or the creature flies 
    ** also checks if there is            
    */
    this.canMoveTo = function(obj, x, y) {
    
        var tile = this.tileAtPosition(x, y);
        
        if (!tile) {
        
            return false;
        
        }
        
        // some objects can even pass through walls
        if (obj.attributes.ignoreObstacles) {
        
            return true;
        
        } 
        // birds and bats fly over everything that's not a wall
        else if (obj.attributes.flying) {
        
            return !tile.blocked;
        
        } 
        // ground-bound creatures need even paths
        else {
        
            return tile.walkable;
        
        }
    
    };      

}
JRPG.Map.TILESIZE = 64;

JRPG.Map.Tile = function(row, col, input) {

    // walkable ground with z = 0
    if (input == 0) {
    
        input = 'gw|0';
    
    }

    this.x = col * JRPG.Map.TILESIZE;
    this.y = row * JRPG.Map.TILESIZE;
    this.z = input.split('|').pop();
    this.name = row + '_' + col;
    this.row = row;
    this.col = col;
    this.walkable = input.indexOf('w') != -1;
    this.type = input.substring(0, 1);
    this.blocked = input.indexOf('b') != -1;

}