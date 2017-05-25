Ext.define('Spotify.model.BookmarkedTrack', {
  extend: 'Ext.data.Model',

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
      type: 'int',
      defaultValue: 0
    },
		{
			name   : 'uri'
		},
  ]

});
