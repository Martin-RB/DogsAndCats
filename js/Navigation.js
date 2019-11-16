var Navigation = function(navigationContainer){
	var publics = {};
    var screenStack = [];
	var container = navigationContainer;

	publics.setContainer = function(cont){
		container = cont;
		return this;
	}

	publics.pushScreen = function(screen, data){
		var nowScreen = screen.setContainer(container)
							.setNavigation(this);
		if(data !== undefined){
			nowScreen = nowScreen.setData(data);
		}
		nowScreen = nowScreen.draw();
		screenStack.push(nowScreen);
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
		return this;
	}

	publics.goHome = function(){
		for (var i = screenStack.length - 1; i >= 1; i--) {
			publics.popScreen();
        }
        return this;
    }
    
    publics.setHome = function(controller, data){
        publics.popScreen();

        let nowScreen = screenStack.pop();
		if(nowScreen.onClose !== undefined){
			nowScreen.onClose();
        }

        publics.pushScreen(controller, data);

		return this;
    }


	return publics;
};