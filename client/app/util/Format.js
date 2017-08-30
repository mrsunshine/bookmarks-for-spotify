/**
 * Created by dkd-dehl on 30.08.17.
 */
Ext.define('Spotify.util.Format', {
	singleton: true,

	msToMinuteSecondString(ms) {
		ms = ms ? ms : 0;
		return Ext.String.leftPad(parseInt(ms / 1000 / 60), 2, '0') + ":" + Ext.String.leftPad(parseInt(ms / 1000 % 60), 2, '0');
	}
});
