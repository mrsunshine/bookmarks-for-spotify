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
			name   : 'uri',
			mapping: 'track.uri'
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
		},
		{
			name: 'progress_ms',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'duration_ms',
			mapping: 'track.duration_ms',
			convert(value, record) {
				return parseInt(value / 1000 / 60) + ":" + parseInt(value / 1000 % 60);
			}
		}
	]

});
