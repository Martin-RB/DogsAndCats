<<<<<<< HEAD
define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // Fields
    var username_ = null;
    var password_ = null;


    // Screen funcs
    publics.setContainer = function(cont){
        container = cont;
        return this;
    };
    
    publics.setNavigation = function(nav){
        navigation = nav;
        return this;
    };
    
    publics.setData = function(dat){
        data = dat;
        return this;
    };
    
    publics.draw = function(){
        container.load("screens/logout.html", function(){

        });
        return this;
    };
    
    publics.onClose = function(){
        return this;
    };
    return publics;
=======
define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // Fields
    var username_ = null;
    var password_ = null;


    // Screen funcs
    publics.setContainer = function(cont){
        container = cont;
        return this;
    };
    
    publics.setNavigation = function(nav){
        navigation = nav;
        return this;
    };
    
    publics.setData = function(dat){
        data = dat;
        return this;
    };
    
    publics.draw = function(){
        container.load("screens/logout.html", function(){

        });
        return this;
    };
    
    publics.onClose = function(){
        return this;
    };
    return publics;
>>>>>>> 2d041993d38b322b24817da82c0bf58feeb8780c
});