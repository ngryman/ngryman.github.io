'use strict';

var config = require('./config'),
	services = require('./services');

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