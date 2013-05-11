'use strict';

var config = require('./config'),
	services = require('./services');

// 1337 redirections
var redirects = {
	'/@': 'https://twitter.com/ngryman',
	'/t': 'https://twitter.com/ngryman',
	'/+': 'https://plus.google.com/116260634660700511285', // waiting for the pretty url here :)
	'/~': 'https://github.com/ngryman',
	'/g': 'https://github.com/ngryman',
};
var url = redirects[window.location.pathname];
if (url) {
	window.location.replace(url);
}

// track with GGA only if when hosted on github
if (!config.local) {
	services.gga();
}

// retreive github projects only on home page
if (config.home) {
	services.githubProjects();
}
// install disqus when scrolling at the bottom of the page, only for articles
else {
	services.installDisqus();
}