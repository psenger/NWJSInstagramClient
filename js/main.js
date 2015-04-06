(function() {
  var fs = require('fs');

  /** Start code needed for copy cut paste to work **/
  var gui = require('nw.gui');
  if (process.platform === "darwin") {
    var mb = new gui.Menu({type: 'menubar'});
    mb.createMacBuiltin('RoboPaint', {
      hideEdit: false
    });
    gui.Window.get().menu = mb;
  }
  /** End code needed for copy cut paste to work **/

    /// angular = require('../bower_components/angular/angular.js');

  function suppress(event) {
    if (!event) {
      return false;
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.cancelBubble) {
      event.cancelBubble = true;
    }
    return false;
  }

  function captureMessage ( $rootScope, reason ) {
    // $log.log('captureMessage', $rootScope, reason.message );
    if ( reason && reason.message ) {
      $rootScope.error = { type: reason.type || 'danger', message: reason.message || "A unknown error has occurred." };
    } else {
      $rootScope.error = { type:'danger', message: "A unknown error has occurred."  };
    }
  }

//          var startLoad = function( file, newConfig ) {
//            var deferred = $q.defer();
//            setTimeout(function() {
//              $rootScope.$broadcast('LoadMaskEmit','start');
//              deferred.resolve( file, newConfig );
//            }, 0);
//            return deferred.promise;
//          };
//
//          var loadConfig = function ( file, newConfig ) {  // $q, $rootScope ) {
//            var deferred = $q.defer();
//            setTimeout(function() {
//              fs.readFile( file , function(err, data){
//                if(err){
//                  if ( err.code === 'EACCES' ) {
//                    deferred.reject( { type: 'danger', msg: "Unable to open config.json due to restricted file permissions." } );
//                  } else if ( err.code === 'ENOENT' ) {
//                    deferred.reject( { type: 'danger', msg: "Unable to open config.json because it is missing." } );
//                  } else {
//                    deferred.reject( err );
//                  }
//                  return;
//                }
//                deferred.resolve( data, newConfig );
//              });
//            }, 0);
//            return deferred.promise;
//          };
//
//          var parseConfig = function ( data, newConfig ) {
//            var deferred = $q.defer();
//            setTimeout(function() {
//                try {
//                  deferred.resolve( JSON.parse(data), newConfig );
//                } catch (err) {
//                  deferred.reject( err );
//                }
//            }, 0);
//            return deferred.promise;
//          };
//
//          var mergeConfig = function( data, newConfig ) {
//            var deferred = $q.defer();
//            setTimeout(function() {
//              try {
//                deferred.resolve( angular.merge({}, data, newConfig) );
//              } catch (err) {
//                deferred.reject( err );
//              }
//            }, 0);
//            return deferred.promise;
//          };
//
//          var completeLoad = function( data ) {
//            var deferred = $q.defer();
//            setTimeout(function() {
//              $rootScope.$broadcast('LoadMaskEmit','end');
//              deferred.resolve( data );
//            }, 0);
//            return deferred.promise;
//          };
//  var process = process || {};
//  var angular = angular || {};
  var app = angular.module( 'InstagramClient', ['ui.router','ngAnimate'])
    .factory('configFactory', ['$q','$rootScope',function ($q,$rootScope) {
      return {
        startLoad: function( obj ) {
          var deferred = $q.defer();
          setTimeout(function() {
            $rootScope.$broadcast( 'LoadMaskEmit', 'start' );
            deferred.resolve( obj ); //file, newConfig );
          }, 0);
          return deferred.promise;
        },
        loadConfig: function ( obj ) {
          var file = obj.file;
          var newConfig = obj.newConfig;
          var deferred = $q.defer();
          setTimeout(function() {
            fs.readFile( file , function(err, data){
              if(err){
                if ( err.code === 'EACCES' ) {
                  deferred.reject( { type: 'danger', message: "Unable to open config.json due to restricted file permissions." } );
                } else if ( err.code === 'ENOENT' ) {
                  deferred.reject( { type: 'danger', message: "Unable to open config.json because it is missing." } );
                } else {
                  deferred.reject( err );
                }
                return;
              }
              deferred.resolve( { data: JSON.parse(data), file: file, newConfig: newConfig } );
            });
          }, 0);
          return deferred.promise;
        },
        completeLoad: function() {
          var deferred = $q.defer();
          setTimeout(function() {
            $rootScope.$broadcast('LoadMaskEmit','end');
            deferred.resolve();
          }, 0);
          return deferred.promise;
        },
        mergeAndSave: function( obj ) {
          var file = obj.file;
          var data = obj.data;
          var newConfig = obj.newConfig;
          var deferred = $q.defer();
          setTimeout(function() {
            var preOutboundData = newConfig; // angular.merge( {}, data, newConfig);
            //$log.log( ' preOutboundData = ', preOutboundData );
            var outboundData = JSON.stringify(  preOutboundData );
            //$log.log( ' outboundData = ', outboundData );
            fs.writeFile( file, outboundData, function (err, data ) {
              $rootScope.loadmaskOn = false;
              if(err) {
                deferred.reject(err);
                return;
              }
              deferred.resolve( data );
            } );
          }, 0);
          return deferred.promise;
        },
        mergeConfig: function( obj ) {
          var data = obj.data;
          var newConfig = obj.newConfig;
          //$log.log('mergeConfig', data, newConfig );
          var deferred = $q.defer();
          setTimeout(function() {
            try {
              deferred.resolve( angular.merge({}, data, newConfig) );
            } catch (err) {
              deferred.reject( err );
            }
          }, 0);
          return deferred.promise;
        },
        saveMergedConfig: function( obj ) {
          var data = obj.data;
          //$log.log('saveMergedConfig', data );
          var deferred = $q.defer();
          setTimeout(function() {
            try {
              fs.writeFile('./config.json', JSON.stringify( data ), function (err, data ) {
                $rootScope.loadmaskOn = false;
                if(err){
                  deferred.reject( err );
                  return;
                }
                deferred.resolve( data );
              });
            } catch (err) {
              deferred.reject( err );
            }
          }, 0) ;
          return deferred.promise;
        },
        readConfig: function() {
          return this.startLoad( { file:'./config.json', data: null, newConfig: null  } ).then( this.loadConfig ).finally( this.completeLoad );
        },
        saveConfig: function( config ) {
          return this.startLoad( { file:'./config.json', data: null, newConfig: config } ).then( this.loadConfig ).then( this.mergeAndSave ).finally( this.completeLoad );
        }
      };
    }])
    .factory('instagram',['$q','$log',function($q, $log){
      return {
        tagCount: function( parameter ){
          //var deferred = $q.defer();
          //setTimeout(function() {
          //  var https = require('https');
          //  var optionsget = {
          //    host: 'api.instagram.com',
          //    port: 443,
          //    path: '/v1/tags/' + + '/media/recent?access_token=ACCESS-TOKEN', // the rest of the url with parameters if needed
          //    method: 'GET' // do GET
          //  };
          //  console.info('Options prepared:');
          //  console.info(optionsget);
          //  console.info('Do the GET call');
          //  var reqGet = https.request(optionsget, function (res) {
          //    console.log("statusCode: ", res.statusCode);
          //    console.log("headers: ", res.headers);
          //    res.on('data', function (d) {
          //      console.info('GET result:\n');
          //      process.stdout.write(d);
          //      console.info('\n\nCall completed');
          //    });
          //  });
          //  reqGet.end();
          //  reqGet.on('error', function (e) {
          //    console.error(e);
          //  });
          //
          //
          //}, 0);
          //return deferred.promise;
          var deferred = $q.defer();
          setTimeout(function() {
            var ig = require('instagram-node').instagram();
            ig.use({ access_token: 'PullMyPics' });
            ig.use({ client_id: '718ad0f78d8b41b6b7ccd66f7ee0f98f', client_secret: '3acc3f9e6ad54f248d1eafc4dbf79e09' });
            ig.tag(parameter.hashTag, function(err, result, remaining, limit) {
              //$log.log('hello tag>>',err, result, remaining, limit );
              //$log.log(' there are '  + result.media_count + ' matching taged ittems' );
              if ( err ) {
                /**
                 // Available when the error comes from Instagram API
                 err.code;                // code from Instagram
                 err.error_type;          // error type from Instagram
                 err.error_message;       // error message from Instagram

                 // If the error occurs while requesting the API
                 err.status_code;         // the response status code
                 err.body;                // the received body
                 */
                deferred.reject( err );
                return;
              }
              deferred.resolve( { parameter: parameter, result: result, remaining:remaining, limit: limit } );
            });
          }, 0);
          return deferred.promise;
        },
        tagSearch: function( parameter ) {
          var deferred = $q.defer(),
              query = require('querystring'),
              https = require('https');


          //var i = 0;
          var cb = function ( hashTag, count, max_tag_id ){ // min_tag_id,
            var auth = {
              client_id: '718ad0f78d8b41b6b7ccd66f7ee0f98f',
              client_secret: '3acc3f9e6ad54f248d1eafc4dbf79e09'
            };
            var params = angular.extend( {}, auth, { count: count } );
            if ( max_tag_id ) {
               //angular.extend( params, { next_min_id: max_tag_id } );
              // angular.extend( params, { min_tag_id: max_tag_id } );
              // angular.extend( params, { max_tag_id: max_tag_id } );
              // angular.extend( params, { min_tag_id: max_tag_id, next_min_id: max_tag_id } );

              angular.extend( params, { max_tag_id: max_tag_id } );
            }
            var optionsget = {
              host: 'api.instagram.com',
              port: 443,
              path: '/v1/tags/' + hashTag + '/media/recent?' + query.stringify(params),
              method: 'GET'
            };

            $log.log('Calling server with the following ', params );

            var reqGet = https.request(optionsget, function (res) {
              //i = i + 1;
              //console.log("statusCode: ", res.statusCode);
              //console.log("headers: ", res.headers);

              var limit = parseInt(res.headers['x-ratelimit-limit'], 10) || 0;
              var remaining = parseInt(res.headers['x-ratelimit-remaining'], 10) || 0;

              var body = '';
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                deferred.notify( true );
                body += chunk;
              });

              res.on('end', function (d) {
                //deferred.notify( d );
                //console.info('GET result:\n');
                //console.info( JSON.parse(body) );
                try {
                  var results = JSON.parse(body);
                  //$log.log ('got results from the server ', results );
                  //if ( i >= 5 ) {
                  //  deferred.reject("to many requests.");
                  //  return;
                  //}
                  //if ( results && results.pagination.next_min_id ) {
                  //  deferred.notify( results );
                  //  cb( hashTag, count, results.pagination.next_min_id );
                  //  return;
                  //}
                  deferred.resolve( { limit: limit, remaining: remaining, data: results } );
                } catch (e) {
                  deferred.reject(e);
                  return;
                }


                //console.info('\n\nCall completed');
              });
            });
            reqGet.on('error', function (e) {
              console.error(e);
              deferred.reject(e);
            });
            reqGet.end();
          };

          setTimeout(function () {
            cb( parameter.hashTag, 999, null  );
          }, 0);

          return deferred.promise;
        }
      };
    }])
    .controller('HomeCtrl',['$scope', '$http',
      function ($scope, $http) {
        $scope.title ="Home";
        angular.extend($scope, {
          onClickCaptureMask: function(event){
            if ( $scope.maskOn ) {
              return suppress(event);
            } else {
              return event;
            }
          }
        });
      }
    ])
    .controller('CheckForUpdateCtrl',['$scope', '$http', '$log',
      function ($scope, $http, $log) {
        $scope.title ="Check For Update";
        $log.log('fired Check For Update');
      }
    ])
    .controller('PreferencesCtrl',['$scope', '$rootScope', 'configFactory', '$state', '$log',
      function ($scope, $rootScope, configFactory, $state, $log) {
        $scope.title = "Preferences";
        configFactory.readConfig().then(function( obj ) {
          if ( obj.data.outputPath == null || angular.isUndefined( obj.data.outputPath ) ) {
            obj.data.outputPath = process.cwd();
          }
          $scope.config = obj.data ;
        }, jQuery.proxy( captureMessage, this , $rootScope ) );
        angular.extend( $scope, {
          save: function() {
            configFactory.saveConfig( $scope.config ).then( function(config) { $state.go('home'); }, jQuery.proxy( captureMessage, this , $rootScope ));
          }
        });
      }
    ])
    .controller('ListCtrl', ['$scope', '$http', '$log',
      function ($scope, $http, $log) {
        $scope.title ="List";
        $log.log('List');
      }
    ])
    .controller('DetailCtrl', ['$scope', '$http', '$log',
      function ($scope, $http, $log) {
        $scope.title ="Detail";
        $log.log('Detail');
      }
    ])
    .controller('AboutCtrl', ['$scope', '$http', '$log',
      function ($scope, $http, $log) {
        $scope.title ="About";
        $log.log('About');
      }
    ])
    .controller('FindbyCtrl',['$scope', '$rootScope', 'instagram', '$log', '$q',
      function ($scope, $rootScope, instagram, $log, $q ) {
        $scope.total_count = null;
        $scope.running_count = 0;
        angular.extend( $scope, {
          submit: function( arg ) {
             if ( "hashtag" === arg ) {

               //instagram.tagCount( $scope.parameter ).then(
               //  function( payload ) {
               //    $scope.total_count = payload.result.media_count;
               //  },
               //  function( err ) {
               //    $log.log( err );
               //  }
               //);

               var buildWorkOrders = function aFunction( payload ) {
                 var deferred = $q.defer();
                 setTimeout(function () {
                   if (payload && payload.data && payload.data.data) {
                     var data = payload.data.data;
                     var workOrders = [];
                     for (var i = 0; i < data.length; i++) {
                       var obj = data[i];
                       if ( obj.images ) {
                         var images = obj.images;
                         var asset = { id:obj.id };
                         if ( images.low_resolution ) {
                           asset.lr = images.low_resolution.url;
                         }
                         if ( images.standard_resolution ) {
                           asset.sr = images.standard_resolution.url;
                         }
                         if ( images.thumbnail ) {
                           asset.tn = images.thumbnail.url;
                         }
                         if ( asset.lr || asset.sr || asset.tn ) {
                           workOrders.push ( asset );
                         }
                       }
                     }
                     deferred.resolve( workOrders );
                   } else {
                     deferred.reject();
                   }
                 }, 0);
                 return deferred.promise;
               };

               var processWorkOrders = function( workOrders ) {
                 var deferred = $q.defer();
                 setTimeout(function () {


                   var http = require('https');
                   var fs = require('fs');
                   for (var i = 0; i < workOrders.length; i++) {
                     var obj = workOrders[i];
                     if ( obj.lr ){
                       var url = obj.lr;
                       var request = http.get(url, function(response) {
                         var fileName = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
                         console.log( 'saving ' + fileName );
                         var file = fs.createWriteStream(fileName);
                         response.pipe(file);
                       });
                     }
                     if ( obj.sr ){
                       var url = obj.sr;
                       var request = http.get(obj.sr, function(response) {
                         var fileName = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
                         console.log( 'saving ' + fileName );
                         var file = fs.createWriteStream(fileName);
                         response.pipe(file);
                       });
                     }
                     if ( obj.tn ){
                       var url = obj.tn;
                       var request = http.get(obj.tn, function(response) {
                         var fileName = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);
                         console.log( 'saving ' + fileName );
                         var file = fs.createWriteStream(fileName);
                         response.pipe(file);
                       });
                     }
                   }
                   deferred.resolve( true );
                   //
                   // console.error(e);
                   // console.error(e.stack);
                   //
                   // var error;
                   //
                   // error = new Error("Invalid state");
                   // error.restifyError = new restify.errors.InternalError("Invalid state");
                   // deferred.reject(error);
                   //
                   // deferred.resolve( object );
                 }, 0);
                 return deferred.promise;
               };

               var catchError = function( err ) {
                 $log.log( 'error', err);
                 //if ( err.code === "ENOTFOUND" ) {
                 //  captureMessage( $rootScope, "Unable to contact Instagram. Are you off-line, or have a proxy?" );
                 //} else {
                 //  captureMessage( $rootScope, err.error_message || "Unknown Error" );
                 //}
               };

               instagram.tagSearch($scope.parameter)
                 .then( buildWorkOrders )
                 .then( processWorkOrders )
                 .catch( catchError );

               //var ig = require('instagram-node').instagram();
               //ig.use({ access_token: 'PullMyPics' });
               //ig.use({ client_id: '718ad0f78d8b41b6b7ccd66f7ee0f98f', client_secret: '3acc3f9e6ad54f248d1eafc4dbf79e09' });
               //var hdl = function(err, result, pagination, remaining, limit) {
               //  $log.log( result );
               //  // Your implementation here
               //  if(pagination.next) {
               //
               //    // pagination.next(hdl); // Will get second page results
               //  }
               //};
               //ig.tag_media_recent( 'joannafab40', { count: 3 } , hdl);



             }
          }
        });
      }
    ])
    .run(['$rootScope', '$state', '$stateParams',
      function ($rootScope, $state, $stateParams) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.applicationName = "Instagram Client";

        $rootScope.$on('LoadMaskEmit', function (event, data) {
          $rootScope.loadMaskOn = 'on' === data;
        });

      }
    ])
    .config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider){
        $urlRouterProvider.otherwise('/home');
        $stateProvider
          .state('home', {
            url: "/home",
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
          })
          .state('checkForUpdate', {
            url: "/checkForUpdate",
            templateUrl: 'partials/checkForUpdate.html',
            controller: 'CheckForUpdateCtrl'
          })
          .state('preferences', {
            url: "/preferences",
            templateUrl: 'partials/preferences.html',
            controller: 'PreferencesCtrl'
          })
          .state('quit', {
            url: "/quit",
            controller: function(){ process.exit(0); }
          })
          .state('list', {
            url: "/list",
            templateUrl: 'partials/list.html',
            controller: 'ListCtrl'
          })
          .state('about', {
            url: "/about",
            templateUrl: 'partials/about.html',
            controller: 'AboutCtrl'
          })
          .state('findby',{
            url: "/findby",
            templateUrl: 'partials/findby.html',
            controller: 'FindbyCtrl'
          })
          .state('findby.hashtag',{
            url: "/hashtag",
            templateUrl: 'partials/findby-hashtag.html',
            controller: 'FindbyCtrl'
          })
          .state('findby.location',{
            url: "/location",
            templateUrl: 'partials/findby-location.html',
            controller: 'FindbyCtrl'
          })
          .state('findby.name',{
            url: "/name",
            templateUrl: 'partials/findby-name.html',
            controller: 'FindbyCtrl'
          });

      }
    ])
    .directive('loadingMask', function () {
      return {
        restrict: 'A',
        link: function () { // scope) {
  //                            scope.$on('sasSpinnerEmit', function (event, data) {
  //                              scope.loadmaskOn = 'start' === data;
  //                            });
        }
      };
    });
  //                      .directive('spinner', function () {
  //                        return {
  //                          restrict: 'A',
  //                          link: function (scope, element) {
  //                            if (!scope.spinner) {
  //                              scope.spinner = new Spinner({
  //                                lines: 15, // The number of lines to draw
  //                                length: 0, // The length of each line
  //                                width: 12, // The line thickness
  //                                radius: 50, // The radius of the inner circle
  //                                corners: 0.8, // Corner roundness (0..1)
  //                                rotate: 0, // The rotation offset
  //                                direction: 1, // 1: clockwise, -1: counterclockwise
  //                                color: '#000', // #rgb or #rrggbb or array of colors
  //                                speed: 1.3, // Rounds per second
  //                                trail: 19, // Afterglow percentage
  //                                shadow: false, // Whether to render a shadow
  //                                hwaccel: false, // Whether to use hardware acceleration
  //                                className: 'spinner', // The CSS class to assign to the spinner
  //                                // zIndex: 2e9, // The z-index (defaults to 2000000000)
  //                                top: '50%', // Top position relative to parent
  //                                left: '50%' // Left position relative to parent
  //                              });
  //                            }
  //                            scope.$on('sasSpinnerEmit', function (event, data) {
  //                              if ('start' === data) {
  //                                scope.spinner.spin(element[0]);
  //                              } else {
  //                                scope.spinner.stop();
  //                              }
  //                            });
  //                          }
  //                        };
  //                      });

  require('nw.gui').Window.get().showDevTools();
}).call(this);
