(function() {
	'use strict';

	var local = !window.location.host;

	/**
	 * https://gist.github.com/ngryman/5266324
	 * @param u
	 */
	function async(u) {
		var s = document.scripts[0],
			i = u.length, g;
		while (i--) {
			g = document.createElement('script');
			g.src = 'http://' + u[i] + '.js';
			s.parentNode.insertBefore(g, s);
		}
	}

	/**
	 * loads gga
	 */
	function gga() {
		if (local) return;
		window._gaq = [['_setAccount', 'UA-5779130-2'], ['_trackPageview']];
		async(['google-analytics.com/ga']);
	}

	/**
	 * loads disqus
	 */
	function disqus() {
		if (local) return;
		window.disqus_shortname = 'ngrymansh';
		async(['ngrymansh.disqus.com/embed']);
	}

	/**
	 * loads github projects
	 */
	function githubProjects() {
		$.getJSON('https://api.github.com/users/ngryman/repos?sort=pushed', function(projects) {
			projects.length = 10;

			var projectsHtml = projects.map(function(project) {
				return '  <span class="token string">"<a class="token md-link" href="' + project.html_url + '">' + project.name + '</a>"</span>';
			}).join('<span class="token punctuation">,\n</span>') + '\n';

			var $placeholder = $('.token.comment').filter(function() {
				return this.innerHTML == '[/* loading... */';
			});

			$placeholder.replaceWith('<span class="token punctuation">[</span>\n' + projectsHtml);
		});
	}

	gga();

	if ('ngryman.sh' == document.title) {
		githubProjects();
	}
	else if (/\/articles\/.?/.test(location.pathname)) {
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