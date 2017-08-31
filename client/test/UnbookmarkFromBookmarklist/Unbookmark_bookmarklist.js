describe("User unbookmarks a track in the bookmark list", function() {
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
        
        localStorage.setItem('bookmarked-tracks', 1);
        localStorage.setItem('bookmarked-tracks-counter', 1);
        localStorage.setItem('bookmarked-tracks-1', JSON.stringify(BOOKMARK_RECORD));
        ST.component('app-main').and(appMain => {
            vm = appMain.getViewModel();
            vm.getStore('bookmarked').load()
        })
    });

    it ('There should be a track in the bookmark list', () => {
        ST.play([
            { type: "tap", target: "tab[text=\"Bookmarked\"]", x: 100, y: 23, pointerType: "mouse", identifier: 1 }
        ]);
        ST.wait(500);
        ST.dataView('spotify-bookmarked')
            .expect('hidden').toBe(false)
            .expect('innerHTML').not.toContain('No tracks bookmarked!');
    })
    
    it ('Badge on bookmark tap should show count 1', () => {
        ST.dataView('spotify-bookmarked')
            .and(dataView => {
                expect(dataView.tab.getBadgeText()).toBe(1)
            });
    });
    
    it("Click on bookmark button should remove bookmark item", () => {
        ST.dataView('spotify-bookmarked')
            .expect('hidden').toBe(false)
            .itemWith('name', /Zeit des Zorns/)
            .wait(500)
            .down('div.track-bookmark')
            .down('span').hasCls('fa-bookmark')
            .up('div.track-bookmark')
            .click(0,0)
            .up('spotify-bookmarked')
            .expect('innerHTML').toContain('No tracks bookmarked!');
        
    });
    
    it('Bookmarked track should be removed from bookmark store', () => {
        ST.component('app-main').and(appMain => {
            let store = vm.getStore('bookmarked')
            
            expect(store.count()).toBe(0);
        }) 
    });
    
    it ('Badge on bookmark tap should show count 0', () => {
        ST.dataView('spotify-bookmarked')
            .and(dataView => {
                expect(dataView.tab.getBadgeText()).toBe(0)
            });
    });
    
    it ('There should be no bookmarked track in the recently played list', () => {
        ST.play([
            { type: "tap", target: "tab[text=\"Recently Played\"]", x: 98, y: 18, pointerType: "mouse", identifier: 1 }
        ]);
        ST.wait(500);
        ST.dataView('spotify-recentlyplayed')
            .expect('hidden').toBe(false)
            .itemWith('name', /Zeit des Zorns/)
            .wait(500)
            .down('div.track-bookmark')
            .down('span').missingCls('fa-bookmark')
        
        
    });
    
    afterAll(() => {
        vm.getStore('playedTracks').removeAll(true);
        vm.getStore('bookmarked').removeAll(true);
        vm.getStore('bookmarked').sync();
    });
});