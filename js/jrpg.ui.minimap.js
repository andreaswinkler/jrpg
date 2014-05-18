JRPG.UI.Minimap = {

    cache: {}, 

    width: 250, 
    height: 250,
    center: { x: 125, y: 125 }, 
    
    offset: { x: 0, y: 0 }, 
    
    viewRange: 100,  

    map: null, 
    mapLayer: null, 
    maskLayer: null, 
    
    renderLayer: null,
    
    zoom: 2,  
    
    tsLastUpdate: 0, 
    
    e: null,
    eLabel: null,  
    
    initMinimap: function(map) {
    
        if (this.e == null) {
        
            // create map element
            this.e = $('<div id="jrpg_ui_minimap"><label></label></div>');
            this.eLabel = this.e.find('label');
            
            $('#jrpg_ui').append(this.e);
            
            // create object layer
            this.renderLayer = new JRPG.RenderLayer(this.width, this.height);
        
        }
        
        // clear any existing contents
        this.e.find('canvas').remove();
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
        
        this.eLabel.html(this.map.map.name);
        
        // load from cache
        if (this.cache[this.map.id]) {
        
            this.maskLayer = this.cache[this.map.id].maskLayer;
            this.mapLayer = this.cache[this.map.id].mapLayer;
        
        } 
        // create new map and mask
        else {
        
            this.mapLayer = this.createMap(this.map.map);
            this.maskLayer = this.createMask(this.map.map);
        
        }
        
        this.e.append(this.renderLayer.e);
    
    }, 
    
    createMask: function(map) {
    
        var l = new JRPG.RenderLayer(map.width * this.zoom, map.height * this.zoom);
        
        l.clear('rgba(0,0,0,1)');
        
        return l;
    
    }, 
    
    update: function(hero) {
    
        // we do this only once a second
        if (+new Date() - this.tsLastUpdate > 1000) {        
        
            var heroTile = this.map.tileAtPosition(hero.x, hero.y);
        
            this.offset.x = this.center.x - heroTile.col * this.zoom;
            this.offset.y = this.center.y - heroTile.row * this.zoom;
        
            // clear the object layer
            this.renderLayer.clear();
            
            // unhide now visible parts of the map
            this.maskLayer.circle(heroTile.col * this.zoom, heroTile.row * this.zoom, this.viewRange, 'rgba(255,255,255,1)');
            
            // draw correct map part
            this.renderLayer.drawMasked(this.maskLayer.canvas, this.mapLayer.canvas, this.offset.x, this.offset.y);
            
            // place the hero marker on it's position with the correct
            // rotation
            /*this.renderLayer.drawRotated(
                'hero_marker', 
                this.center.x, 
                this.center.y, 
                hero.rotation
            );*/            
            _.each(JRPG.game.stack, function(i) { 
            
                if (i.type != 'hero') {
            
                    var tile = this.map.tileAtPosition(i.x, i.y), 
                        x = this.offset.x + tile.col * this.zoom, 
                        y = this.offset.y + tile.row * this.zoom;
                    
                    this.renderLayer.circle(x, y, 5, 'rgba(0,0,210,1)');
                
                }
            
            }, this);
            
            this.renderLayer.circle(this.center.x, this.center.y, 5, 'rgba(210,0,0,1)');
        
            this.tsLastUpdate = +new Date();
        
        }   
    
    }, 
    
    createMap: function(map) {
    
        var l = new JRPG.RenderLayer(map.width * this.zoom, map.height * this.zoom),
            y = 0, x = 0,   
            i, t, c;
            
        for (i = 0; i < map.tiles.length; i++) {
        
            if (i > 0 && i % map.width == 0) {
            
                y += this.zoom;
                x = 0;
            
            }
        
            t = map.tiles[i];
            
            if (t.walkable) {
            
                c = 'rgba(255,255,255,0.8)';

            } else {
            
                c = 'rgba(0,0,0,0.8)';
            
            }
            
            l.rect(x, y, this.zoom, this.zoom, c);
            
            x += this.zoom;               
        
        }
        
        return l;
    
    }

}