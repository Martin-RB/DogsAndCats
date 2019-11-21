define(function(require){
    var publics = {};
    var container = null;
    var data = null;

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
        })
        regSubBtn.click(function(){
            loading(true);
            $.ajax({
                type: "post",
                url: connDir + "user/",
                data: {email: emailInput.val()},
                complete: function(r){
                    if(r.statusText == "OK"){
                        alert("Done! Check your email for further instructions. Check on junk mail in case you cant find it");
                        loading(false);
                        navigation.popScreen();
                    }
                    else{
                        alert("Error: " + r.statusText);
                    }
                }
            })
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
        container.load("screens/register.html", function(){
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