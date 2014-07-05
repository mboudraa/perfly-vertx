// Generated on 2014-06-14 using generator-angular-fullstack 1.4.3
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || '.',
            dist: './../resources/public'
        },
        watch: {
            webapp: {
                files: [
                    '<%= yeoman.app %>/bower_components/**/*.{css,js}',
                    '<%= yeoman.app %>/partials/**',
                    '<%= yeoman.app %>/images/**',
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/scripts/**'
                ],
                tasks: ['predev']
            },
            scripts: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['sass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['predev']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                options: {force: true},
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*',
                            '!<%= yeoman.dist %>/Procfile'
                        ]
                    }
                ]
            },
            tmp: {
                files: [
                    {
                        dot: true,
                        src: ['.tmp']
                    }
                ]
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '**/*.css',
                        dest: '<%= yeoman.dist %>/styles'
                    }
                ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles',
                        src: ['*.scss'],
                        dest: '<%= yeoman.dist %>/styles',
                        ext: '.css'
                    }
                ],
                options: {
                    style: 'compressed'
                }

            },
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles',
                        src: ['*.scss'],
                        dest: '<%= yeoman.dist %>/styles',
                        ext: '.css'
                    }
                ],
                options: {
                    style: 'nested'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= yeoman.app %>/index.html',
                '<%= yeoman.app %>/index.jade'],
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html',
                '<%= yeoman.dist %>/**/*.jade'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            options: {
                cache: false
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    //collapseWhitespace: true,
                    //collapseBooleanAttributes: true,
                    //removeCommentsFromCDATA: true,
                    //removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/partials',
                        src: ['partials/**/*.html'],
                        dest: '<%= yeoman.dist %>/partials'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/public/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            'images/**/*.{webp}',
                            'fonts/**/*',
                            '*.html',
                            'partials/**/*.html'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.dist %>/styles',
                dest: '<%= yeoman.dist %>/styles',
                src: '**/*.css'
            },
            dev: {
                files: [
                    {
                        expand: true,
                        src: [
                            '<%= yeoman.app %>/libs/**/*.{css,js,html,png,jpg,jpeg,gif,webp,svg}',
                            '<%= yeoman.app %>/bower_components/**/*.{css,js}',
                            '<%= yeoman.app %>/partials/**',
                            '<%= yeoman.app %>/images/**',
                            '<%= yeoman.app %>/*.html',
                            '<%= yeoman.app %>/scripts/**'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }

        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            dist: [
                'sass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/**/*.css',
        //         '<%= yeoman.app %>/styles/**/*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },


    });

    // Used for delaying livereload until after server has restarted
    grunt.registerTask('wait', function () {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function () {
            grunt.log.writeln('Done waiting!');
            done();
        }, 500);
    });

    grunt.registerTask('test', function (target) {
        if (target === 'server') {
            return grunt.task.run([
                'env:test',
                'mochaTest'
            ]);
        }

        else if (target === 'client') {
            return grunt.task.run([
                'clean:server',
                'concurrent:test',
                'autoprefixer',
                'karma'
            ]);
        }

        else grunt.task.run([
                'test:server',
                'test:client'
            ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'clean:tmp'
    ]);


    grunt.registerTask('predev', function () {
        return grunt.task.run([
            'clean:dist',
            'sass:dev',
            'copy:dev',
        ]);
    });

    grunt.registerTask('dev', function () {
        return grunt.task.run([
            'predev',
            'watch'
        ]);
    });

};
