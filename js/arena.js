var Arena = {

    timer: null, 

    start: function() {
    
        // start the arena timer
        this.timer = new Timer();
        this.timer.start();
        
        // activate all arena spawnpoints
        // let them spawn creatures
        
        // bind to entityManager
        EventManger.subscribe(EntityManager, 'lastCreatureKilled', this.spawnBoss, this);
    
    },
    
    spawnBoss: function() {
    
        // spawn the arena boss
        var boss = EntityManager.create(bossBlueprint);
        
        // bind to boss
        EventManager.subscribe(boss, 'entityDestroyed', this.finish, this);
    
    },
    
    finish: function() {
    
    
    }

}