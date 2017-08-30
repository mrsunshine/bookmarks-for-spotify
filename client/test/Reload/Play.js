describe("Play", function() {
    let vm;
    let controller;
    
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
           spyOn(controller, 'playTrack').and.callThrough();
           spyOn(window, "open");
        })
    })
    
    afterAll(() => {
    })
    
    it('playTrack should be called after play button was clicked', function(){
        ST.dataView('spotify-recentlyplayed').wait(1000).itemAt(1).down("div.track-play").click(0,0).and(item => {
            expect(controller.playTrack).toHaveBeenCalledWith('spotify:track:3Ixkbs1bKdr7LrvHffvoHg',0,'https://open.spotify.com/track/3Ixkbs1bKdr7LrvHffvoHg');
            expect(window.open).toHaveBeenCalled();
            
        });
        
        ST.component("spotify-track-currenttrack => .spotify-track-currenttrack-info .x-innerhtml").and(current => {
            expect(current.el.dom.innerHTML).toBe('<div class="x-innerhtml" id="ext-element-172">Zeit des Zorns, Kapitel 32 - Don Winslow (0:1/3:37)</div>')
        })

    })
});