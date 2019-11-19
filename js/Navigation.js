var Navigation = function(navigationContainer){
	var publics = {};
    var screenStack = [];
	var container = navigationContainer;

	var onchange = undefined;

	publics.setContainer = function(cont){
		container = cont;
		return this;
	}

	publics.pushScreen = function(screen, data){
		if(screenStack.length > 0){
			var lastScreen = screenStack[screenStack.length - 1];
			if(lastScreen.onSuspend){
				lastScreen.onSuspend();
			}
		}
		var nowScreen = screen.setContainer(container)
		.setNavigation(this);
		if(data !== undefined){
			nowScreen = nowScreen.setData(data);
		}
		nowScreen = nowScreen.draw();
		screenStack.push(nowScreen);
		if(onchange){
			onchange();
		}
		return this;
	}

	publics.popScreen = function(data){
		var nowScreen = screenStack.pop();
		if(nowScreen.onClose !== undefined){
			nowScreen.onClose();
		}

		nowScreen = screenStack[screenStack.length - 1];
		if(data !== undefined){
			nowScreen = nowScreen.setData(data);
		}
		nowScreen = nowScreen.draw();
		if(onchange){
			onchange();
		}
		return this;
	}

	publics.goHome = function(){
		for (var i = screenStack.length - 1; i >= 1; i--) {
			publics.popScreen();
        }
		if(onchange){
			onchange();
		}
        return this;
    }
    
    publics.setHome = function(controller, data){
		publics.goHome();
		
        let nowScreen = screenStack.pop();
		if(nowScreen.onClose !== undefined){
			nowScreen.onClose();
        }
		
        publics.pushScreen(controller, data);
		
		if(onchange){
			onchange();
		}
		return this;
	}

	publics.hasLeft = function(){
		console.log(screenStack.length);
		return screenStack.length > 1;
	}
	publics.setOnchange = function(c){
		onchange = c;
	}

	return publics;
};