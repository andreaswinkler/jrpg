/* 
** 2014/01/20
*/
JRPG.UI.Dialog = function(key, width, data) {

    this.key = key;
    this.data = data;
    
    // create new mask
    this.mask = $('<div class="mask"></div>');
    $('body').append(this.mask);
    
    // create new dialog container and append to
    // document body
    this.e = $('<div class="dialog"></div>');
    this.e.width(width);
    
    $('body').append(this.e);
    
    // give the dialog container a reference to this 
    // dialog class instance
    this.e.get(0).ref = this;
    
    // load the contents of the dialog based on the key
    this.e.load('html/dialogs/' + key + '.html?' + Math.random(), $.proxy(function(t) {
        
        this._center();                
    
    }, this));   
    
    /*
    ** PRIVATE
    ** center the dialog based upon its contents
    */
    this._center = function() {
    
        var w = this.e.outerWidth(), 
            h = this.e.outerHeight();
        
        this.e.css('marginTop', '-' + (h / 2) + 'px').css('marginLeft', '-' + (w / 2) + 'px');  
    
    };
    
    /*
    ** PRIVATE
    ** remove the dialog instance from the DOM
    ** used by cancel and close    
    */    
    this._remove = function() {
    
        // remove dialog and mask
        this.e.remove();
        this.mask.remove();    
    
    };
    
    /*
    ** closes the dialog and calls the onCancel callback if available
    ** used to indicate a cancellation by the user    
    */  
    this.cancel = function() {
    
        this._remove();
    
        if (this.data.onCancel) {
        
            this.data.onCancel(this);
        
        }
    
    };
    
    /*
    ** closes the dialog and calls the onClose callback if available
    */    
    this.close = function() {
    
        this._remove();
        
        if (this.data.onClose) {
        
            this.data.onClose(this.data);
        
        }
    
    };

}