JRPG.UI.Minimap = {

    cache: {}, 

    width: 250, 
    height: 250,
    center: { x: 125, y: 125 }, 
    
    viewRange: 20,  

    map: null, 
    mapLayer: null, 
    maskLayer: null, 
    
    renderLayer: null, 
    
    e: null, 
    
    initMinimap: function(map) {
    
        if (this.e == null) {
        
            // create map element
            this.e = $('<div id="jrpg_ui_minimap"></div>');
            
            $('#jrpg_ui').append(this.e);
            
            // create object layer
            this.renderLayer = new JRPG.RenderLayer(this.width, this.height);
        
        }
        
        // clear any existing contents
        this.e.html();
        this.renderLayer.clear();        
    
        // we already had a map loaded
        if (this.map != null) {
        
            this.cache[this.map.id] = { 
                map: this.map, 
                mapLayer: this.mapLayer, 
                maskLayer: this.maskLayer 
            };        
        
        }
        
        this.map = map;
        
        // load from cache
        if (this.cache[this.map.id]) {
        
            this.maskLayer = this.cache[this.map.id].maskLayer;
            this.mapLayer = this.cache[this.map.id].mapLayer;
        
        } 
        // create new map and mask
        else {
        
            this.mapLayer = this.createMap(this.map.map);
            this.maskLayer = this.createMask(this.map.map.width, this.map.map.height);
        
        }
        
        this.e.append(this.renderLayer.e);
    
    }, 
    
    createMask: function(width, height) {
    
        var l = new JRPG.RenderLayer(width, height);
        
        l.clear('rgba(0,0,0,1)');
        
        return l;
    
    }, 
    
    update: function(hero) {
    
        var heroTile = this.map.tileAtPosition(hero.x, hero.y);
    
        // clear the object layer
        this.renderLayer.clear('rgba(0,210,0,1)');
        
        // draw correct map part
        this.renderLayer.drawMasked(this.maskLayer.canvas, this.mapLayer.canvas, 0, 0);
        
        // place the hero marker on it's position with the correct
        // rotation
        /*this.renderLayer.drawRotated(
            'hero_marker', 
            this.center.x, 
            this.center.y, 
            hero.rotation
        );*/
        this.renderLayer.circle(this.center.x, this.center.y, 5, 'rgba(210,0,0,1)');
        
        // unhide now visible parts of the map
        this.maskLayer.circle(heroTile.col, heroTile.row, this.viewRange, 'rgba(255,255,255,1)');        
    
    }, 
    
    createMap: function(map) {
    
        var l = new JRPG.RenderLayer(map.width, map.height),
            y = -1, x = 0,   
            i, t;
            
        for (i = 0; i < map.tiles.length; i++) {
        
            if (i % map.width == 0) {
            
                y++;
                x = 0;
            
            }
        
            t = map.tiles[i];
            
            if (t.walkable) {
            
                l.rect(x, y, 1, 1, 'rgba(100,100,100,1)');
            
            } else {
            
                l.rect(x, y, 1, 1, 'rgba(25,25,25,1)');
            
            }
            
            x++;               
        
        }
        
        return l;
    
    }

}