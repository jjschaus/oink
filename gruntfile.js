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
                    src: ['public/assets/css/main.css']
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'public/assets/css/main.css': 'src/scss/main.scss'
                }
            }
            // dev: {
            //     options: {
            //         outputStyle: 'compressed'
            //     },
            //     files: {
            //         'public/assets/css/main.css': 'src/scss/main.scss'
            //     }
            // }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
            },
            dist: {
                files: {
                    'public/assets/js/script.min.js': 'src/js/*.js'
                }


            },

            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false
                },
                files: {
                    'public/assets/js/script.min.js': 'src/js/*.js'
                }
            }
        },

        includes: {
            deploy: {
                cwd: 'src/pages',
                src: ['*.html', '*.php'],
                dest: './public/',
                options: {
                    includePath: 'src/partials'
                }
            }, //deploy




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
            css: {
                options: {
                    match: ['/*.css'],
                    src: {
                        path: 'public/assets/**/*.css'

                    },
                },
                files: {
                    src: ['src/partials/**/*.html', 'src/pages/**/*.html']
                }
            },
            scripts: {
                options: {
                    match: ['/*.js'],
                    src: {
                        path: 'public/assets/js/**/*.js'

                    },
                },
                files: {
                    src: ['src/partials/**/*.php', 'src/pages/**/*.php']
                }
            },
            imgs: {
                options: {
                    match: ['/*.svg', '/*.png', '/*.jpg'],
                    src: {
                        path: 'public/assets/imgs/**/*'

                    },
                },
                files: {
                    src: ['src/**/*.html', 'src/pages/**/*.html']
                }
            },

            pdfs: {
                options: {
                    match: ['/*.pdf'],
                    src: {
                        path: 'public/pdfs/**/*.pdf'

                    },
                },
                files: {

                    src: ['src/partials/**/*.php', 'src/pages/**/*.php']

                }
            }
        },

        watch: {
            options: {
                livereload: false
            },
            css: {
                files: ['src/**/*.scss'],
                tasks: ['sass:dist', 'usebanner']
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['uglify']
            },
            // imgs: {
            //     files: ['public/assets/**/*'],
            //     tasks: ['uglify', 'cachebreaker:imgs']

            // },


            pdfs: {
                files: ['public/assets/pdfs/**/*.pdf'],
                tasks: ['uglify']
            },

            html: {
                files: ['src/**/*.html', 'src/**/*.php'],
                tasks: ['includes:deploy']

            }
        } // watch 
    }); // grunt.initConfig
    const imagemin = require('imagemin');
    const imageminJpegtran = require('imagemin-jpegtran');
    const imageminPngquant = require('imagemin-pngquant');
    const imageminSvgo = require('imagemin-svgo');
    imagemin(['src/imgs/**/*.{jpg,png,svg}'], 'public/assets/imgs', {
        plugins: [
            imageminJpegtran(),
            imageminSvgo({ removeViewBox: false }),
            imageminPngquant({ quality: '65-80' })
        ],
    }).then(files => {
        console.log('Images optimized');
        //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-cache-breaker');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('deploy', ['uglify:dist', 'sass:dist', 'usebanner']);

};
