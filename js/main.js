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
        require(["registerController"], function(RegisterController){
            navigation.pushScreen(RegisterController);
        })
        /* require(["loginController"], function(LoginController){
            navigation.pushScreen(LoginController);
        }) */
    }


}(window, document);