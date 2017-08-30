describe("User bookmarks a track in the recently played list", () => {
    let vm;
    
    beforeAll(() => {
        Ext.ux.ajax.SimManager.init({
            delay: 300
        }).register({
           '/played': {
               type: 'json',
               data: PLAYED_TEST_DATA
           } 
        });
    });
    
    beforeEach(() => {
        ST.component('app-main').and(appMain => {
            vm = appMain.getViewModel();
        })
    })
    
    it ('There should be no track in the bookmark list', () => {
        ST.play([
            { type: "tap", target: "tab[text=\"Bookmarked\"]", x: 100, y: 23, pointerType: "mouse", identifier: 1 }
        ]);
        ST.wait(500);
        ST.component('spotify-bookmarked')
            .expect('hidden').toBe(false)
            .expect('innerHTML').toContain('No tracks bookmarked!');
        ST.play([
            { type: "tap", target: "tab[text=\"Recently Played\"]", x: 98, y: 18, pointerType: "mouse", identifier: 1 }
        ]);
    })
    
    it("Click on bookmark button should update bookmark item", () => {
        ST.component('app-main')
        .and(appMain => {
            expect(vm.get('token')).toEqual('new-token');
        })

        ST.dataView('spotify-recentlyplayed')
            .expect('hidden').toBe(false)
            .itemWith('name', /Zeit des Zorns/)
            .wait(500)
            .down('div.track-bookmark')
            .child('span').hasCls('fa-bookmark-o')
            .up('div.track-bookmark')
            .click(0,0)
            .child('span').hasCls('fa-bookmark');
    });
    
    it ('Bookmarked track should be added to bookmark store', () => {
        ST.component('app-main').and(appMain => {
            let store;
            vm = appMain.getViewModel();
            store = vm.getStore('bookmarked')
            
            expect(store.count()).toBe(1);
        }) 
    });
    
    it ('Badge on bookmark tap should be updated', () => {
        ST.dataView('spotify-bookmarked')
            .and(dataView => {
                expect(dataView.tab.getBadgeText()).toBe(1)
            });
    });
    
    it ('Bookmarked track should be shown in bookmark list', () => {
        ST.play([
            { type: "tap", target: "tab[text=\"Bookmarked\"]", x: 100, y: 23, pointerType: "mouse", identifier: 1 }
        ]);
        ST.wait(500);
        ST.dataView('spotify-bookmarked')
            .expect('hidden').toBe(false)
            .itemWith('name', /Zeit des Zorns/);
        ST.play([
            { type: "tap", target: "tab[text=\"Recently Played\"]", x: 98, y: 18, pointerType: "mouse", identifier: 1 }
        ]);
    });
    
    afterAll(() => {
        vm.getStore('bookmarked').removeAll(true);
        vm.getStore('bookmarked').sync();
        vm.getStore('bookmarked').load()
        vm.getStore('playedTracks').removeAll(true);
        vm.getStore('playedTracks').load()
    });

});