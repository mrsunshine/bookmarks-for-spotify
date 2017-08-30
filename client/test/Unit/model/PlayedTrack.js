describe("PlayedTrack", function() {
    it("'duration_ms_display' should be a formatted string 00:00", function() {
        const record = new Spotify.model.PlayedTrack({
            duration_ms_display: 302626
        })
        expect(record.get('duration_ms_display').length).toBe(5)
        expect(record.get('duration_ms_display')).toEqual('05:02')
    });
    
     it("'duration_ms_display' should be a formatted string 00:00", function() {
        const record = new Spotify.model.PlayedTrack({
            duration_ms_display: 0
        })
        expect(record.get('duration_ms_display').length).toBe(5)
        expect(record.get('duration_ms_display')).toEqual('00:00')
    });
});