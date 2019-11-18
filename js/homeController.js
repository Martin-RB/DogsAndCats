define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    var setEvents = function(){
        container.on("click", ".pet-img", function(){
            var src = this.src ;
            require(["PetPopupBuilder"], function(Pet){
                navigation.pushScreen(Pet, {image: src});
            });
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
        container.load("screens/home.html", function(){
            setEvents();
            $(".petspace").html("");
            for (let i = 0; i < 25; i++) {
                add();                
            }
            require(["PetPopupBuilder"], function(Pet){
                navigation.pushScreen(Pet, {image: "https://images.dog.ceo/breeds/collie-border/n02106166_6545.jpg"});
            })
        });
        return this;
    };

    publics.onClose = function(){
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