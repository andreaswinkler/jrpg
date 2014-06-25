JRPG.Renderer = {

    tileWidth: 64, 
    tileHeight: 32, 
    tileWidthHalf: 32, 
    tileHeightHalf: 16, 

    mapCache: null, 
    
    layers: {},
    
    hitAreasList: [],

    width: 0, 
    height: 0, 
    
    showDroppedItemTooltips: false, 

    messages: [], 
    
    mapRendered: false, 

    init: function() {
    
        this.width = $(window).width(), 
        this.height = $(window).height();
        
        // remove canvas elements
        _.each(this.layers, function(i) {
        
            i.e.remove();    
        
        });
        
        this.layers = {
            map: new JRPG.RenderLayer(this.width, this.height), 
            objects: new JRPG.RenderLayer(this.width, this.height),
            messages: new JRPG.RenderLayer(this.width, this.height),  
            info: new JRPG.RenderLayer(this.width, this.height)
        };
        
        // add all canvas elements to dom
        _.each(this.layers, function(i) {
        
            $('#jrpg_game').append(i.e);    
        
        });
    
    }, 

    update: function(map, stack) {
    
        if (!this.mapRendered || JRPG.hero.hasMoved) {
        
            // reset the local root based on the current 
            // character position
            // it's always the hero position minus half the screen 
            // width and height, as long as we don't implement a borderless
            // map rendering
            this.localRoot = { 
                x: JRPG.hero.x - this.width / 2, 
                y: JRPG.hero.y - this.height / 2
            };
        
            // render the map centered around the hero
            this.renderMap(map, JRPG.hero.x, JRPG.hero.y);
        
        }
        
        // clear the objects layer
        this.layers.objects.clear();
        // clear the hit areas
        this.hitAreasList = [];
        
        // render the map objects
        _.each(stack, this.renderObject, this);
        
        // render doged/damage info
        this.renderMessages();
        
        // optionally, render tooltips of dropped items
        this.layers.info.clear();

        if (this.showDroppedItemTooltips) {
        
            this.renderTooltips(stack.filter(function(i) { return i.item != undefined; }));
        
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
        
            var color = JRPG.colorByItemRank(i.item).hex, 
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
            texture = JRPG.Textures.textures[map.theme],   
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
        
            this.prerenderMap(map.map);
        
        }
        
        // render the map to the given context
        // centered around the character
        this.layers.map.clear();
        
        this.layers.map.ctx.drawImage(this.mapCache[0], sx, sy, this.width, this.height, 0, 0, this.width, this.height);
    
    },
    
    renderObject: function(obj) {

        var local = this.toLocal(obj.x, obj.y), 
            x = local.x - obj.width / 2, 
            y = local.y - obj.height, 
            texture = obj.equipment && obj.equipment != null ? obj.type + '_complete' : obj.type, 
            textureRow = obj.tsDeath > 0 ? 5 : (!(obj instanceof JRPG.Projectile) && obj.rotation ? this.rotationToTextureRow(obj.rotation) : 0), 
            sy = textureRow * obj.height, 
            col = 0, 
            animation, result, sx, l, lifeCurrent, lifeTotal;
        
        if (obj.item) {
        
            l = this.layers.map;
        
        } else {
        
            l = this.layers.objects;
        
        }
        
        if (obj.animation) {
        
            animation = obj.animation();

            if (animation) {
            
                result = animation.getFrame();
                
                col = result.frame;
                x += result.offsetX;
                y += result.offsetY;
            
            } else if ((obj.type == 'chest' || obj.type == 'grandchest') && obj.behavior('click') == null) {
        
                col = 6;    
            
            }
        
        }

        sx = col * obj.width;
        
        // check if we have texture for this object so we can render it
        if (JRPG.Textures.textures[texture]) {

            l.ctx.drawImage(JRPG.Textures.textures[texture], sx, sy, obj.width, obj.height, x, y, obj.width, obj.height);
        
        } 
        // otherwise we lazy-load the texture
        else {
        
            JRPG.Textures.load(texture, 'tex/' + texture + '.png', obj instanceof JRPG.Creature);
        
        }
        
        if (obj.type != 'hero' && !(obj instanceof JRPG.Projectile) && obj.tsDeath == 0) {
        
            this.drawHitArea(obj, x, y);
        
        }
        
        if (obj instanceof JRPG.Creature && obj.tsDeath == 0) {
        
            lifeCurrent = obj.attr('life-current');
            lifeTotal = obj.attr('life');
        
            l.bar(local.x - 50, y, 100, 10, lifeCurrent / lifeTotal, 'rgba(0,0,0,0.75)', 'rgba(200,0,0,1)', Math.floor(lifeCurrent) + '/' + Math.floor(lifeTotal), 'Arial 6px', '#fff');
        
        }
        
        _.each(obj.children, this.renderObject, this);
    
    }, 
    
    drawHitArea: function(obj, x, y) {
    
        this.hitAreasList.push([x, y, x + obj.width, y + obj.height, obj.id]);
        
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
        
            return _.find(JRPG.game.stack, function(i) { return i.id == id; });
        
        }
        
        return null;
    
    }, 
    
    rotationToTextureRow: function(r) {
    
        var rotDeg = _degrees(r),  
            texRow = 0, 
            mirror = 1;
  
        rotDeg = rotDeg < 0 ? rotDeg * -1 : 180 + (180 - rotDeg);
        
        if (rotDeg > 337.5 || rotDeg < 22.5) {
            texRow = 2;
        } else if (rotDeg < 67.5) {
            texRow = 1;
        } else if (rotDeg < 112.5) {
            texRow = 0;
        } else if (rotDeg < 157.5) {
            texRow = 7;
        } else if (rotDeg < 202.5) {
            texRow = 6;
        } else if (rotDeg < 247.5) {
            texRow = 5;
        } else if (rotDeg < 292.5) {
            texRow = 4;        
        } else if (rotDeg < 337.5) {
            texRow = 3;
        } 
        
        return texRow;       
    
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