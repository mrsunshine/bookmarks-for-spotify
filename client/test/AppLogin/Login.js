describe("User uses the login mask", function() {
    
    it("Click on login button should trigger a redirect to path 'login'", () => {
        let loginContoller;
        ST.component('spotify-login').and((login) => {
           loginContoller = login.getController();
           spyOn(loginContoller, 'doSpotifyLogin');
        })
        
        
        ST.component('spotify-login').child('button').click(0,0).and(button => {
            expect(loginContoller.doSpotifyLogin).toHaveBeenCalled();
        });
    })
});