Ext.define('Spotify.view.spotify.Login', {
    extend: 'Ext.Container',
    xtype: 'spotify-login',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'

    },
    items: [
        {
            xtype: 'button',
            iconCls: 'x-fa fa-spotify',
            ui: 'spotify',
            width: 280,
            text: 'Login with Spotify',
            handler: 'onSpotifyLogin'
        }
    ]
});