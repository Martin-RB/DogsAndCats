var main = function(window, document, undefined){
    $(document).ready(function(){
        init();
    });

    var init = function(){
        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            },
            
        })


        requirejs.config({
            baseUrl: 'js'
        });
        let publics = {};
        //
        let content = $(".content");
        let navigation = new Navigation();
        navigation.setContainer(content);
        require(["homeController"], function(HomeController){
            navigation.pushScreen(HomeController);
        });
        /* require(["loginController"], function(HomeController){
            navigation.pushScreen(HomeController);
        }); */
        navigation.setOnchange(function(){
            console.log("a");
            if(navigation.hasLeft()){
                $(".back-btn").show();
                $("#burger_btn").hide();
            }
            else{
                $(".back-btn").hide();
                $("#burger_btn").show();
            }
        });

        var loadingScreen = $(".loadingScreen");

        window.loading = function(bool){
            if(bool == true){
                loadingScreen.show();
            }
            else{
                loadingScreen.hide();
            }
        }

        /* window.connDir = "http://localhost:6969/"; */
        window.connDir = "http://104.197.82.238:6969/";

        $(".back-btn").click(function(){
            navigation.popScreen();
        })
        /* require(["loginController"], function(LoginController){
            navigation.pushScreen(LoginController);
        }) */
    }


}(window, document);
