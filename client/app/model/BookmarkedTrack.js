Ext.define('Spotify.model.BookmarkedTrack', {
  extend: 'Ext.data.Model',

	requires: [
		'Ext.util.Format'
	],

	fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'name',
    },
    {
      name: 'link',
    },
    {
      name: 'artist',
    },
    {
      name: 'played_at',
      type: 'date',
      dateFormat: 'time'
    },
    {
      name: 'bookmarked',
      type: 'bool',
      defaultValue: false
    },
    {
      name: 'progress_ms',

    },
    {
      name: 'progress_ms_display',

    },
    {
      name: 'duration_ms'
    },
    {
      name: 'duration_ms_display'
    },
		{
			name   : 'uri'
		},
  ]

});
