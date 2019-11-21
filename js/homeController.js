define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // fields 
    var login = null;
    var register = null;
    var petSpace = null;
    var friends_open = null;
    var friend_menu = null;
    var random_mixed_ = null;
    var random_dogs_ = null;
    var random_cats_ = null;
    var favorite_mixed_ = null;
    var favorite_dogs_ = null;
    var favorite_cats_ = null;
    var reroll_ = null;

    var friendIcon_back = `<i class="fas fa-arrow-circle-right"></i>`;
    var friendIcon_icon = `<i class="fas fa-user-friends"></i>`;
    var unliked_icon = `<i class="far fa-heart"></i>`;
    var liked_icon = `<i class="fas fa-heart"></i>`;
    var restore = null;

    // random
    // dogs
    // cats
    var petType = "random";

    // all
    // mine
    // other
    var owenership = "all";
    var own_id = -1;

    // 0 = closed
    // 1 = open
    var friendState = 0;

    var findFields = function(){
        login = container.find("#login");
        register = container.find("#register");
        petSpace = container.find("#petSpace");
        friends_open = container.find("#friends_open");
        friend_menu = container.find("#friend_menu");
        random_mixed_ = container.find("#random_mixed_");
        random_dogs_ = container.find("#random_dogs_");
        random_cats_ = container.find("#random_cats_");
        favorite_mixed_ = container.find("#favorite_mixed_");
        favorite_dogs_ = container.find("#favorite_dogs_");
        favorite_cats_ = container.find("#favorite_cats_");
        reroll_ = container.find("#reroll_");
    }

    var setEvents = function(){
        container.off("click", ".pet-img");
        container.on("click", ".pet-img", function(){
            var src = this.src ;
            require(["PetPopupBuilder"], function(Pet){
                navigation.pushScreen(Pet, {image: src});
            });
        });
        container.off("click", ".f_likePet");
        container.on("click", ".f_likePet", function(){
            var el = $(this);
            var src = el.data("src");
            var type = el.data("type");
            var liked = el.data("liked");

            if(liked === false){
                $.ajax({
                    type: "post",
                    url: connDir + `images/likePhoto`,
                    data: {
                        image: src,
                        type: type,
                    },
                    complete: (r)=>{
                        if(r.statusText == "OK"){
                            el.data("liked", !liked);
                            $(this).html(liked_icon);
                        }
                    }
                });
            }
            else{
                $.ajax({
                    type: "delete",
                    url: connDir + `images/likePhoto`,
                    data: {
                        image: src
                    },
                    complete: (r)=>{
                        if(r.statusText == "OK"){
                            el.data("liked", !liked);
                            $(this).html(unliked_icon);
                        }
                    }
                });
            }
        });
        login.click(function(){
            require(["loginController"], function(Register){
                navigation.pushScreen(Register);
            });
        });
        register.click(function(){
            require(["registerController"], function(Register){
                navigation.pushScreen(Register);
            });
        })
        friends_open.click(function(){
            if(friendState == 0){
                friendState = 1;
                friend_menu.animate({right: 0}, 200);
            }
            else if (friendState == 1){
                friendState = 0;
                friend_menu.animate({right: "-16vw"}, 200);
            }
        });

        random_mixed_.click(function(){
            owenership = "all";
            petType = "random";
            getPets();
        });
        random_dogs_.click(function(){
            owenership = "all";
            petType = "dog";
            getPets();
        });
        random_cats_.click(function(){
            owenership = "all";
            petType = "cat";
            getPets();
        });
        favorite_mixed_.click(function(){
            owenership = "mine";
            petType = "random";
            getPets();
        });
        favorite_dogs_.click(function(){
            owenership = "mine";
            petType = "dog";
            getPets();
        });
        favorite_cats_.click(function(){
            owenership = "mine";
            petType = "cat";
            getPets();
        });
        reroll_.click(function(){
            getPets();
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
        console.log(restore);
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
                
            });
        }
        return this;
    };

    publics.onSuspend = function(){
        restore = container.find(">div");
        console.log(restore);
        return this;
    }

    publics.onClose = function(){
        restore = null;
        return this;
    };

    var getPets = function(){

        petSpace.html("");
        $.ajax({
            type: "get",
            url: connDir + `images/${petType}/${owenership}/${own_id}`,
            dataType: "json",
            success: function(data){
                data.forEach(el => {
                    let url = el.url;
                    let type = el.type;
                    let liked = el.liked;
                    addElement(url, type, liked);
                });
            }
        })
    }

 /*    var getDog = function(){
        $.ajax({
            type: "get",
            dataType: "json",
            url : "https://dog.ceo/api/breeds/image/random",
            success: function(data){
                addElement(data.message, "dog");
            }
        })
    }

    var getCat = function(){
        $.ajax({
            type: "get",
            dataType: "json",
            url : "https://api.thecatapi.com/v1/images/search",
            success: function(data){
                addElement(data[0].url, "cat")
            }
        });
    } */

/*     var getBoth = function(){
        var rand = Math.round(Math.random() * 100);
        if(rand >= 50){
            getDog();
        }
        else{
            getCat();
        }
    } */

    var addElement = function(url, type, liked){
        var el = 
                `<div class="pet-el">
                    <img class="pet-img" src=":img:" alt="Nop"  >
                    <div class="pet-foot">
                        <span class="heart f_likePet" data-src=":img:" data-type=":type:" data-liked=":liked:">:icon:</span>
                        <p class="counter">100k favs</p>
                    </div>
                </div>`;
        var res = el.replace(":img:", url)
                        .replace(":img:", url)
                        .replace(":type:", type)
                        .replace(":liked:", liked);
        if(liked == true){
            res = res.replace(":icon:", liked_icon);
        }
        else if(liked == false){
            res = res.replace(":icon:", unliked_icon);
        }
        $(".petspace").append(res);
    }

    return publics;
});