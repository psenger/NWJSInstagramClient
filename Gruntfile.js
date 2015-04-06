// Generated on 2015-03-25 using generator-angular 0.11.1
(function( ) {
  "use strict";

  var exports = module.exports = function (grunt) {
    grunt.initConfig({
      nodewebkit: {
        options: {
          platforms: ['win','osx'],
          buildDir: './webkitbuilds' // Where the build version of my node-webkit app is saved
        },
        src: ['./bower_components/**/*','./css/**/*','./partials/**/*','index.html'] // Your node-webkit app
      }});
    grunt.loadNpmTasks('grunt-node-webkit-builder');
  };

}());
