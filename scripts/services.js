'use strict';

var config = require('./config'),
	$ = require('jquery');

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
 * load gga
 */
function gga() {
	window._gaq = [['_setAccount', 'UA-5779130-2'], ['_trackPageview']];
	async(['google-analytics.com/ga']);
}

/**
 * load disqus
 */
function disqus() {
	window.disqus_shortname = 'ngrymansh';
	async(['ngrymansh.disqus.com/embed']);
}

/**
 * load github projects
 */
function githubProjects() {
	$.getJSON('https://api.github.com/users/ngryman/repos?sort=pushed', function(projects) {
		// max projects to 10 - too much is too much
		projects.length = 10;

		// projects list - builds up Prism HTML to render as a JavaScript array
		var projectsHtml = projects.map(function(project) {
			return '<span class="token string">"<a class="token md-link" href="' + project.html_url + '">' + project.name + '</a>"</span>';
		});

		// projects injection - inject it in place of the /* loading... */ placeholder
		$('.token.string').filter(function() {
			return this.innerHTML == "'loading...'";
		}).each(function(index) {
			$(this).replaceWith(projectsHtml[index]);
		});
	});
}

/**
 * install disqus when scrolling at the bottom of the page
 */
function installDisqus() {
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

module.exports = {
	gga: gga,
	githubProjects: githubProjects,
	installDisqus: installDisqus
};