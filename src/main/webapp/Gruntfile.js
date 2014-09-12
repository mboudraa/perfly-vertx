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
            dist: './../resources/public',
            name: 'prefly'
        },
        watch: {
            webapp: {
                files: [
                    '<%= yeoman.app %>/bower_components/**/*.{css,js}',
                    '<%= yeoman.app %>/partials/**',
                    '<%= yeoman.app %>/images/**',
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/scripts/**',
                    '<%= yeoman.app %>/styles/**/*.css'
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

        concat: {
            js: {
                cwd: '<%= yeoman.app %>',
                src: ["./scripts/**/*.js"],
                dest: "<%= yeoman.dist %>/scripts/scripts.js"
            },
            libs: {
                cwd: '<%= yeoman.app %>',
                src: [
                    "bower_components/jquery/dist/jquery.min.js",
                    "bower_components/es5-shim/es5-shim.js",
                    "bower_components/angular/angular.js",
                    "bower_components/json3/lib/json3.min.js",
                    "bower_components/angular-resource/angular-resource.js",
                    "bower_components/angular-cookies/angular-cookies.js",
                    "bower_components/angular-sanitize/angular-sanitize.js",
                    "bower_components/angular-route/angular-route.js",
                    "bower_components/angular-ui-utils/ui-utils.js",
                    "bower_components/sockjs/sockjs.js",
                    "bower_components/vertxbus.js/index.js",
                    "bower_components/angular-vertxbus/dist/angular-vertxbus-0.6.0.js",
                    "bower_components/angular-truncate/src/truncate.js",
                    "bower_components/angular-local-storage/angular-local-storage.js",
                    "bower_components/qrcode-generator/js/qrcode.js",
                    "bower_components/angular-qrcode/qrcode.js",
                    "bower_components/lodash/dist/lodash.compat.min.js",
                    "bower_components/highstock-release/highstock.src.js",
                    "bower_components/highcharts-ng/dist/highcharts-ng.min.js",
                    "bower_components/angular-timer/dist/angular-timer.min.js",
                    "bower_components/angular-animate/angular-animate.min.js",
                    "bower_components/angular-material/angular-material.min.js"
                ],

                dest: "<%= yeoman.dist %>/scripts/libs.js"

            },
            polymer: {
                cwd: '<%= yeoman.app %>',
                src: [
                    "bower_components/ng-polymer-elements/ng-polymer-elements.js"
                ],
                dest: "<%= yeoman.dist %>/scripts/polymer.js"
            },

            css: {
                cwd: '<%= yeoman.app %>',
                src: [
                    "bower_components/angular-material/angular-material.min.css",
                    "<%= yeoman.app %>/.tmp/styles/*.css",
                    "<%= yeoman.app %>/.tmp/styles/sass/*.css"
                ],

                dest: "<%= yeoman.dist %>/styles/<%= yeoman.name %>.css"
            }
        },

        vulcanize: {
            default: {
                options: {
                    strip: true
                },
                files: {
                    '<%= yeoman.dist %>/polymer/polymer.html': [
                        '<%= yeoman.dist %>/polymer/polymer.html'
                    ]
                }
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
                        dest: '<%= yeoman.app %>/.tmp/styles/sass',
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
                        dest: '<%= yeoman.app %>/.tmp/styles/sass',
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
                    }
                ]
            },
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            'partials/**',
                            'images/**',
                            '*.html',
                            'polymer/**',
                            'fonts/**'
                        ],
                        dest: '<%= yeoman.dist %>'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/.tmp/concat',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'scripts/**/*.js'
                        ]
                    }
                ]
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
        }

    });


    grunt.registerTask('build', [
        'clean:dist',
        'autoprefixer',
        'sass:dist',
        'concat',
        'copy:dist',
        'rev',
        'clean:tmp'
    ]);


    grunt.registerTask('predev', function () {
        return grunt.task.run([
            'clean:dist',
            'sass:dev',
            'concat',
            'copy:dev',
            'vulcanize'

        ]);
    });

    grunt.registerTask('dev', function () {
        return grunt.task.run([
            'predev',
            'watch'
        ]);
    });


};
