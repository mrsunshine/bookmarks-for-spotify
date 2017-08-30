describe("Format", function() {
    it("should format ms to minute second string with format 00:00", function() {
        expect(Spotify.util.Format.msToMinuteSecondString(0).length).toBe(5)
        expect(Spotify.util.Format.msToMinuteSecondString(0)).toEqual('00:00')
        expect(Spotify.util.Format.msToMinuteSecondString(302626).length).toBe(5)
        expect(Spotify.util.Format.msToMinuteSecondString(302626)).toEqual('05:02')
        expect(Spotify.util.Format.msToMinuteSecondString(undefined).length).toBe(5)
        expect(Spotify.util.Format.msToMinuteSecondString(undefined)).toEqual('00:00')
    });
});