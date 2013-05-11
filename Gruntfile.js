'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= pkg.license %> */\n'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['Gruntfile.js', 'tasks/*.js', 'scripts/**/*.js']
		},
		gluejs: {
			all: {
				options: {
					stripBanners: true,
					banner: '<%= meta.banner %>\n',
					basepath: 'scripts',
					replace: {
						'jquery': 'window.$'
					}
				},
				src: 'scripts/**/*.js',
				dest: 'app.js'
			}
		},
		uglify: {
			options: {
				stripBanners: true,
				banner: '<%= meta.banner %>'
			},
			dist: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		mocha: {
			all: {
				src: ['test/**/*.html'],
				options: {
					mocha: {
						ignoreLeaks: false
					},
					run: true
				}
			}
		},
		watch: {
			files: '<%= jshint.files %>',
			tasks: ['local']
		},
		connect: {
			server: {
				options: {
					hostname: null, // waiting PR to be merged: https://github.com/gruntjs/grunt-contrib-connect/pull/19
					port: 3000,
					base: '.',
					keepalive: true
				}
			}
		},
		blog: {
			options: {
				files: 'articles/**/*.md'
			},
			local: {
				options: {
					hostname: 'localhost'
				}
			},
			dist: {
				options: {
					hostname: 'ngryman.sh'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-gluejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['jshint', 'gluejs']);

	grunt.registerTask('local', ['jshint', 'gluejs', 'blog:local']);
	grunt.registerTask('dist', ['jshint', 'gluejs', 'blog:dist']);
};
