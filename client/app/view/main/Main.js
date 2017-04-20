/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 */
Ext.define('Spotify.view.main.Main', {
	extend: 'Ext.Container',
	xtype : 'app-main',

	requires: [
		'Ext.MessageBox',
		'Ext.layout.VBox',
		'Ext.tab.Panel',
		'Spotify.view.Info',
		'Spotify.view.TitleBar',
		'Spotify.view.main.MainController',
		'Spotify.view.main.MainModel',
		'Spotify.view.spotify.Bookmarked',
		'Spotify.view.spotify.Login',
		'Spotify.view.spotify.RecentlyPlayed',
		'Spotify.view.tracks.List'
	],

	controller: 'main',
	viewModel : {
		type: 'main'
	},
	layout    : {
		type : 'vbox',
		align: 'stretch'
	},

	items: [
		{
			xtype : 'spotify-titlebar',
			docked: 'top'

		},
		{
			flex          : 1,
			reference     : 'main-tabpanel',
			xtype         : 'tabpanel',
			tabBarPosition: 'bottom',
			listeners: {
				painted: 'onTabPanelPainted'
			},
			items: [
				{
					title    : 'Recently Played',
					reference: 'spotify-recently-played-tracks',
					listeners: {
						activate: 'onActivateSpotifyRecentlyPlayedTracks'
					},
					iconCls  : 'x-fa fa-music',
					layout   : 'vbox',
					defaults : {
						flex: 1
					},
					items    : [
						{
							xtype: 'spotify-login',
							bind : {
								hidden: '{hasToken}'
							}
						},
						{
							xtype    : 'spotify-recentlyplayed',
							bind     : {
								hidden: '{!hasToken}',
								store : '{playedTracks}'
							},
							listeners: {
								itemtap: 'onItemTap'
							}
						}
					]

				},
				{
					title    : 'Bookmarked',
					reference: 'spotify-bookmarked',
					iconCls  : 'x-fa fa-bookmark',
					xtype    : 'spotify-bookmarked',
					bind     : {
						store: '{bookmarked}'
					},
					listeners: {
						itemtap : 'onBookmarkedItemTap',
						activate: 'onActivateSpotifyBookmarked'
					}

				},
				{
					title    : 'Info',
					reference: 'app-info',
					xtype    : 'spotify-info',
					iconCls  : 'x-fa fa-info',
					listeners: {
						activate: 'onActivateAppInfo'
					}
				}
			]
		}

	]
});
