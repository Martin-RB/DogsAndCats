define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // fields 
    var login = null;
    var register = null;
    var myProfile = null;
    var logout = null;
    var favs = null;

    var sidenav_container = null;
    var sidenav_close = null;
    var burger_btn = null;
    
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

    var side_ran = null;
    var side_fav = null;
    
    var side_login = null;
    var side_register = null;
    var side_profile = null;
    var side_logout = null;

    var side_ran_mix = null;
    var side_ran_dog = null;
    var side_ran_cat = null;
    var side_fav_mix = null;
    var side_fav_dog = null;
    var side_fav_cat = null;

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
        myProfile = container.find("#myProfile");
        logout = container.find("#logout");
        favs = container.find("#favs");

        side_ran = container.find("#side_ran");
        side_fav = container.find("#side_fav");

        sidenav_container = container.find("#sidenav_container");
        sidenav_close = container.find("#sidenav_close");
        burger_btn = $("#burger_btn");

        side_login = container.find("#side_login");
        side_register = container.find("#side_register");
        side_profile = container.find("#side_profile");
        side_logout = container.find("#side_logout");
        side_ran_mix = container.find("#side_ran_mix");
        side_ran_dog = container.find("#side_ran_dog");
        side_ran_cat = container.find("#side_ran_cat");
        side_fav_mix = container.find("#side_fav_mix");
        side_fav_dog = container.find("#side_fav_dog");
        side_fav_cat = container.find("#side_fav_cat");

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
        setSidenavEvents();
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
                        else{
                            alert("Error: " + r.responseText);
                            console.log(r);
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
        myProfile.click(function(){
            require(["myProfleController"], function(Register){
                navigation.pushScreen(Register);
            });
        });
        logout.click(function(){
            $.ajax({
                type: "delete",
                url: connDir + "user/login",
                complete: function(r){
                    setUnlogged();
                    alert("See you later");
                }
            })
        });
        burger_btn.click(function(){
            openSidenav();
        });
        sidenav_close.click(function(){
            closeSidenav();
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
            reroll_.show();
            getPets();
        });
        random_dogs_.click(function(){
            owenership = "all";
            petType = "dog";
            reroll_.show();
            getPets();
        });
        random_cats_.click(function(){
            owenership = "all";
            petType = "cat";
            reroll_.show();
            getPets();
        });
        favorite_mixed_.click(function(){
            owenership = "mine";
            petType = "random";
            reroll_.hide();
            getPets();
        });
        favorite_dogs_.click(function(){
            owenership = "mine";
            petType = "dog";
            reroll_.hide();
            getPets();
        });
        favorite_cats_.click(function(){
            owenership = "mine";
            petType = "cat";
            reroll_.hide();
            getPets();
        });
        reroll_.click(function(){
            getPets();
        })
    }

    var isLoggedIn = function(callback){
        $.ajax({
            type: "get",
            url: connDir + "user/login",
            complete: function(r){
                callback(r.responseText == "true");
            }
        })
    }

    var setLogged = function(){
        myProfile.show();
        logout.show();
        login.hide();
        register.hide();

        side_fav.show();
        favs.show();
        side_login.hide();
        side_register.hide();
        side_profile.show();
        side_logout.show();
    }
    
    var setUnlogged = function(){
        myProfile.hide();
        logout.hide();
        login.show();
        register.show();

        side_fav.hide();
        favs.hide();
        side_login.show();
        side_register.show();
        side_profile.hide();
        side_logout.hide();
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
            isLoggedIn(function(res){
                if(res){
                    setLogged();
                }
                else{
                    setUnlogged();
                }
            });
        }
        else{
            container.load("screens/home.html", function(){
                findFields();
                setEvents();
                getPets();
                isLoggedIn(function(res){
                    if (res) {
                        setLogged();
                    } else {
                        setUnlogged();
                    }
                });
                
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

    var openSidenav = function(){
        sidenav_container.show();
    }

    var closeSidenav = function(){
        sidenav_container.hide();
    }

    var setSidenavEvents = function(){
        sidenav_container.on("click",".sidenav-dropdown-btn", function(){
            var child = $(this).next();
            child.toggle();
        });

        side_login.click(function(){
            login.click();
        });
        side_register.click(function(){
            register.click();
        });
        side_profile.click(function(){
            myProfile.click();
        });
        side_logout.click(function(){
            logout.click();
        });
        side_ran_mix.click(function(){
            random_mixed_.click();
        });
        side_ran_dog.click(function(){
            random_dogs_.click();
        });
        side_ran_cat.click(function(){
            random_cats_.click();
        });
        side_fav_mix.click(function(){
            favorite_mixed_.click();
        });
        side_fav_dog.click(function(){
            favorite_dogs_.click();
        });
        side_fav_cat.click(function(){
            favorite_cats_.click();
        });
    }

    var init = function(){
        function openSidenav() {
            document.getElementById("sidenav_container").style.display = "block";
          }
    
          function closeSidenav() {
            document.getElementById("sidenav_container").style.display = "none";
          }
          var dropdown = document.getElementsByClassName("sidenav-dropdown-btn");
          var i;
    
          for (i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var dropdownContent = this.nextElementSibling;
              if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
              } else {
                dropdownContent.style.display = "block";
              }
            });
          }
    }

    var getPets = function(){
        loading(true);
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
                loading(false);
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