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
        require(["login"], function(LoginController){
            console.log(LoginController);
            navigation.pushScreen(LoginController);
        })
    }


}(window, document);