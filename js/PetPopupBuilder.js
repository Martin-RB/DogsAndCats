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
        popupEntity.on("click", ":not(img)", function(){
            popupEntity.remove();
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

    var add = function(){
        $.ajax({
            type: "get",
            url : "https://dog.ceo/api/breeds/image/random",
            success: addElement
        })
    }

    var addElement = function(dat){
        var el = 
                        `<div class="pet-el">
                            <img class="pet-img" src=":img:" alt="Nop"  >
                            <div class="pet-foot">
                                <span class="heart"><i class="fas fa-heart"></i></span>
                                <p class="counter">100k favs</p>
                            </div>
                        </div>`;
                $(".petspace").append(el.replace(":img:", dat.message));
    }

    return publics;
});