describe("User logs in via spotify", function() {
    let vm;
    let mainController;
    
    beforeAll(() => {
        Ext.ux.ajax.SimManager.init({
            delay: 300
        }).register({
           '/played': {
               type: 'json',
               data: PLAYED_TEST_DATA
           } 
        });
        ST.component('app-main').and((appMain) => {
            mainController = appMain.getController();
            spyOn(mainController, 'onPlayedTracksStoreLoad').and.callThrough();
            spyOn(mainController, 'markBookmarked').and.callThrough();
        });
    });
    
    beforeEach(() => {
        ST.component('app-main').and(appMain => {
            vm = appMain.getViewModel();
        })
    })
    
    it("Recently played items should be visible", function() {
        ST.component('app-main').and(appMain => {
            expect(vm.get('token')).toEqual('new-token');
            
            ST.component('spotify-login').expect('hidden').toBe(true);
            ST.component('spotify-recentlyplayed').expect('hidden').toBe(false);
        })
    });
    
    it("Recently played items should be loaded into the store", function() {
        ST.component('app-main').wait(500).and(appMain => {
            expect(mainController.onPlayedTracksStoreLoad).toHaveBeenCalled();
            expect(mainController.markBookmarked).toHaveBeenCalled(); 
        });
    });

});