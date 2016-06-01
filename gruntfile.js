module.exports = function(grunt) {
    // var BUILD_DIR_CSS = 'deploy/assets/css';
    // var SRC_DIR_CSS = 'src/scss';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/* <%= pkg.name %> - version <%= pkg.version %>\n' +
            ' * <%= grunt.template.today("mm-dd-yyyy") %>\n' +
            ' * <%= grunt.template.date("h:MM:ss TT") %>\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['deploy/assets/css/main.css', 'deploy/assets/main-min.css']
                }
            }
        },
        sass: {
            options: {
                require: 'susy'
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'deploy/assets/css/main.css': 'src/scss/main.scss'
                }
            },
            dev: {
                options: {
                    outputStyle: 'expanded'
                },
                files: {
                    'deploy/assets/css/main.css': 'src/scss/main.scss'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
            },
            dist: {
                files: {
                    'deploy/assets/js/script.min.js': 'src/js/*.js'
                }
            },
            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false
                },
                files: {
                    'deploy/assets/js/script.min.js': 'src/js/*.js'
                }
            }
        },

        includes: {
            deploy: {
                cwd: 'src/pages',
                src: ['*.html', '*.php'],
                dest: './deploy/',
                options: {
                    includePath: 'src/partials'
                }
            } //deploy  
        }, //includes

        // imagemin:{
        //  dynamic: {                         // Another target 
        //       files: [{
        //         expand: true,                  // Enable dynamic expansion 
        //         cwd: 'src/imgs/',                   // Src matches are relative to this path 
        //         src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
        //         dest: 'deploy/assets/imgs/'                  // Destination path prefix 
        //       }]
        //     }
        // },
        cachebreaker: {
            dev: {
                options: {
                    match: ['main.css'],
                    src: {
                        path: 'deploy/assets/css/main.css'
                    }
                },
                files: {
                    src: ['src/partials/header.html']
                }
            }
        },
        watch: {
            // compass: { 
            //   files: ['src/**/*.scss'],
            //  tasks: ['compass:dev']
            // },
            options: {
                livereload: true
            },
            css: {
                files: ['src/**/*.scss'],
                tasks: ['sass:dev', 'usebanner', 'cachebreaker']
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['uglify']
            },
            html: {
                files: ['src/**/*.html', 'src/**/*.php'],
                tasks: ['includes:deploy']
            }
        } // watch 
    }); // grunt.initConfig

    // grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-cache-breaker');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('deploy', ['uglify:dist', 'sass:dist', 'usebanner']);

};
