Ext.define('Spotify.model.PlayedTrack', {
	extend: 'Ext.data.Model',

	fields: [
		{
			name   : 'id',
			type   : 'string',
			mapping: 'track.id'
		},
		{
			name   : 'name',
			mapping: 'track.name'
		},
		{
			name   : 'link',
			mapping: 'track.external_urls.spotify'
		},
		{
			name   : 'artist',
			mapping: 'track.artists',
			convert(value, record) {
				return (Ext.isArray(value) && value[0]) ? value[0].name : '';
			}
		},
		{
			name: 'played_at',
			type: 'date'
		},
		{
			name        : 'bookmarked',
			type        : 'bool',
			defaultValue: false
		}
	]

});
