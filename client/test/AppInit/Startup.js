describe("User initialy starts the app", function() {
    it("Titlebar should be visible", function() {
        ST.component('spotify-titlebar').
            expect('title').toBe('Bookmarks for Spotify'); 
    });
    
    it("Login button should be visible", function() {
        ST.component('spotify-login')
            .expect('rendered').toBeTruthy()
            .expect('hidden').toBeFalsy();
        
    });
    
    it("Viewmodel property 'token' should be empty", function() {
        ST.component('app-main').and(function(appMain) {
            const vm = appMain.getViewModel();
            expect(vm.get('token')).toBe('');
        })
    });
});