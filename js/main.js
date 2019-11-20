var main = function(window, document, undefined){
    $(document).ready(function(){
        init();
    });

    var init = function(){
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
        navigation.setOnchange(function(){
            console.log("a");
            if(navigation.hasLeft()){
                $(".back-btn").show();
            }
            else{
                $(".back-btn").hide();
            }
        });

        $(".back-btn").click(function(){
            navigation.popScreen();
        })
        /* require(["loginController"], function(LoginController){
            navigation.pushScreen(LoginController);
        }) */
    }


}(window, document);
