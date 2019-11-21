define(function(require){
    var publics = {};
    var container = null;
    var navigation = null;
    var data = null;

    // Fields
    var emailInput = null;
    var regCancelBtn = null;
    var regSubBtn = null;

    var findFields = function(){
        emailInput = container.find("#emailInput");
        regCancelBtn = container.find("#regCancelBtn");
        regSubBtn = container.find("#regSubBtn");
    }

    var setEvents = function(){
        regCancelBtn.click(function(){
            navigation.popScreen();
        });
        regSubBtn.click(function(){
            loading(true);
            $.ajax({
                type: "post",
                url: connDir + "user/forgot",
                data: {email: emailInput.val()},
                dataType: "json",
                complete: function(r){
                    if(r.statusText == "OK"){
                        alert("Mail has been sent! Please check on the inbox or junk mails");
                        loading(false);
                        navigation.popScreen();
                    }
                    else{
                        alert("Error: " + r.statusText);
                        console.log(r);
                        navigation.popScreen();
                    }
                }
            })
        });
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
        container.load("screens/forgotPassword.html", function(){
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