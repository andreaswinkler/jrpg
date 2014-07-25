var Renderer = {

    tileWidth: 64, 
    tileHeight: 32, 
    tileWidthHalf: 32, 
    tileHeightHalf: 16, 

    hero: null, 

    mapCache: null, 
    
    layers: null,
    
    hitAreasList: [],

    width: 0, 
    height: 0, 
    
    showDroppedItemTooltips: false, 

    messages: [], 
    
    mapRendered: false,
    
    drawHealthBars: false,  

    init: function() {
    
        this.width = $(window).width(), 
        this.height = $(window).height();
        
        // remove canvas elements
        _.each(this.layers, function(i) {
        
            i.e.remove();    
        
        });
        
        this.layers = {
            map: new RenderLayer(this.width, this.height), 
            objects: new RenderLayer(this.width, this.height),
            messages: new RenderLayer(this.width, this.height),  
            info: new RenderLayer(this.width, this.height)
        };
        
        // add all canvas elements to dom
        _.each(this.layers, function(i) {
        
            $('#jrpg_game').append(i.e);    
        
        });
    
    }, 

    update: function() {
    
        if (this.layers == null) {
        
            this.init();
        
        }
        
        // get the hero reference
        if (this.hero == null) {
        
            this.hero = EntityManager.hero();
        
        }
    
        if (!this.mapRendered || this.hero.MoveComponent.hasMoved) {
        
            // reset the local root based on the current 
            // character position
            // it's always the hero position minus half the screen 
            // width and height, as long as we don't implement a borderless
            // map rendering
            this.localRoot = { 
                x: this.hero.x - this.width / 2, 
                y: this.hero.y - this.height / 2
            };
        
            // render the map centered around the hero
            this.renderMap(Game.map, this.hero.x, this.hero.y);
        
        }
        
        // clear the objects layer
        this.layers.objects.clear();
        // clear the hit areas
        this.hitAreasList = [];
        
        // render the map objects
        _.each(EntityManager.stack, this.renderEntity, this);
        
        // render doged/damage info
        this.renderMessages();
        
        // optionally, render tooltips of dropped items
        this.layers.info.clear();

        if (this.showDroppedItemTooltips) {
        
            this.renderTooltips(EntityManager.stack.filter(function(i) { return i.item != undefined; }));
        
        }
    
    }, 
    
    write: function(type, value, src) {
    
        var color = '255,255,255', 
            local = this.toLocal(src.x, src.y);
        
        switch (type) {
        
            case 'damage-1': 
            
                color = '234,139,26';
            
                break;
            
            case 'damage-2':
            
                color = '234,60,26';
                
                break;
        
        }
    
        this.messages.push({ color: color, text: value, x: local.x, y: local.y - 100, ts: +new Date() });
    
    }, 
    
    renderMessages: function() {
    
        this.layers.messages.clear();
        
        _.each(this.messages, function(i) {
        
            var time = +new Date() - i.ts;
        
            this.layers.messages.text(i.x, i.y - (time / 2000 * 500), i.text, 'rgba(' + i.color + ',' + (1 - time / 2000) + ')');
        
            if (time > 2000) {
            
                this.messages.remove(i);
            
            }
        
        }, this);
    
    }, 
    
    renderTooltips: function(list) {
        
        _.each(list, function(i) {
        
            var color = colorByItemRank(i.item).hex, 
                local = this.toLocal(i.x, i.y);
        
            this.layers.info.textbox(local.x - i.width / 2 - 15, local.y - i.height - 5, i.displayName(), 'rgba(100,100,100,0.8)', color);
        
        }, this);    
    
    }, 
    
    toLocal: function(x, y) {
    
        return {
            x: x - this.localRoot.x, 
            y: y - this.localRoot.y
        };
    
    },
    
    toGlobal: function(x, y) {
    
        return {
            x: x + this.localRoot.x, 
            y: y + this.localRoot.y
        };
    
    },   

    prerenderMap: function(map) {

        var totalWidth = map.width * this.tileWidth, 
            totalHeight = map.height * this.tileHeight, 
            shardSize = 6400, 
            shardTilesH = shardSize / this.tileWidth, 
            shardTilesV = shardSize / this.tileHeightHalf,
            texture = TextureSystem.textures[map.theme],   
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
                
                for (j = 0; j < tilesV; j++) {
                
                    for (k = 0; k < tilesH; k++) {
                    
                        this.renderTile(ctx, j, k, texture);
                    
                    }
                
                }
            
            }           
        
        }
    
    }, 

    renderMap: function(map, gCenterX, gCenterY) {
    
        var sx = gCenterX - this.width / 2, 
            sy = gCenterY - this.height / 2;
    
        if (this.mapCache == null) {
        
            this.prerenderMap(map);
        
        }
        
        // render the map to the given context
        // centered around the character
        this.layers.map.clear();
        
        this.layers.map.ctx.drawImage(this.mapCache[0], sx, sy, this.width, this.height, 0, 0, this.width, this.height);
    
    },
    
    renderEntity: function(e) {

        if (!e.RenderComponent) {
        
            return;
        
        }

        var layer = this.layers[e.RenderComponent.layer];

        // set all position values based on the current 
        // rendered map part root
        e.RenderComponent.localize(this.localRoot);
        
        if (TextureSystem.textures[e.RenderComponent.texture]) {
        
            layer.ctx.drawImage(
                // texture
                TextureSystem.textures[e.RenderComponent.texture], 
                // texture offset x
                e.RenderComponent.offsetX, 
                // texture offset y
                e.RenderComponent.offsetY, 
                // target width
                e.width, 
                // target height
                e.heigth, 
                // position x
                e.RenderComponent.x, 
                // position y
                e.RenderComponent.y, 
                // source width
                e.width, 
                // source height
                e.height
            );
        
        } else {
        
            TextureSystem.load(e.RenderComponent.texture, 'tex/' + e.RenderComponent.texture + '.png', e.RenderComponent.useMirroredSprites);    
        
        }
        
        // hit areas
        if (e.RenderComponent.drawHitArea) {
        
            this.drawHitArea(e._id, e.RenderComponent.hitArea);    
        
        }
        
        // health bars
        if (this.drawHealthbars && e.HealthComponent) {
        
            l.bar(
                e.RenderComponent.x - 50, 
                e.RenderComponent.y, 
                100, 
                10, 
                e.HealthComponent.current / e.HealthComponent.total, 
                'rgba(0,0,0,0.75)', 
                'rgba(200,0,0,1)', 
                Math.floor(e.HealthComponent.current) + '/' + Math.floor(e.HealthComponent.total), 
                'Arial 6px', 
                '#fff'
            );    
        
        }
    
    }, 
    
    drawHitArea: function(id, hitArea) {
    
        this.hitAreasList.push([hitArea.x, hitArea.y, hitArea.x2, hitArea.y2, id]);
        
    }, 

    objectAtPosition: function(x, y) {
    
        var id = 0;
    
        for (var i = 0; i < this.hitAreasList.length; i++) {
        
            if (x >= this.hitAreasList[i][0] && x <= this.hitAreasList[i][2] && y >= this.hitAreasList[i][1] && y <= this.hitAreasList[i][3]) {
            
                id = this.hitAreasList[i][4];
                break;
            
            }    
        
        }
        
        if (id > 0) {
        
            return _.find(game.stack, function(i) { return i.id == id; });
        
        }
        
        return null;
    
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
    
    }, 
    
    renderTile: function(ctx, row, column, texture) {
    
        var x = column * this.tileWidth + (row % 2) * this.tileWidthHalf, 
            y = row * this.tileHeightHalf + this.tileHeightHalf;
        
        ctx.drawImage(texture, 64, 0, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);    
    
    }

}