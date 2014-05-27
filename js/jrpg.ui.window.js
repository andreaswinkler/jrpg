JRPG.UI.Window = function(title, options) {

    // the window title shown on the top center of the window
    this.title = '';
    // the configuration options for the window
    this.options = null;
    // the root dom element of the window
    this.e = null;

    this.initWindow = function(title, options) {
    
        this.title = title;
        this.options = $.extend({
            width: '600px', 
            position: 'left'
        }, options || {});
        
        this.e = $('<div class="window hidden ' + this.options.position + '"><div class="window-title">' + this.title + '</div><div class="window-close"></div><div class="window-content"></div><div class="window-tab-menu"></div></div>');
        this.e.css('width', this.options.width);
        
        // we always append windows to the jrpg_ui container
        $('#jrpg_ui').append(this.e);
        
        this.e.find('.window-close').click($.proxy(function(ev) {
        
            this.close();
        
        }, this));
    
    };
    
    this.close = function() {
    
        this.e.addClass('hidden');
    
    };
    
    this.show = function() {
    
        this.e.removeClass('hidden');
    
    };
    
    this.toggle = function() {
    
        this.e.toggleClass('hidden');
    
    };
    
    this.addTab = function(key, contents) {
    
        var first = this.e.find('.window-tab').length == 0, 
            tab = $('<div class="window-tab ' + key + (first ? '' : ' hidden') + '"></div>'), 
            btn = $('<div class="window-tab-menu-item ' + key + (first ? ' active' : '') + '" data-key="' + key + '"></div>');
    
        tab.append(contents);
    
        btn.click($.proxy(function(ev) {
        
            this.showTab($(ev.target).attr('data-key'));        
        
        }, this));
    
        this.e.find('.window-content').append(tab);
        this.e.find('.window-tab-menu').append(btn);
    
    };
    
    this.showTab = function(key) {
    
        this.e.find('.window-tab-menu-item').removeClass('active');
        this.e.find('.window-tab-menu-item.' + key).addClass('active');
    
        this.e.find('.window-tab').addClass('hidden');
        this.e.find('.window-content .' + key).removeClass('hidden');    
    
    };

    this.initWindow(title, options);

}