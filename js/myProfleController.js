define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // Fields
    var emailShow = null;
    var usernameShow = null;
    var passwordShow = null;
    var profEdBtn = null;

    // Recv = {name:str, email:str}
    var getUserData = function(callback){
        $.ajax({
            type: "get",
            url: connDir + "user/",
            success: function(r){
                console.log(r);
                callback(r);
            },
            error: function(e){
                console.log(e);
                alert(e.responseText);
                console.log(e);
            }
        })
    }

    var findFields = function(){
        emailShow = container.find("#emailShow");
        usernameShow = container.find("#usernameShow");
        passwordShow = container.find("#passwordShow");
        profEdBtn = container.find("#profEdBtn");
    }

    var setEvents = function(){
        profEdBtn.click(function(){
            
            var data = {};
            if(emailShow.val() == ""){
                alert("You should write an email");
                return;
            }
            if (usernameShow.val() == ""){
                alert("You should write an user name");
                return;
            }
            if(passwordShow.val() != ""){
                data.password = passwordShow.val();
            }

            data.email = emailShow.val();
            data.username = usernameShow.val();

            $.ajax({
                type: "put",
                url: connDir + "user/",
                data: data,
                complete: function(r){
                    if(r.statusText == "OK"){
                        alert("Credentials submited succesfully!");
                        navigation.goHome();
                    }
                    else{
                        alert("Error: " + r.statusText);
                        console.log(r);
                    }
                }
            });
        })
    }

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
        container.load("screens/myProfile.html", function(){
            findFields();
            setEvents();
            getUserData(function(ans){
                emailShow.val(ans.email);
                usernameShow.val(ans.name);
            });
        });
        return this;
    };
    
    publics.onClose = function(){
        return this;
    };
    return publics;
});