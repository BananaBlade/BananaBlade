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
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "app/templates/index.html": "app/templates/index.jade"
        }
      }
    },
    watch: {
      files: ['views/*.jade', 'app/static/sass/*.sass'],
      tasks: ['sass', 'jade']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['watch']);

};