JRPG.Renderer = {

    tileWidth: 64, 
    tileHeight: 32, 
    tileWidthHalf: 32, 
    tileHeightHalf: 16, 

    mapCache: null, 

    prerenderMap: function(map) {
    
        var totalWidth = map.width * this.tileWidth, 
            totalHeight = map.height * this.tileHeight, 
            shardSize = 6400, 
            shardTilesH = shardSize / this.tileWidth, 
            shardTilesV = shardSize / this.tileHeightHalf,  
            tilesH, tilesV, i, j, k, c, ctx;
        
        this.mapCache = [];
        
        for (i = 0; i < 9; i++) {
        
            if (totalWidth > (i % 3) * shardSize && totalHeight > Math.floor(i / 3) * shardSize) {
            
                c = document.createElement('canvas');
                c.width = shardSize;
                c.height = shardSize;
                
                this.mapCache[i] = c;
                
                ctx = c.getContext('2d');
                
                tilesH = Math.min(map.width - (i % 3) * shardTilesH, shardTilesH);
                tilesV = Math.min(map.height - Math.floor(i / 3) * shardTilesV, shardTilesV);
                
                console.log(tilesH + '/' + tilesV);
                
                for (j = 0; j < tilesV; j++) {
                
                    for (k = 0; k < tilesH; k++) {
                    
                        this.renderEmptyTile(ctx, j, k);
                    
                    }
                
                }
            
            }           
        
        }
    
    }, 

    renderMap: function(map, ctx) {
    
        if (this.mapCache == null) {
        
            this.prerenderMap(map);
        
        }
    
        // render the map to the given context
        ctx.drawImage(this.mapCache[0], 0, 0);
    
    }, 
    
    renderEmptyTile: function(ctx, row, column) {
    
        var x = column * this.tileWidth + (row % 2) * this.tileWidthHalf, 
            y = row * this.tileHeightHalf + this.tileHeightHalf;
        
        ctx.fillStyle = '#ddd';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.tileWidthHalf, y - this.tileHeightHalf);
        ctx.lineTo(x + this.tileWidth, y);
        ctx.lineTo(x + this.tileWidthHalf, y + this.tileHeightHalf);
        ctx.closePath();
        ctx.fill();       
    
    }

}