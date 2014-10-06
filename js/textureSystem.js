/*
*  2014/3/16
*/
var TextureSystem = {

    textures: {
        hero: { 
            settings: {
                animations: {
                    death: {
                        offset: 0, 
                        frameCount: 6, 
                        duration: 2,
                        loop: false
                    },
                    move: {
                        offset: 1,
                        frameCount: 12,
                        durationAttribute: 'speed_c',
                        loop: true 
                    },
                    bash: {
                        offset: 14, 
                        frameCount: 8,
                        durationMethod: 'attackSpeed',
                        loop: false
                    }
                }
            }
        },
        hystrix: {
            settings: {
                animations: {
                    death: {
                        offset: 0, 
                        frameCount: 6, 
                        duration: 2,
                        loop: false    
                    },
                    move: {
                        offset: 1,
                        frameCount: 12,
                        durationAttribute: 'speed_c',
                        loop: true     
                    }
                }
            }
        }    
    }, 
    
    // for right side of character
    // this is flipped for down-left, left and up-left
    equipmentTexturesOrder: ['offhand1', 'weapon1'],

    load: function(key, path, createMirrors, callback, args) {
    
        if (key != 'undefined') {
    
            if (key.indexOf('_complete') !== -1) {
            
                if (key.indexOf('hero')) {
                
                    this.character(EntityManager.hero());
                
                }    
            
            } else {
    
                console.log('load texture <' + key + '> from <' + path + '>. create mirrors: ' + (createMirrors ? 'yes' : 'no'));
            
                var img = new Image();
                img.key = key;
                img.callback = callback;
                img.args = args;
                img.createMirrors = createMirrors;
                img.onload = function() {
        
                    console.log('texture <' + this.key + '> loaded.');
        
                    if (!TextureSystem.textures[this.key]) {
                    
                        TextureSystem.textures[this.key] = {};    
                    
                    }
        
                    if (this.createMirrors) {
                    
                        var canvas = document.createElement('canvas'), 
                            ctx = canvas.getContext('2d'), 
                            rowHeight = this.height / 5;
                        
                        canvas.width = this.width;
                        canvas.height = this.height + rowHeight * 3;
                        
                        ctx.drawImage(this, 0, 0);
                        ctx.translate(this.width, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(this, 0, 3 * rowHeight, this.width, rowHeight, 0, this.height, this.width, rowHeight);
                        ctx.drawImage(this, 0, 2 * rowHeight, this.width, rowHeight, 0, this.height + rowHeight, this.width, rowHeight);
                        ctx.drawImage(this, 0, rowHeight, this.width, rowHeight, 0, this.height + 2 * rowHeight, this.width, rowHeight);
                        
                        TextureSystem.textures[this.key].c = canvas;
                    
                    } else {
                    
                        TextureSystem.textures[this.key].c = this;
                    
                    }
                    
                    if (this.callback) {
                        
                        this.callback.apply(this, this.args);
                    
                    }
                
                }
                img.src = path;
            
            }
        
        }
    
    }, 
    
    loadMapTextures: function(map, callback) {
    
        var keys = [], 
            key;
        
        if (!this.textures[map.theme]) {
        
            keys.push(map.theme);
        
        }
        
        _.each(map.stack, function(i) {
        
            if (i.type == 'lootable' && !this.textures[i.settings.type] && keys.indexOf(i.settings.type) == -1) {
            
                keys.push(i.settings.type);
            
            }    
        
        }, this);
    
        if (keys.length > 0) {
        
            key = keys.shift();
            
            this.load(key, 'tex/' + key + '.png', false, $.proxy(this.loadMapTextures, this), [map, callback]);
        
        } else {
        
            callback();
        
        }  
    
    }, 
    
    character: function(character, callback) {
    
        var keys = [], 
            key, canvas, tex, ctx, 
            equipment = character.EquipmentComponent.getList();
        
        if (!this.textures[character.type]) {
        
            keys.push(character.type);
        
        }
        
        _.each(equipment, function(i) {
        
            if (!this.textures[i.type]) {
            
                keys.push(i.type);
            
            }
        
        }, this); 

        if (keys.length > 0) {
        
            key = keys.shift();
            
            this.load(key, 'tex/' + key + '.png', true, $.proxy(this.character, this), [character, callback, loadingBar]);
        
        } 
        // all textures are loaded, we can stack the hero now
        else {
        
            tex = this.textures[character.type];
            canvas = document.createElement('canvas');
            canvas.width = tex.width;
            canvas.height = tex.height;
            ctx = canvas.getContext('2d');
            
            ctx.drawImage(tex, 0, 0);
            
            _.each(this.equipmentTexturesOrder, function(i) {
  
                if (equipment[i] != null) {
                
                    tex = this.textures[equipment[i].type];
                    
                    ctx.drawImage(tex, 0, 0);
                
                }
            
            }, this);
            
            this.textures[character.type + '_complete'] = canvas;
            
            callback();
        
        }  
    
    }

}
