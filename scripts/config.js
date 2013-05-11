'use strict';

var config = {};

/**
 * tells if the blog is running locally or on github
 */
config.local = !window.location.host;

/**
 * tells if this is the index page
 */
config.home = (config.local ? /index\.html$/ : /^\/$/).test(window.location.pathname);

module.exports = config;