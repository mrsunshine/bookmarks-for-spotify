Ext.define('Spotify.view.TitleBar', {
    extend: 'Ext.TitleBar',

    xtype: 'spotify-titlebar',

    title: 'Bookmarks for Spotify',
    items: [
        {
            iconCls: 'x-fa fa-spotify',
            handler: 'onSpotifyLogin'
        }
    ]
});