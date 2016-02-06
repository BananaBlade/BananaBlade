module.exports = function (grunt) {
  var rewrite = require('connect-modrewrite');

  grunt.initConfig({
    sass: {
      options: { sourceMap: true },
      dist: { files: { 'dest/index.css': 'src/index.sass' } }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
          require('cssnano')() // minify the result
        ]
      },
      dist: { src: 'dest/index.css' }
    },
    jade: {
      html: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.jade"],
          dest: "dest",
          ext: ".html"
        }],
        options: {
          pretty: true,
          client: false
        }
      }
    },
    ts: {
      default: {
        src: [ "src/**/*.ts" ],
        options: {
          fast: 'never',
          module: 'commonjs',
          target: 'es5',
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          failOnTypeErrors : false,
          jsx: 'react',
          additionalFlags: ' --outDir ./dest'
        }
      }
    },
    watch: {
      jade:   { files: [ 'src/**/*.jade'  ], tasks: 'jade'  },
      css:    { files: [ 'src/**/*.sass'  ], tasks: 'css'   },
      ts:     { files: [ 'src/**/*.ts'    ], tasks: 'ts'    }
    },
    clean:  { default: [ 'dest' ] },
    copy:   { default: { files: [ { expand: true, cwd: 'app/typescript/', src: './**', dest: 'app/templates'} ] } },
    concurrent: {
      watch: {
        tasks: [ 'watch:ts', 'watch:jade', 'watch:css' ],
        options: { logConcurrentOutput: true }
      },
      compile: {
        tasks: [ 'jade', 'css', 'ts' ],
        options: { logConcurrentOutput: true }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: '',
          keepalive: true,
          // http://danburzo.ro/grunt/chapters/server/
          middleware: function(connect, options, middlewares) {
            // 1. mod-rewrite behavior
            var rules = [
                '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
            ];
            middlewares.unshift(rewrite(rules));
            return middlewares;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('css', ['sass', 'postcss']);
  grunt.registerTask('default', ['concurrent:compile', 'concurrent:watch']);

};
