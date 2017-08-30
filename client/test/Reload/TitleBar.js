describe("TitleBar", function() {
    let vm;
    let controller;
    
    beforeAll(() => {
        Ext.ux.ajax.SimManager.init({
            delay: 300
        }).register({
           '/played': {
               type: 'json',
               data: PLAYED_RECORDS
           } 
        });
    });
    
    beforeEach(() => {
        ST.component('app-main').and(appMain => {
            vm = appMain.getViewModel();
           controller = appMain.getController()
           spyOn(controller, 'refreshTracks');
           spyOn(controller, 'onSpotifyLogout').and.callThrough();
        })
    })
    
    it("The refresh button should trigger a callc to refreshTracks", function() {
        
        ST.component("spotify-titlebar button[iconCls=x-fa fa-refresh]").click(0,0).and(button => {
            expect(controller.refreshTracks).toHaveBeenCalled();    
        })
    });
    
    it("The logout button should set the token to an empty string and", function() {
        ST.component("spotify-titlebar button[iconCls=x-fa fa-sign-out]").click(0,0).and(button => {
            expect(controller.onSpotifyLogout).toHaveBeenCalled();    
            expect(vm.get('token')).toEqual('');
            expect(localStorage.getItem('spotify-auth-token')).toEqual("");
        })
    });
});