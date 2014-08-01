/*
** DAMAGE COMPONENT
**
** It handles the outgoing damage. If an entity has no damage component
** it can't deal damage. Here we hold the basic damage related attributes 
** like min/max damage, critical hit chance and damage, etc. 
**
** The attributes are re-calculated each time the refresh method is called. 
** This happens when an item is equipped or unequipped or the active 
** weapon slot is toggled.
**
** The getDamage method retuns a random damage object that contains the 
** actual damage, the type of damage (normal, critical, crushing blow). This
** damage is then applied to the target entity.
*/
var DamageComponent = function(entity, settings) {
    
    // we hold a reference to our entity
    this._e = entity;
    
    // we keep the basic settings, because we need 'em as base for
    // re-calculating the attributes
    this._settings = settings;

    // when damage is dealt there is a chance for critical hits
    // critical hits deal at least double the normal damage, the damage
    // is further increased by +criticalHitDamage items
    this.criticalHitChance = settings.criticalHitChance || 0;
    
    // the critical hit damage defaults to +100% of the normal damage
    // if items are equipped that increase the critical hit damage, those
    // values are added to this attribute
    this.criticalHitDamage = settings.criticalHitDamage || 1;
    
    // there is also a chance for crushing blow on each attack 
    // a crushing blow reduces the target entities health by 25% of 
    // it's current value
    this.crushingBlowChance = settings.crushingBlowChance || 0;;
    
    // here we store the minimum damage value. For creatures this normally
    // is a fixed value, otherwise it greatly depends on the items equipped
    this.minimumDamage = settings.minimumDamage || 0;
    
    // the maximum damage value works the same as the minimum one
    this.maximumDamage = settings.maximumDamage || 0;

    /*
    ** The refresh method is used to re-calculate all attributes after a
    ** change to the equipment or the entity itself    
    */    
    this.refresh = function() {
    
        this.criticalHitChance = this._settings.criticalHitChance || 0;
        this.criticalHitDamage = this._settings.criticalHitDamage || 1;
    
        this.crushingBlowChance = this._settings.crushingBlowChance || 0;;
    
        this.minimumDamage = this._settings.minimumDamage || 0;
        this.maximumDamage = this._settings.maximumDamage || 0;
        
        if (this._e.EquipmentComponent) {
        
            this.criticalHitChance += this._e.EquipmentComponent.sum('criticalHitChance');
            this.criticalHitDamage += this._e.EquipmentComponent.sum('criticalHitDamage');
            this.crushingBlowChance += this._e.EquipmentComponent.sum('crushingBlowChance');
            this.minimumDamage = this._e.EquipmentComponent.sum('minimumDamage');
            this.maximumDamage = this._e.EquipmentComponent.sum('maximumDamage');
        
        }
    
    }

    /*
    ** returns a damage value based on min/max damage, equipped items, 
    ** chance for critical hits and crushing blow    
    */    
    this.getDamage = function() {
    
        var damage = {
              damage: 0, 
              rank: DamageComponent.DAMAGE_RANK_NORMAL,  
              src: this._e
            }, 
            dmg = this.randomDamage(), 
            critChance = this.criticalHitChance, 
            crushingBlowChance = this.crushingBlowChance,  
            r = Math.random();
        
        if (r <= crushingBlowChance) {
        
            damage.rank = DamageComponent.DAMAGE_RANK_CRUSHING_BLOW;
        
        } else if (r <= critChance) {
        
            damage.rank = DamageComponent.DAMAGE_RANK_CRITICAL;
            
            dmg += dmg * this.criticalHitDamage;
        
        }
        
        damage.damage = dmg;
        
        return damage;        

    };
    
    /*
    ** returns a damage value based on min/max damage and strength value
    */
    this.randomDamage = function() {
    
        return this.applyStrengthModifier(_.random(this.minimumDamage, this.maximumDamage));
    
    };
    
    /*
    ** returns the average damage based on min/max damage and strength value
    */
    this.averageDamage = function() {
    
        return this.applyStrengthModifier((this.minimumDamage + this.maximumDamage) / 2);
    
    };
    
    /*
    ** modify a damage value by strengt
    */
    this.applyStrengthModifier = function(dmg) {
    
        var strength = this._e.StatsComponent != null ? this._e.StatsComponent.strength : 0;

        return dmg + dmg * strength / 100;
    
    }    
    
    /*
    ** returns the average damage per second
    */
    this.dps = function() {
    
        var dmg = this.averageDamage(), 
            critDmg = dmg * this.criticalHitDamage, 
            attackSpeed = this._e.AbilitiesComponent ? this._e.AbilitiesComponent.speed : 0;
        
        return (dmg + (attackSpeed * this.criticalHitChance * critDmg)) * attackSpeed;
    
    };               

}

DamageComponent.DAMAGE_RANK_NORMAL = 0;
DamageComponent.DAMAGE_RANK_CRITICAL = 1;
DamageComponent.DAMAGE_RANK_CRUSHING_BLOW = 2;