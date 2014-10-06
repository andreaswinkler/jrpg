var Renderer = {

    tileWidth: 64, 
    tileHeight: 32, 
    tileWidthHalf: 32, 
    tileHeightHalf: 16, 

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
        
        $('#jrpg_game').html('');
        
        // add all canvas elements to dom
        _.each(this.layers, function(i) {
        
            $('#jrpg_game').append(i.e);    
        
        });
    
    }, 
    
    initMap: function(map) {
    
        // prerender the new map
        this.prerenderMap(map);
        
        // init the minimap
    
    }, 

    update: function() {
    
        if (this.layers == null) {
        
            this.init();
        
        }
    
        if (!this.mapRendered) {
        
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
            this.renderMap(JRPG.map, JRPG.hero.x, JRPG.hero.y);
        
        }
        
        // clear the objects layer
        this.layers.objects.clear();

        // render the map objects
        _.each(JRPG.map.stack, this.renderEntity, this);
        
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
            texture = TextureSystem.textures[map.theme].c,   
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
    
    // converts a rotation value to the corresponding row in the sprite 
    // sheet. The sheet contains rotations in the following order:
    // up, up-right, right, down-right, down, down-left, left, up-left
    rotationToTextureRow: function(r, hero) {

        var rotDeg = r * (180 / Math.PI),  
            texRow = 0;

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
    
    // returns the correct frame within an animation based on the 
    // length of the animation and the elapsed time
    // also handles looping animations
    getAnimationFrame: function(tsStart, offset, frameCount, duration, loop) {
    
        var loop = loop || false, 
            ticks = +new Date() - tsStart, 
            animationTicks = duration * 1000,  
            ticksPerFrame = animationTicks / frameCount;
        
        // we don't loop and the animation has already passed
        // -> return the last frame
        if (!loop && ticks > animationTicks) {
        
            return offset + frameCount;
        
        }
        
        return offset + (Math.floor(ticks / ticksPerFrame) % frameCount);
    
    }, 
    
    // get the correct animation frame based on the current animation 
    // status of the entity
    animationToTextureCol: function(e) {
    
        var now = +new Date(), 
            ts = TextureSystem.textures[e.t].settings, 
            af = 0, 
            duration = 0,  
            as, asDuration;
    
        // the entity is dead, let's play the death animation 
        if (e.tsDeath) {
        
            as = ts.animations.death;
            tsStart = e.tsDeath;
        
        } 
        // the entity is attacking, let's play the corresponding attack 
        // animation
        else if (e.attack) {
        
            as = ts.animations[e.attack.type];
            tsStart = e.attack.tsStart;
        
        } 
        // the entity is moving, let's play the move animation
        else if (e.target) {
        
            as = ts.animations.move;
            tsStart = e.target.tsStart;   
        
        }
        
        
        // we could determine an animation settings object
        if (as) {
        
            // the animation settings describe a fixed value for the 
            // animation duration in seconds            
            if (as.duration) {
            
                duration = as.duration;
                                            
            } 
            // the animation settings specify an attribute of the entity 
            // which can be used to determine the animation duration
            // it is assumed that the mentioned attribute holds a speed 
            // value, therefore we calculate the duration: 1/x
            // e.g.: Speed = 2 (means two walk cycles per second), therefore 
            // the duration = 1/2 => 0,5s
            else if (as.durationAttribute && e[as.durationAttribute] != 0) {
            
                duration = 1 / e[as.durationAttribute];

            } 
            // the animation settings specify a method of the entity 
            // which can be used to determine the animation duration 
            // it is assumed that the mentioned attribute holds a speed 
            // value, therefore we calculate the duration: 1/x
            // e.g.: AttackSpeed = 2 (means 2 attacks per second), therefore 
            // the duration = 1/2 => 0,5s
            //
            // HINT: because this is the most expensive method to calculate the 
            // animation duration we should probably find another way
            else if (as.durationMethod) {
            
                asDuration = e[as.durationMethod].call(e);
            
                if (asDuration != 0) {
                
                    duration = 1 / e[as.durationMethod].call(e);
                
                }
            
            }

            af = this.getAnimationFrame(tsStart, as.offset, as.frameCount, duration, as.loop);

        }
        
        return af;
    
    },      
    
    renderInfo: function(e) {
    
        var info = {
            x: e.x - this.localRoot.x - e.w / 2,
            y: e.y - this.localRoot.y - e.h,
            ox: this.animationToTextureCol(e) * e.w, 
            oy: (e.tsDeath ? 8 : this.rotationToTextureRow(e.r, e.t == 'hero')) * e.h,
            tex: e.t 
        };
        
        return info;
    
    }, 
    
    renderEntity: function(e) {
    
        var layer = this.layers.objects, 
            ri = this.renderInfo(e),
            texture = TextureSystem.textures[ri.tex], 
            c = e.t == 'hero' ? 'rgba(255,255,255,.5)' : 'rgba(210,0,0,.8)'; 

        if (texture && texture.c) {
        
            layer.ctx.drawImage(
                // texture
                texture.c, 
                // texture offset x
                ri.ox, 
                // texture offset y
                ri.oy, 
                // target width
                e.w, 
                // target height
                e.h, 
                // position x
                ri.x, 
                // position y
                ri.y, 
                // source width
                e.w, 
                // source height
                e.h
            );
        
        } else {
        
            TextureSystem.load(ri.tex, 'tex/' + ri.tex + '.png', e.mirrorSprites);    
        
        }
        
        // health bars
        if (this.drawHealthbars && e.life) {
        
            l.bar(
                ri.x - 50, 
                ri.y, 
                100, 
                10, 
                e.life_c / e.life, 
                'rgba(0,0,0,0.75)', 
                'rgba(200,0,0,1)', 
                Math.floor(e.life_c) + '/' + Math.floor(e.life), 
                'Arial 6px', 
                '#fff'
            );    
        
        }
    
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