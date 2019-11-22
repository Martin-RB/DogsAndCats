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
    var notif_area_ = null;
    var friend_stext_ = null;
    var friend_search_btn_ = null;
    var friend_search_area = null;
    var other_favs = null;
    var other_favorite_mixed_ = null;
    var other_favorite_dogs_ = null;
    var other_favorite_cats_ = null;

    var side_favs = null;
    var side_other_favs = null;
    var side_other_fav_mix = null;
    var side_other_fav_dog = null;
    var side_other_fav_cat = null;


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

    var notification_req = `
<div>
<div>
    <span class="not-item">:message:</span>
</div>
<div class="decide">
    <div>
    <span class="decideBtn f_accept" data-id=":id:"><i class="fas fa-check"></i></span>
    </div>
    <div>
    <span class="decideBtn f_deny" data-id=":id:"><i class="fas fa-times"></i></span>
    </div>
</div>
</div>`;

    var notification_res = `
    <div>
    <div>
    <span class="not-item">:message:</span>
    </div>
    </div>`;
    
    var friend_element = `<li><span class="fr-name">:name:</span> <span class="fr-watch f_see" data-id=":id:"><i class="fas fa-eye"></i></span><span class=" f_remove" data-id=":id:"><i class="fas fa-ban"></i></span></li>`;
    var no_friend_element = `<li><span class="fr-name">:name:</span> <span class="fr-watch f_add" data-id=":id:"><i class="fas fa-user-friends"></i></span></li>`;

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
        other_favs = container.find("#other_favs");
        other_favorite_mixed_ = container.find("#other_favorite_mixed_");
        other_favorite_dogs_ = container.find("#other_favorite_dogs_");
        other_favorite_cats_ = container.find("#other_favorite_cats_");

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
        friend_stext_ = container.find("#friend_stext_");
        friend_search_btn_ = container.find("#friend_search_btn_");
        friend_search_area = container.find("#friend_search_area");

        side_favs = container.find("#side_favs");
        side_other_favs = container.find("#side_other_favs");
        side_other_fav_mix = container.find("#side_other_fav_mix");
        side_other_fav_dog = container.find("#side_other_fav_dog");
        side_other_fav_cat = container.find("#side_other_fav_cat");

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
        notif_area_ = container.find("#notif_area_");
    }

    var initDerecha = function(){
        var width = friend_menu.width()/$(window).width()*100 - 3;
        friend_menu.animate({right: `-${width}vw`}, 200);
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
                    random_mixed_.click();
                }
            })
        });
        
        friend_search_btn_.click(function(){
            let search = friend_stext_.val();
            if(search === ""){
                getFriends();
                return;
            }
            $.ajax({
                type: "get",
                url: connDir + `users/people/${search}`,
                success: function(dat){
                    friend_search_area.html("");
                    console.log(dat);
                    dat.forEach(el => {
                        let x;
                        if(el.isFriend == true){
                            x = friend_element.replace(":name:", el.name)
                                                .replace(":id:", el.idUser)
                                                .replace(":id:", el.idUser);
                        }
                        else{
                            x = no_friend_element.replace(":name:", el.name)
                                                    .replace(":id:", el.idUser);
                        }
                        friend_search_area.append(x);
                    });
                }
            });
        });
        
        friend_search_area.off("click", ".f_see");
        friend_search_area.on("click", ".f_see", function(){
            var id = $(this).data("id");
            var name = $(this).prev().html();
            addFriendMenu(id, name);
        });
        friend_search_area.off("click", ".f_remove");
        friend_search_area.on("click", ".f_remove", function(){
            var id = $(this).data("id");
            $.ajax({
                type: "delete",
                url: connDir + "users/friends",
                data: {id: id},
                success: function(){
                    alert("Unfriended succesfully!");
                    getFriends();
                }
            })
        });
        friend_search_area.off("click", ".f_add");
        friend_search_area.on("click", ".f_add", function(){
            var id = $(this).data("id");

            $.ajax({
                type: "post",
                url: connDir + "users/friends/",
                data: {id: id},
                success: function(){
                    alert("Friend request sent");
                }
            });
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
                var width = friend_menu.width()/$(window).width()*100 - 3;
                friend_menu.animate({right: `-${width}vw`}, 200);
            }
        });

        notif_area_.off("click", ".f_accept");
        notif_area_.on("click", ".f_accept", function(){
            var id = $(this).data("id");
            
            $.ajax({
                type: "put",
                url: connDir + `users/friends/yes`,
                data: {id: id},
                success: function(){
                    fillNotifications();
                    getFriends();
                },
                complete: function(r){
                    console.log(r);
                }
            });
        });
        notif_area_.off("click", ".f_deny");
        notif_area_.on("click", ".f_deny", function(){
            var id = $(this).data("id");
            
            $.ajax({
                type: "put",
                url: connDir + `users/friends/no`,
                data: {id: id},
                success: function(){
                    fillNotifications();
                    getFriends();
                }
            });
        });

        random_mixed_.click(function(){
            own_id = -1;
            owenership = "all";
            petType = "random";
            reroll_.show();
            getPets();
        });
        random_dogs_.click(function(){
            own_id = -1;
            owenership = "all";
            petType = "dog";
            reroll_.show();
            getPets();
        });
        random_cats_.click(function(){
            own_id = -1;
            owenership = "all";
            petType = "cat";
            reroll_.show();
            getPets();
        });
        favorite_mixed_.click(function(){
            own_id = -1;
            owenership = "mine";
            petType = "random";
            reroll_.hide();
            getPets();
        });
        favorite_dogs_.click(function(){
            own_id = -1;
            owenership = "mine";
            petType = "dog";
            reroll_.hide();
            getPets();
        });
        favorite_cats_.click(function(){
            own_id = -1;
            owenership = "mine";
            petType = "cat";
            reroll_.hide();
            getPets();
        });
        other_favorite_mixed_.click(function(){
            own_id = $(this).data("id");
            owenership = "other";
            petType = "random";
            reroll_.hide();
            getPets();
        });
        other_favorite_dogs_.click(function(){
            own_id = $(this).data("id");
            owenership = "other";
            petType = "dog";
            reroll_.hide();
            getPets();
        });
        other_favorite_cats_.click(function(){
            own_id = $(this).data("id");
            owenership = "other";
            petType = "cat";
            reroll_.hide();
            getPets();
        });



        reroll_.click(function(){
            getPets();
        })
    }

    var addFriendMenu = function(id, name){
        other_favs.show();
        side_other_favs.show();
        other_favs.find("span").html(name + " Favorites");
        side_other_favs.find("span").html(name + " Favs");
        
        other_favorite_mixed_.data("id", id);
        other_favorite_dogs_.data("id", id);
        other_favorite_cats_.data("id", id);
    }

    var getFriends = function(){
        $.ajax({
            type: "get",
            url: connDir + "users/friends",
            success: function(data){
                friend_search_area.html("");
                data.forEach(el => {
                    let x;
                    if(el.isFriend == true){
                        x = friend_element.replace(":name:", el.name)
                                            .replace(":id:", el.idUser)
                                            .replace(":id:", el.idUser);
                    }
                    else{
                        x = no_friend_element.replace(":name:", el.name)
                                                .replace(":id:", el.idUser);
                    }
                    friend_search_area.append(x);
                });
            }
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

    var getNotifications = function(callback){
        $.ajax({
            type: "get",
            url: connDir + "users/notifications",
            success: function(r){
                callback(r);
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

        friend_menu.show();
        other_favs.hide();
        side_favs.show();
        side_other_favs.hide();
        getFriends();
        fillNotifications();
    }

    var fillNotifications = function(){
        notif_area_.html("");
        getNotifications(function(dat){
            dat.forEach(el => {
                let s;
                if(el.isRequest == true){
                    s = notification_req.replace(":message:", el.msg)
                                        .replace(":id:", el.id)
                                        .replace(":id:", el.id);
                }
                else{
                    s = notification_res.replace(":message:", el.msg);
                }
                notif_area_.append(s);
            });
        });
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
        other_favs.hide();

        side_favs.hide();
        side_other_favs.hide();

        friend_menu.hide();
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
                initDerecha();
                
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
        sidenav_container.off("click",".sidenav-dropdown-btn");
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
        side_other_fav_mix.click(function(){
            other_favorite_mixed_.click();
        })
        side_other_fav_dog.click(function(){
            other_favorite_dogs_.click();
        })
        side_other_fav_cat.click(function(){
            other_favorite_cats_.click();
        })
    }

    var getPets = function(){
        loading(true);
        petSpace.html("");
        $.ajax({
            type: "get",
            url: connDir + `images/${petType}/${owenership}/${own_id}`,
            dataType: "json",
            success: function(data){
                data.forEach((el, i) => {
                    let url = el.url;
                    let type = el.type;
                    let liked = el.liked;
                    addElement(url, type, liked, i);
                });
                loading(false);
            }
        })
    }

    var getCounter = function(url, callback){
        $.ajax({
            type: "post",
            url: connDir + "images/likeCounter",
            data: {url: url},
            success: function(data){
                callback(data.count);
            }
        });
    }

    var addElement = function(url, type, liked, i){
        var el = 
                `<div class="pet-el">
                    <img class="pet-img" src=":img:" alt="Nop"  >
                    <div class="pet-foot">
                        <span class="heart f_likePet" data-src=":img:" data-type=":type:" data-liked=":liked:">:icon:</span>
                        <p class="counter" id="counter_:i:"></p>
                    </div>
                </div>`;
        var res = el.replace(":img:", url)
                        .replace(":img:", url)
                        .replace(":type:", type)
                        .replace(":liked:", liked)
                        .replace(":i:", i);
        if(liked == true){
            res = res.replace(":icon:", liked_icon);
        }
        else if(liked == false){
            res = res.replace(":icon:", unliked_icon);
        }
        getCounter(url, function(count){
            $("#counter_"+i).html(count + " favs");
        })
        $(".petspace").append(res);
    }

    return publics;
});