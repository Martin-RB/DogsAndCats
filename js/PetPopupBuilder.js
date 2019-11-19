define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    var popup = `<div class="full-pet">
                    <div class="full-pet-content">
                        <img src=":img:" >
                    </div>
                </div>`;
    var popupEntity = null;

    var setEvents = function(){
        console.log(popupEntity);
        popupEntity.off("click", ":not(img)");
        popupEntity.on("click", ":not(img)", function(){
            navigation.popScreen();
        })
    }

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
        var po = popup  .replace(":img:", data.image);
        popupEntity = $($.parseHTML(po));
        container.append(popupEntity);
        setEvents();
        return this;
    };

    publics.onClose = function(){
        popupEntity.remove();
        return this;
    };

    return publics;
});