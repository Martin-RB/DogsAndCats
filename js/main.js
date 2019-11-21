var main = function(window, document, undefined){
    $(document).ready(function(){
        init();
    });

    var init = function(){
        $.ajaxSetup({
            xhrFields: {
                // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
                // This can be used to set the 'withCredentials' property.
                // Set the value to 'true' if you'd like to pass cookies to the server.
                // If this is enabled, your server must respond with the header
                // 'Access-Control-Allow-Credentials: true'.
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
            }
            else{
                $(".back-btn").hide();
            }
        });

        window.connDir = "http://localhost:6969/"

        $(".back-btn").click(function(){
            navigation.popScreen();
        })
        /* require(["loginController"], function(LoginController){
            navigation.pushScreen(LoginController);
        }) */
    }


}(window, document);
