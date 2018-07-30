$('#search-input').keyup(function() {
	var me = $(this);
	
	function run() {
		var qs = me.val();
		if (qs.length > 1) {
			$.get('/api/posts/?q=' + qs).done(function(aResponse) {
				var rs = $('#search-results');
				rs.children().remove();
				if (aResponse.length === 0) {
					rs.append('<div class="search-noresult">(no matching posts found)</div>');
				} else {
					aResponse.forEach(function(anItem) {
						rs.append('<a href="/' + anItem.path + '"><span class="fa fa-newspaper-o"></span>&nbsp;' + anItem.title + '</a>');
					});
//					window.find('light');
				}
			});
		}
	}
	
	clearTimeout(me.data('timer'));
	me.data('timer', setTimeout(run, 500));
});
