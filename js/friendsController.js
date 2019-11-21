define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

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
        container.load("screens/friends.html", function(){

        });
        return this;
    };

    publics.onClose = function(){
        return this;
    };

    return publics;
});