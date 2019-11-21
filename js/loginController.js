define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // Fields
    var usernameInput = null;
    var passwordInput = null;
    var forgotPasswordBtn = null;
    var logCancelBtn = null;
    var logSubBtn = null;


    var findFields = function(){
        usernameInput = container.find("#usernameInput");
        passwordInput = container.find("#passwordInput");
        forgotPasswordBtn = container.find("#forgotPasswordBtn");
        logCancelBtn = container.find("#logCancelBtn");
        logSubBtn = container.find("#logSubBtn");
    }

    var setEvents = function(){
        forgotPasswordBtn.click(function(){
            require(["forgotPasswordController"], function(ForgotPasswordController){
                navigation.pushScreen(ForgotPasswordController);
            })
        });
        logCancelBtn.click(function(){
            navigation.popScreen();
        });
        logSubBtn.click(function(){
            let username = usernameInput.val();
            let password = passwordInput.val();
            login(username, password);
        });
    }

    var login = function(username, passowrd){
        $.ajax({
            type: "post",
            url: connDir + "user/login",
            data: {username: username, password: passowrd},
            complete: function(r){
                if(r.statusText == "OK"){
                    alert("Bienvenido");
                    navigation.goHome();
                }
                else{
                    alert("Login error. Contact admin");
                    console.log(r);
                }
            }
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
        container.load("screens/login.html", function(){
            findFields();
            setEvents();
        });
        return this;
    };
    
    publics.onClose = function(){
        return this;
    };
    return publics;
});