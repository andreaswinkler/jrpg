var Renderer = {

    showDroppedItemTooltips: false, 
    drawHealthBars: true, 
    localRoot: { x: 0, y: 0 }, 
    scene: null, 
    camera: null,
    renderer: null, 
    renderMethod: null,
    width: 0, 
    height: 0,
    map: null,    

    init: function() {
    
        this.resize();
    
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 0.1, 1000 );
        //this.camera = new THREE.OrthographicCamera(0, this.width, 0, this.height, 1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);

        $('#jrpg_game').append(this.renderer.domElement);
        
        var axisHelper = new THREE.AxisHelper( 5 );
        this.scene.add( axisHelper );
        
        this.camera.lookAt(this.scene.position);
        
        this.camera.position.z = 30;
        this.camera.position.x = 5;
        this.camera.position.y = 5;
        
        this.renderMethod = $.proxy(this.render, this);
    
        this.render();
    
    },
    
    resize: function() {
    
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    
    },  
    
    render: function() {
    
        requestAnimationFrame(this.renderMethod);
        
        this.renderer.render(this.scene, this.camera);
    
    }, 

    initMap: function(map) {
    
    },
    
    createMap: function(map) {
    
        var geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle. 
        var vertexPositions = [ 
        	[-1.0, -1.0,  1.0],
        	[ 1.0, -1.0,  1.0],
        	[ 1.0,  1.0,  1.0],
        
        	[ 1.0,  1.0,  1.0],
        	[-1.0,  1.0,  1.0],
        	[-1.0, -1.0,  1.0]
        ];
        var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex
        
        // components of the position vector for each vertex are stored
        // contiguously in the buffer.
        for ( var i = 0; i < vertexPositions.length; i++ )
        {
        	vertices[ i*3 + 0 ] = vertexPositions[i][0];
        	vertices[ i*3 + 1 ] = vertexPositions[i][1];
        	vertices[ i*3 + 2 ] = vertexPositions[i][2];
        }
        
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        var mesh = new THREE.Mesh( geometry, material );
        
        //this.scene.add(mesh);
        
        this.map = mesh;
    
    }, 
    
    renderMap: function(map, x, y) {
    
        if (!this.map) {
        
            this.createMap(map);    
        
        }
    
    },  
    
    update: function() {
    
        if (!this.scene) {
        
            this.init();
        
        }
        
        this.localRoot = { 
            x: JRPG.hero.x - this.width / 2, 
            y: JRPG.hero.y - this.height / 2
        };
        
        this.renderMap(JRPG.map, JRPG.hero.x, JRPG.hero.y);
        
        _.each(JRPG.map.stack, this.renderEntity, this);
    
    }, 
    
    createEntity: function(e) {
    
        var geometry = new THREE.BoxGeometry(1, 1, 1), 
            material = new THREE.MeshBasicMaterial( { color: e.t == 'hero' ? 0x00ff00 : 0xff0000 } ), 
            cube = new THREE.Mesh(geometry, material);
        
        this.scene.add(cube);
        
        return cube;    
    
    }, 
    
    renderEntity: function(e) {
    
        var pos = this.localize([e.x, e.y]);
    
        if (!e._3d) {
        
            e._3d = this.createEntity(e);        
        
        }
        
        //e._3d.position.x = pos[0] / 100;
        //e._3d.position.y = pos[1] / 100;
    
    }, 
    
    localize: function(arr) {
    
        // rect
        if (arr.length == 4) {
        
            return [
                arr[0] - this.localRoot.x, 
                arr[1] - this.localRoot.y, 
                arr[2] - this.localRoot.x, 
                arr[3] - this.localRoot.y 
            ];
        
        }
        // position
        else {
        
            return [
                arr[0] - this.localRoot.x,
                arr[1] - this.localRoot.y
            ]    
        
        }
    
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
    
    }    
  

}