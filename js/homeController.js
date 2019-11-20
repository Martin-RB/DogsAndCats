define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // fields 
    var login_btn = null;
    var register_btn = null;
    var petSpace = null;
    var friends_open = null;
    var friend_menu = null;

    var friendIcon_back = `<i class="fas fa-arrow-circle-right"></i>`;
    var friendIcon_icon = `<i class="fas fa-user-friends"></i>`;
    var restore = null;
    var idUser = -1;

    // 0 = closed
    // 1 = open
    var friendState = 0;

    var findFields = function(){
        login_btn = container.find("#login_btn");
        register_btn = container.find("#register_btn");
        petSpace = container.find("#petSpace");
        friends_open = container.find("#friends_open");
        friend_menu = container.find("#friend_menu");
    }

    var setEvents = function(){
        container.off("click", ".pet-img");
        container.on("click", ".pet-img", function(){
            var src = this.src ;
            require(["PetPopupBuilder"], function(Pet){
                navigation.pushScreen(Pet, {image: src});
            });
        });
        register_btn.click(function(){
            require(["registerController"], function(Register){
                navigation.pushScreen(Register);
            });
        });
        friends_open.click(function(){
            if(friendState == 0){
                friendState = 1;
                friend_menu.animate({right: 0}, 200);
            }
            else if (friendState == 1){
                friendState = 0;
                friend_menu.animate({right: "-16vw"}, 200);
            }
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
        if(restore != null){
            container.html(restore);
            restore = null;
            findFields();
            setEvents();
        }
        else{
            container.load("screens/home.html", function(){
                findFields();
                setEvents();
                getPets();
                
                /*petSpace.html("");
                for (let i = 0; i < 25; i++) {
                    switch(state){
                        case 0: getBoth()
                            break;
                        case 1: getDogs()
                            break;
                        case 2: getCats()
                            break;
                    }
                }*/
                /* require(["PetPopupBuilder"], function(Pet){
                    navigation.pushScreen(Pet, {image: "https://images.dog.ceo/breeds/collie-border/n02106166_6545.jpg"});
                }) */
            });
        }
        return this;
    };

    publics.onSuspend = function(){
        restore = container.find(">div");
    }

    publics.onClose = function(){
        restore = null;
        return this;
    };

    var getPets = function(petType="random", owenership="all", own_id=-1){

        // 0 = random
        // 1 = dogs
        // 2 = cats
        //var petType = 0;

        // 0 = all
        // 1 = mine
        // 2 = other
        //var owenership = 0;
        //var own_id = -1;

        petSpace.html("");
        $.ajax({
            type: "get",
            url: `http://localhost:6969/images/${petType}/${owenership}/${own_id}`,
            dataType: "json",
            success: function(data){
                data.forEach(url => {
                    addElement(url);
                });
            }
        })
    }

    var getDog = function(){
        $.ajax({
            type: "get",
            dataType: "json",
            url : "https://dog.ceo/api/breeds/image/random",
            success: function(data){
                addElement(data.message);
            }
        })
    }

    var getCat = function(){
        $.ajax({
            type: "get",
            dataType: "json",
            url : "https://api.thecatapi.com/v1/images/search",
            success: function(data){
                addElement(data[0].url)
            }
        });
    }

    var getBoth = function(){
        var rand = Math.round(Math.random() * 100);
        if(rand >= 50){
            getDog();
        }
        else{
            getCat();
        }
    }

    var addElement = function(url){
        var el = 
                        `<div class="pet-el">
                            <img class="pet-img" src=":img:" alt="Nop"  >
                            <div class="pet-foot">
                                <span class="heart"><i class="fas fa-heart"></i></span>
                                <p class="counter">100k favs</p>
                            </div>
                        </div>`;
                $(".petspace").append(el.replace(":img:", url));
    }

    return publics;
});