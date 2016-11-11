'use strict';

var marked = require('marked'),
	fs = require('fs'),
	path = require('path'),
	url = require('url'),
	os = require('os'),
	inflection = require('inflection'),
	ejs = require('ejs'),
	readingTime = require('reading-time');

module.exports = function(grunt) {
	var _ = grunt.util._;

	marked.setOptions({
		langPrefix: 'language-'
	});

	ejs.open = '{%';
	ejs.close = '%}';
	ejs.filters.strip = function(str) {
		return str.replace(/<(?:.|\n)*?>/gm, '');
	};

	grunt.registerMultiTask('blog', 'builds up a 1337 blog', function() {
		var done = this.async();
		var options = this.options({
			hostname: 'localhost',
			port: 80
		});

		// builds full host string
		if ('localhost' != options.hostname) {
			options.host = '//' + options.hostname + (80 != options.port ? ':' + options.port : '');
			options.local = false;
		}
		else {
			options.host = 'http://localhost:3000/';
			options.local = true;
		}

		// build!!
		grunt.util.async.waterfall([
			buildArticles(options),
			buildIndex(options)
		], function() {
			done();
		});
	});

	function buildIndex(options) {
		return function(articles, callback) {
			var meta = _.extend({}, options);
			meta.title = 'Index';

			// articles juggling - sort by created date desc and filters only published ones
			meta.articles = _.sortBy(_.filter(articles, 'published'), 'created').reverse();

			// apply layout
			fs.readFile('layouts/index.ejs', 'utf8', function(err, content) {
				if (err) {
					grunt.log.error(meta.title);
					callback(err);
				}

				content = ejs.render(content, meta);

				var dest = 'index.html';
				fs.writeFile(dest, content, function(err) {
					if (err) {
						grunt.log.error(meta.title);
					}

					grunt.log.ok(meta.title);
					callback(err);
				});
			});
		};
	}

	function buildArticles(options) {
		return function(callback) {
			// builds compile functions for each markdown file in order to parallelize compilation
			var compileList = grunt.file.expand({ filter: 'isFile' }, options.files).map(function(filename) {
				return function(callback) {
					fs.readFile(filename, 'utf8', function(err, markdown) {
						// isolate article content and meta data
						var chunks = markdown.split('---');
						var article = chunks[0].trim();
						var meta = parseMeta(chunks[1].trim());

						// create and update meta
						meta = updateMeta(meta);
						fs.writeFile(filename, article + stringifyMeta(meta), function(err) {
							if (err) {
								grunt.log.error(meta.title);
								callback(err);
							}

							_.extend(meta, options);

							// article layout
							if (!meta.layout) {
								meta.layout = 'article.ejs';
							}
							// url title
							meta.urlTitle = inflection.dasherize(meta.title.replace(/\/|(?:\.\.\.)|(?:\{.*\})/g, '').trim().toLocaleLowerCase());
							// canonical url, good for seo
							meta.canonicalUrl = url.resolve(meta.host, 'articles' + '/' + meta.urlTitle);
							// article body
							meta.body = marked(article);
							// reading time
							meta.readingTime = readingTime(article).text;

							// apply layout
							fs.readFile('layouts/' + meta.layout, 'utf8', function(err, content) {
								if (err) {
									grunt.log.error(meta.title);
									callback(err);
									return;
								}

								article = ejs.render(content, meta);

								var dest = filename.replace('.md', '.html');
								fs.writeFile(dest, article, function(err) {
									if (err) {
										grunt.log.error(meta.title);
									}

									grunt.log.ok(meta.title);
									callback(err, meta);
								});
							});
						});
					});
				};
			});

			grunt.util.async.parallel(compileList, function(err, articles) {
				callback(err, articles);
			});
		};
	}
};

function parseMeta(raw) {
	var json = JSON.parse(raw.replace(/```(?:json)?/g, ''));
	if (json.created) {
		json.created = new Date(json.created);
	}
	return json;
}

function updateMeta(meta) {
	if (!meta.created) {
		meta.created = new Date();
	}
	meta.updated = new Date();
	return meta;
}

function stringifyMeta(meta) {
	var raw = JSON.stringify(meta, null, '  ');
	raw = '\n\n---\n```json\n' + raw + '\n```\n';
	return raw;
}
