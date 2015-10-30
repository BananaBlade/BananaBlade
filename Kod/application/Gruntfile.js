module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'app/static/css/main.css': 'app/static/sass/main.sass'
            }
        }
    },
    jade: {
      html: {
        files: [{
          //'app/templates/': ['app/templates/*.jade', '!app/templates/layout.jade']
          expand: true,
          cwd: "app/jade",
          src: ["**/*.jade", "!layout.jade"],
          dest: "app/templates",
          ext: ".html"
        }],
        options: {
          pretty: true,
          client: false
        }
      }
    },
    ts: {
      options: {
        fast: 'never',
        failOnTypeErrors: false
      },
      default: {
        files: {
          'app/static/js/app.js': 'app/typescript/app.ts'
        }
      }
    },
    watch: {
      files: [
        'app/jade/**/*.jade',
        //'app/typescript/**/*.ts',
        'app/static/**/*.sass'
      ],
      tasks: ['compile']
    }
  });

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('compile', ['sass', 'jade']);
  grunt.registerTask('default', ['compile', 'watch']);

};
