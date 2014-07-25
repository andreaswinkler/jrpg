/*
** handles incoming and outgoing damage
** an entity without damage component can't deal damage and 
** can't receive damagae
*/
var DamageComponent = function(entity, settings) {

    this.entity = entity;

    this.criticalHitChance = settings.criticalHitChance || 0;
    this.criticalHitDamage = settings.criticalHitDamage || 0;
    
    this.crushingBlowChance = settings.crushingBlowChance || 0;;
    
    this.minimumDamage = settings.minimumDamage || 0;
    this.maximumDamage = settings.maximumDamage || 0;

    /*
    ** returns a damage value based on min/max damage, equipped items, 
    ** chance for critical hits and crushing blow    
    */    
    this.getDamage = function() {
    
        var damage = {
              damage: 0, 
              rank: DamageComponent.DAMAGE_RANK_NORMAL,  
              src: this.entity
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
    
        var strength = this.entity.StatsComponent != null ? this.entity.StatsComponent.strength : 0;

        return dmg + dmg * strength / 100;
    
    }    
    
    /*
    ** returns the average damage per second
    */
    this.dps = function() {
    
        var dmg = this.averageDamage(), 
            critDmg = dmg * this.criticalHitDamage, 
            attackSpeed = this.entity.StatsComponent.attackSpeed;
        
        return (dmg + (attackSpeed * this.criticalHitChance * critDmg)) * attackSpeed;
    
    };               

}

DamageComponent.DAMAGE_RANK_NORMAL = 0;
DamageComponent.DAMAGE_RANK_CRITICAL = 1;
DamageComponent.DAMAGE_RANK_CRUSHING_BLOW = 2;