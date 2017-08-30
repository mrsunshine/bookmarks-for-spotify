describe("Bookmarking", function() {
    let vm;
    let bookmarkStore;
    
    beforeAll(() => {
        Ext.ux.ajax.SimManager.init({
            delay: 300
        }).register({
           '/played': {
               type: 'json',
               data: PLAYED_RECORDS
           } ,
           '/current-playback' : {
               type: 'json',
               data: CURRENT_TRACK
           }
        });
    });
    
    beforeEach(() => {
        ST.component('app-main').and(appMain => {
            vm = appMain.getViewModel();
            bookmarkStore = vm.getStore('bookmarked');
        })
    })
    
    afterAll(() => {
        bookmarkStore.removeAll();
        bookmarkStore.sync();
    })
    
    it("There should be three tabs in the tab panel", function(){
       ST.component("tabpanel[reference=main-tabpanel]").and(panel => {
           expect(panel.getInnerItems().length).toBe(3);
       }) 
    });
    
    it("Click on bookmark button should update bookmark item", function() {
        ST.component('app-main')
        .and(appMain => {
            expect(vm.get('token')).toEqual('new-token');
            ST.component('spotify-recentlyplayed').expect('hidden').toBe(false);
            
        })
        
        ST.dataView('spotify-recentlyplayed').wait(500).itemAt(1).down("div.track-bookmark").click(0,0);
        
        ST.dataView('spotify-recentlyplayed').wait(500).itemAt(1).down("div.track-bookmark").and(item => {
            expect(item.hasCls('track-bookmark')).toBe(true);
            expect(item.child("span").hasCls('fa-bookmark')).toBe(true);
        })
    });
    
    it("Tracks should be in the bookmark store after clicking the bookmark button", function(){
         ST.component('app-main')
        .and(appMain => {
            expect(bookmarkStore.count()).toBe(1);
        })
    });
    
    it("The bookmarked item should be displayed in the bookmark tab", function(){
    
        ST.button('tab[text="Bookmarked"]').click(0,0).and(bookmarkTabButton => {
        ST.component('tabpanel[reference="main-tabpanel"]').and(tabPanel => {
                expect(tabPanel.getActiveItem().xtype).toBe('spotify-bookmarked');
                expect(tabPanel.getActiveItem().getItems().length).toBe(1);
            })
        })
    });
});