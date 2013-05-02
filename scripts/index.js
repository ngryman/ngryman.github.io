(function() {
	'use strict';

	/**
	 * https://gist.github.com/ngryman/5266324
	 * @param u
	 */
	function async(u) {
		var s = document.scripts[0],
			i = u.length, g;
		while (i--) {
			g = document.createElement('script');
			g.src = '//' + u[i] + '.js';
			s.parentNode.insertBefore(g, s);
		}
	}

	/**
	 * loads gga
	 */
	function gga() {
		window._gaq = [['_setAccount', 'UA-5779130-2'], ['_trackPageview']];
		async(['google-analytics.com/ga']);
	}

	/**
	 * loads disqus
	 */
	function disqus() {
		window.disqus_shortname = 'ngrymansh';
		async(['ngrymansh.disqus.com/embed']);
	}

	gga();

	if (/\/articles\/.?/.test(location.pathname)) {
		var $window = $(window),
			$document = $(document);

		// when the user enters the last portion of the article, we load disqus
		$window.on('scroll', function disqusTrigger() {
			if($window.scrollTop() > $document.height() - $window.innerHeight() * 1.5) {
				disqus();
				$window.off('scroll', disqusTrigger);
			}
		});
	}
})();