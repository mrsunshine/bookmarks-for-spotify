Ext.define('Spotify.view.Info', {
    extend: 'Ext.Container',

    xtype: 'spotify-info',

    cls: 'info',
    styleHtmlContent: true,
    scrollable: true,
    items: [
        {
            html: '<p>This app uses the Spotify API to display your last fifty recently played Spotify tracks. It allowes you to bookmark tracks on your device and open them with Spotify.</p> <br /><br /><p>Contact:<br /><br/>Nils Dehl<br /> Fiedlerweg 11<br />DE-64287 Darmstadt<br /> <a href="mailto:mail@nils-dehl.de">mail@nils-dehl.de</a></p>'
        },
        {
            xtype: 'container',
            height: 20,
            margin: '10 0 0 0',
            html: 'App v' + Ext.manifest.version
        }
    ]
});