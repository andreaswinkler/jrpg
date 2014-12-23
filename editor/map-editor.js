var ME = {

    e: null,
    
    scale: 1,
    
    tw: 0, 
    th: 0,  
    
    layers: {},   
    
    map: null,
    
    activeTile: 0,
    activeProxy: 0, 
    
    mode: 'select', 
    
    tiles: null,
    
    mouseDown: false, 
    
    objects: {
    
        proxy1: {
        
            name: 'Chest', 
            
            settings: {
            
                spawns: [{ value: 'random', name: 'Random' }, { value: 'always', name: 'Always' }], 
                droptable: [{ value: 'default', name: 'Default' }, { value: 'mycustomdroptable', name: 'My custom droptable' }]
            
            }
        
        }, 
        
        proxy2: {
        
            name: 'Landing Point',
            
            settings: {
            
            }
        
        }, 
        
        proxy3: {
        
            name: 'Spawn Point', 
            
            settings: {
            
                creatures: [{ value: 'random', name: 'Random' }, { value: 'hystrix', name: 'Hystrix' }], 
                amount: [{ value: '1', name: '1' }, { value: '2', name: '2' }, { value: '3', name: '3' }, { value: '4', name: '4' }, { value: '5', name: '5' }]
            
            }
        
        }
    
    },     

    init: function(e) {
    
        var w = $(window).width(), 
            h = $(window).height(), 
            s;
    
        this.e = e;  
        
        this.scale = $(window).width() / 1024;
        
        this.tw = Math.floor(64 * this.scale);
        this.th = Math.floor(32 * this.scale);
        
        _.each(['map', 'hilite', 'proxies'], function(i) {
        
            this.layers[i] = new RenderLayer(w, h);
            this.e.append(this.layers[i].e);
        
        }, this);
        
        this.renderGrid();
        
        s = localStorage.getItem('map');
        
        if (s != null) {
        
            try {
                
                this.map = JSON.parse(s);
            
            } catch (ex) {
            
            }
        
        }
        
        if (this.map == null) {
        
            this.map = { name: 'test', grid: this.emptyGrid(100, 100), proxies: [] };    
        
        } 
        
        this.onMapLoaded();
    
    },
    
    drawMap: function() {
    
        var i, pos;
        
        this.layers.map.clear();
        this.layers.proxies.clear();
        
        for (i = 0; i < this.map.grid.tiles.length; i++) {
        
            if (this.map.grid.tiles[i] > 0) {
        
                pos = this.indexToScreen(i);
                
                this.drawTile(this.map.grid.tiles[i], pos);
            
            }    
        
        }
        
        for (i = 0; i < this.map.proxies.length; i++) {
        
            pos = this.indexToScreen(this.map.proxies[i].index);
        
            this.drawProxy(this.map.proxies[i], pos);
        
        }
    
    }, 
    
    onMapLoaded: function() {
    
        this.tools();
        
        // load proxies
        var img = new Image();
        img.src = 'proxies.png';
        img.onload = function() {
        
            ME.proxies = this;
            
            // load tiles
            var img = new Image();
            img.src = '../tex/desert.png';
            img.onload = function() {
            
                ME.tiles = this;
                
                ME.handlers();
                
                ME.tools();
                
                ME.drawMap();    
            
            };
            
        
        };
    
    }, 
    
    tools: function() {
    
        var e = $('<div class="tools"></div>'), 
            i;
        
        e.append('<input type="button" value="draw" class="select-mode" data-mode="draw" />');
        e.append('<input type="button" value="select" class="select-mode" data-mode="select" disabled="disabled" />');
        e.append('<input type="button" value="delete" class="select-mode" data-mode="delete" />');
        
        for (i = 0; i < 10; i++) {
        
            e.append('<div class="sprite" style="background:url(../tex/desert.png) no-repeat -' + (i * 64) + 'px 16px" data-spriteid="' + (i + 1) + '"></div>');        
        
        }
        
        for (i = 0; i < 3; i++) {
        
            e.append('<div class="sprite proxy" style="background:url(proxies.png) no-repeat -' + (i * 64) + 'px 0px" data-proxyid="' + (i + 1) + '"></div>');
        
        }
        
        e.append('<input type="button" class="save" value="save map" />');
        
        this.e.append(e);
        
        this.e.find('.tools .sprite').click($.proxy(function(ev) {
        
            var e = $(ev.target);
        
            e.addClass('active').siblings().removeClass('active');
  
            if (e.hasClass('proxy')) {
            
                this.activeTile = 0;
                this.activeProxy = parseInt(e.attr('data-proxyid'));
            
            } else {
            
                this.activeTile = parseInt(e.attr('data-spriteid'));
                this.activeProxy = 0;
            
            }
            
            return false;
        
        }, this));
        
        this.e.find('.save').click($.proxy(function(ev) {
        
            localStorage.setItem('map', JSON.stringify(this.map));
            
            return false;
        
        }, this));
        
        this.e.find('.select-mode').click($.proxy(function(ev) {
        
            var e = $(ev.target);
            
            e.attr('disabled', 'disabled').siblings('.select-mode').removeAttr('disabled');
            
            this.mode = e.attr('data-mode');
            
            return false;
        
        }, this));
    
    }, 
    
    select: function(x, y) {
    
        var index = this.screenToIndex(x, y), 
            proxy = _.find(this.map.proxies, function(i) { return i.index == index; });
        
        if (proxy) {
        
            this.edit(proxy, this.objects['proxy' + proxy.proxyId]);
        
        }
    
    },
    
    delete: function(x, y) {
    
        var index = this.screenToIndex(x, y), 
            proxy = _.find(this.map.proxies, function(i) { return i.index == index; });
        
        if (proxy) { 
        
            if (confirm('Do you really want to delete this object?')) {

                this.map.proxies = _.filter(this.map.proxies, function(i) { return i.index != proxy.index; }); 

                this.drawMap();    
            
            }
        
        }   
    
    },  
    
    setting: function(key, setting, value) {
    
        var s = '';
        
        s += '<label>' + key + ':</label>';
        
        s += '<select class="setting" data-key="' + key + '">';
        
        _.each(setting, function(i) {
            
            s += '<option value="' + i.value + '"' + (i.value == value ? ' selected="selected"' : '') + '>' + i.name + '</option>';
            
        });
        
        s += '</select>';
        
        return s;
    
    }, 
    
    edit: function(obj, settings) {

        var dlg = $('<div class="dialog"></div>');
        
        dlg.get(0).obj = obj;
        
        dlg.append('<div class="title">' + settings.name + '</div>');
        dlg.append('<input type="button" class="close-dlg" value="X" />');
        
        _.each(settings.settings, function(i, key) {
            
            dlg.append(this.setting(key, i, obj[key]));
        
        }, this); 
        
        dlg.append('<input type="button" class="save-dlg" value="save" />'); 
        
        this.e.append(dlg);   
        
        this.e.find('.dialog .save-dlg').click($.proxy(function(ev) {
        
            var e = $(ev.target).closest('.dialog'), 
                obj = e.get(0).obj;

            e.find('.setting').each(function(ind, e) {
            
                var e = $(e);

                obj[e.attr('data-key')] = e.val();
            
            });
        
            $(ev.target).closest('.dialog').remove();
            
            this.drawMap();
        
        }, this));
        
        this.e.find('.dialog .close-dlg').click(function(ev) {
        
            $(ev.target).closest('.dialog').remove();    
        
        });
    
    }, 
    
    handlers: function() {
    
        this.e.click($.proxy(function(ev) {
        
            if (this.mode == 'draw') {
            
                this.setTile(ev.pageX, ev.pageY);
            
            } else if (this.mode == 'select') {
            
                this.select(ev.pageX, ev.pageY);
            
            } else if (this.mode == 'delete') {
            
                this.delete(ev.pageX, ev.pageY);
            
            }
        
        }, this));
        
        this.e.mousedown($.proxy(function(ev) {
        
            this.mouseDown = true;
        
        }, this));
        
        this.e.mouseup($.proxy(function(ev) {
        
            this.mouseDown = false;
        
        }, this));
        
        this.e.mousemove($.proxy(function(ev) {
        
            if (this.mode == 'draw' && this.mouseDown) {
            
                this.setTile(ev.pageX, ev.pageY);
            
            } else {
            
                this.hiliteTile(ev.pageX, ev.pageY);
            
            }
        
        }, this));    
    
    },  
    
    screenToIndex: function(x, y) {
    
        var xm = Math.round(x / this.tw + y / this.th), 
            ym = Math.round(-x / this.tw + y / this.th), 
            row = xm + ym, 
            col = Math.round(row % 2 ? (x - this.th) / this.tw : x / this.tw);
        
        return row * this.map.grid.w + col; 
    }, 
    
    indexToScreen: function(index) {
    
        var col = index % this.map.grid.w,
            row = Math.floor(index / this.map.grid.h),  
            x = col * this.tw, 
            y = row * (this.th / 2);
        
        if (row % 2 != 0) {
        
            x += (this.tw / 2);
        
        }
        
        x -= (this.tw / 2);
        y -= (this.th / 2);
        
        return [x, y];
    
    }, 
    
    drawTile: function(tileType, pos) {
    
        this.layers.map.image(this.tiles, (tileType - 1) * 64, 0, 64, 32, pos[0], pos[1], this.tw, this.th);    
    
    }, 
    
    drawProxy: function(proxy, pos) {
    
        var info = null;
        
        switch (proxy.proxyId) {
        
            case 3:
            
                if (proxy.amount) {
                
                    info = proxy.amount;
                
                }
            
                break;
        
        }
    
        this.layers.proxies.image(this.proxies, (proxy.proxyId - 1) * 64, 0, 64, 64, pos[0], pos[1] - this.th, this.tw, this.tw); 
        
        if (info) {
        
            this.layers.proxies.text(pos[0] + this.tw / 2, pos[1], info, 'rgba(210,210,210,1)', 'italic 24px Arial');
        
        }   
    
    },
    
    drawHilite: function(pos) {
    
        this.layers.hilite.clear().isoRect(pos[0], pos[1], this.tw, this.th, '#c10000', '#c10000');
        
        if (this.mode == 'draw' && this.activeProxy > 0) {
        
            this.layers.hilite.alpha(0.5).image(this.proxies, (this.activeProxy - 1) * 64, 0, 64, 64, pos[0], pos[1] - this.th, this.tw, this.tw).opaque();
        
        }
    
    },  
    
    setTile: function(x, y) {
    
        var index = this.screenToIndex(x, y), 
            pos = this.indexToScreen(index), 
            proxy;

        if (this.activeTile > 0) {

            this.map.grid.tiles[index] = this.activeTile;  
        
            this.drawTile(this.activeTile, pos);
        
        } else if (this.activeProxy > 0) {
        
            if (_.filter(this.map.proxies, function(i) { return i.index == index; }).length == 0) {
        
                proxy = { id: this.generateUUID(), proxyId: this.activeProxy, index: index };
        
                this.map.proxies.push(proxy);
                
                this.drawProxy(proxy, pos);
            
            }
        
        }  
    
    },
    
    hiliteTile: function(x, y) {
    
        var index = this.screenToIndex(x, y), 
            pos = this.indexToScreen(index);
        
        this.drawHilite(pos);
    
    },  
    
    emptyGrid: function(w, h) {
    
        var grid = {
                w: w, 
                h: h, 
                tiles: []
            },  
            length = w * h;
        
        while (grid.tiles.length < length) {
        
            grid.tiles.push(0);
        
        }
        
        return grid;
    
    }, 
    
    renderGrid: function(grid) {
    
        var l = new RenderLayer(this.tw, this.th);
    
        l.isoRect(0, 0, this.tw, this.th, '#fff', '#ddd');
        
        this.e.css('background-image', 'url(' + l.canvas.toDataURL() + ')'); 
    
    }, 
    
    generateUUID: function() {
    
        var d = performance.now(), 
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
    
        return uuid;

    }

}

$(document).ready(function() {

    ME.init($('body'));

});