describe("Play", function() {
    let vm;
    let controller;
    let bookmarkStore
    
    beforeAll(() => {
        Ext.ux.ajax.SimManager.init({
            delay: 300
        }).register({
           '/played': {
               type: 'json',
               data: PLAYED_RECORDS
           }  ,
           '/current-playback' : {
               type: 'json',
               data: CURRENT_TRACK
           },
           '/play-track': {
               type : 'json',
               data : {
                   success : true
               }
           }
        });
    });
    
    beforeEach(() => {
        ST.component('app-main').and(appMain => {
            vm = appMain.getViewModel();
            controller = appMain.getController()
            bookmarkStore = vm.getStore('bookmarked');
           spyOn(controller, 'playTrack').and.callThrough();
           spyOn(window, "open");
           spyOn(controller, 'onBookmarkCurrentTrack').and.callThrough();
        })
    })
    
    afterAll(() => {
    })
    
    it('playTrack should be called after play button was clicked', function(){
        ST.dataView('spotify-recentlyplayed').wait(500).itemAt(1).down("div.track-play").click(0,0).and(item => {
            expect(controller.playTrack).toHaveBeenCalledWith('spotify:track:3Ixkbs1bKdr7LrvHffvoHg',0,'https://open.spotify.com/track/3Ixkbs1bKdr7LrvHffvoHg');
            expect(window.open).toHaveBeenCalled();
            
        });
        
        ST.component("spotify-track-currenttrack => .spotify-track-currenttrack-info .x-innerhtml").and(current => {
            expect(current.el.dom.innerHTML).toBe('<div class="x-innerhtml" id="ext-element-172">Zeit des Zorns, Kapitel 32 - Don Winslow (0:1/3:37)</div>')
        })

    })
     
    it('Click on play button of currenttrack start playing the track and open the track in a new window', function(){
        ST.dataView('spotify-track-currenttrack button[iconCls=x-fa fa-play-circle-o]').wait(1250).click(0,0).and(item => {
            expect(controller.playTrack).toHaveBeenCalledWith('spotify:track:1Wi77UHjDtGRHgsyG46yRY',1000,'https://open.spotify.com/track/1Wi77UHjDtGRHgsyG46yRY');
            expect(window.open).toHaveBeenCalled();
            
        });
    })   
    
    it('Click on bookmark button of currenttrack should bookmark the track', function(){
        ST.element('spotify-track-currenttrack button[reference=bookmark]').click(0,0).element().and(item => {
           const currentPlayback = Ext.ComponentQuery.query('spotify-track-currenttrack')[0].getViewModel().get('currentPlayback');
            expect(controller.onBookmarkCurrentTrack).toHaveBeenCalledWith(currentPlayback);
            
            item.down('div.fa-bookmark')
            
            expect(bookmarkStore.count()).toBe(1);
            
            expect(bookmarkStore.getAt(0).data).toEqual(BOOKMARKED_TRACK)
            
            
        });
    })
});