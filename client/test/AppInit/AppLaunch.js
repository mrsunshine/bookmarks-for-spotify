
describe("AppLaunch", function() {
    
    it("test", function(){
        let controller;
        ST.component('spotify-login').and(function(el){
           controller = el.getController()
           // button.getController();
           spyOn(controller, 'doSpotifyLogin');
        
       })
        
       ST.component('spotify-login button').click(0,0).and(function(button){
           debugger;
        expect(controller.doSpotifyLogin).toHaveBeenCalled();
           
       })
       
    });
});