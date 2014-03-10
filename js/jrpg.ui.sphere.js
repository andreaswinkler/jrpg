JRPG.UI.Sphere = function(obj, attribute) {

    this.e = null;
    this.eContent = null;
    this.eValue = null;
    
    this.ref = null;
    this.refAttribute = null;
    
    this.initSphere = function(obj, attribute) {
    
        this.ref = obj;
        this.refAttribute = attribute;
    
        this.e = $('<div class="sphere ' + attribute + '"><div class="sphere-content"></div><div class="sphere-value"></div></div>');
        
        this.eContent = this.e.find('.sphere-content');
        this.eValue = this.e.find('.sphere-value');
        
        this.ref.on('attributeChanged_' + this.refAttribute, this.refresh, this);
        this.ref.on('attributeChanged_' + this.refAttribute + '-current', this.refresh, this);
        
        this.refresh();
    
    };
    
    this.refresh = function() {
    
        var total = this.ref.attr(this.refAttribute), 
            current = this.ref.attr(this.refAttribute + '-current');
        
        this.eContent.css('height', (current / total * 100) + '%');
        this.eValue.html(current);
    
    };
    
    this.initSphere(obj, attribute);

}