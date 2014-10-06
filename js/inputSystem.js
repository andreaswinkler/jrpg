"use strict";

(function() {

    var InputSystem = {

        KeyCode: {
            ENTER: 13, 
            ESC: 27, 
            T: 84, 
            I: 73, 
            S: 83, 
            One: 49, 
            ALT: 18, 
            CTRL: 17, 
            SHIFT: 16,
            MOUSE_LEFT: -2,
            MOUSE_RIGHT: -1   
        }, 
        
        stack: [], 

        ctrl: false, 
        
        alt: false, 
        
        mouseX: 0, 
        
        mouseY: 0, 
        
        sequence: 0, 
        
        input: function(key, shifted) {
        
            var input = [], 
                mousePos = Renderer.toGlobal(this.mouseX, this.mouseY);
        
            input.push(++this.sequence);
            input.push(key);
            input.push(mousePos.x);
            input.push(mousePos.y);
            input.push(shifted || false);

            this.stack.push(input);
            
            switch (key) {
            
                case this.KeyCode.ALT:
                
                    this.alt = true;
                    
                    break;
            
                case this.KeyCode.CTRL:
                
                    this.ctrl = true;
                    
                    break;
            
            }
            
            return input;        

        },
        
        keyUp: function(key) {
        
            switch (key) {
            
                case this.KeyCode.ALT:
                
                    this.alt = false;
                    
                    break;
            
                case this.KeyCode.CTRL:
                
                    this.ctrl = false;
                    
                    break;
            
            }    
        
        }, 
        
        processInputs: function(inputs) {
        
            var i, actions = [];
            
            for (i = 0; i < inputs.length; i++) {

                switch (inputs[i][1]) {
                
                    case this.KeyCode.MOUSE_LEFT:

                        if (inputs[i][4]) {
                        
                            actions.push(['useSkill', 0]);
                        
                        } else {
                    
                            actions.push(['moveTo', inputs[i][2], inputs[i][3]]);
                        
                        }
                    
                        break;
                    
                    case this.KeyCode.MOUSE_RIGHT:
                    
                        actions.push(['useSkill', 1]);
                    
                        break;
                    
                    case this.KeyCode.One:
                    
                        actions.push(['useSkill', 2]);
                    
                        break;    
                
                }    
            
            }
            
            return actions;
        
        }, 
        
        updateStack: function(serverInputSequenceNo) {
        
            var i;
            
            for (i = 0; i < this.stack.length; i++) {
            
                if (this.stack[i][0] <= serverInputSequenceNo) {
                
                    this.stack.splice(i, 0);
                    i--;
                
                }
            
            }
        
        }
  
    }

    if (typeof module !== 'undefined') {
    
        module.exports = InputSystem;
    
    } else {
    
        window.InputSystem = InputSystem;
    
    }

}).call(this);