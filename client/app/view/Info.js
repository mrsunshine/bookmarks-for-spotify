Ext.define('Spotify.view.Info', {
	extend: 'Ext.Container',

	xtype: 'spotify-info',

	requires: [
		'Ext.layout.VBox'
	],

	cls: 'info',

	styleHtmlContent: true,
	scrollable      : true,
	layout          : {
		type: 'vbox'
	},

	items: [
		{
			padding: '15 15 15 15',
			html   : '<p>This app uses the Spotify API to display your last fifty recently played Spotify tracks. It allows you to bookmark tracks on your device and open them with Spotify.</p><br /><br />' +
			'<p>Project on GitHub: <a href="https://github.com/mrsunshine/bookmarks-for-spotify" target="_blank">https://github.com/mrsunshine/bookmarks-for-spotify</a></p><br /><br />' +
			'<p>Contact:<br /><br/>Nils Dehl<br /> Fiedlerweg 11<br />DE-64287 Darmstadt<br /> <a href="mailto:mail@nils-dehl.de">mail@nils-dehl.de</a></p>'
		},
		{
			xtype  : 'container',
			height : 50,
			margin : '10 0 0 0',
			padding: '15 15 15 15',
			// Display app version from app.json
			html   : 'App v' + Ext.manifest.version
		}
	]
});
