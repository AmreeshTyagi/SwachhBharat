angular.module('swachhbharat', ['ionic', 'openfb', 'swachhbharat.controllers', 'firebase'])
    .factory('tokenInjector', [function() {
        var tokenInjector = {
            request: function(config) {
                if (window.sessionStorage['auth_token'] != null || typeof window.sessionStorage['auth_token'] != 'undefined') {
                    config.headers['sb-auth-token'] = window.sessionStorage['auth_token'];
                    config.headers['sb-user-id'] = window.sessionStorage['user_id'];
                }
                return config;
            }
        };
        return tokenInjector;
    }])
    .factory('Camera', ['$q', function($q) {
        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
<<<<<<< HEAD
    }]).
factory('FileService',function($rootScope) {
    
        return {
            uploadFile: function(imageURI) {
                var ft = new FileTransfer(),
                    options = new FileUploadOptions();

                options.fileKey = "file";
                options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                    "description": "Uploaded from my phone"
                };

                ft.upload(imageURI, $rootScope.ServiceUrl + "/upload",
                    function(e) {
                      alert("file uploaded");
                    },
                    function(e) {
                        alert("Upload failed");
                    }, options);
            }
        }
    })
    .config(function($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('tokenInjector');
    }])
    .run(function($rootScope, $state, $ionicPlatform, $window, OpenFB, $firebase, $http) {
        $rootScope.FbAppId = '383399838503387';
=======
    };
    return tokenInjector;
}])
.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})
.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('tokenInjector');
}])
 .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB,$firebase,$http) {
$rootScope.FbAppId='383399838503387';
>>>>>>> origin/app
        OpenFB.init($rootScope.FbAppId);
        $rootScope.ServiceUrl = "https://server-batman-1.c9.io";

        var ref = new Firebase("https://swachhbharat.firebaseio.com/users");

        var fb = $firebase(ref);

        // fb.$set({ name: "Swach Bharat App" });
        //   fb.$set({uid:"saisasasih"});
        //      $http.get($rootScope.ServiceUrl+"loginStatus")
        // 		 .success(function(data){
        // 		        fb.$push(data);
        // 		 });

        // fb.$push();

        //         fb.on("value", function(snapshot) {
        //   console.log(snapshot.val());
        // }, function (errorObject) {
        //   console.log("The read failed: " + errorObject.code);
        // });

        $ionicPlatform.ready(function() {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "login" && toState.name !== "logout" && !$window.sessionStorage['auth_token']) {

                $state.go('login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('login');
        });

    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/tabs.html",
            controller: "AppCtrl"
        })

        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginCtrl"
                // views: {
                //     'menuContent': {

            //     }
            //}
        })

        .state('app.logout', {
            url: "/logout",
            views: {
                'menuContent': {
                    templateUrl: "templates/logout.html",
                    controller: "LogoutCtrl"
                }
            }
        })

        .state('app.profile', {
            url: "/profile",
            views: {
                'tab-profile': {
                    templateUrl: "templates/profile.html",
                    controller: "ProfileCtrl"
                }
            }
        })

        .state('app.share', {
            url: "/share",
            views: {
                'menuContent': {
                    templateUrl: "templates/share.html",
                    controller: "ShareCtrl"
                }
            }
        })

        .state('app.friends', {
                url: "/person/:personId/friends",
                views: {
                    'tab-friends': {
                        templateUrl: "templates/friend-list.html",
                        controller: "FriendsCtrl"
                    }
                }
            })
            .state('app.mutualfriends', {
                url: "/person/:personId/mutualfriends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/mutual-friend-list.html",
                        controller: "MutualFriendsCtrl"
                    }
                }
            })
            .state('app.person', {
                url: "/person/:personId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/person.html",
                        controller: "PersonCtrl"
                    }
                }
            })
            .state('app.feed', {
                url: "/person/:personId/feed",
                views: {
                    'tab-feeds': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            }).
        state('app.nomination', {
            url: "/person/:personId/nomination",
            views: {
                'tab-nomination': {
                    templateUrl: "templates/nomination.html",
                    controller: "NominationCtrl"
                }
            }
        }).
        state('take-photo', {
            url: "/takephoto",
            templateUrl: "templates/new-challenge.html",
            controller: "CameraCtrl"
                // views: {
                //     'menuContent': {

            //     }
            //}
        });

        // fallback route
        $urlRouterProvider.otherwise('/app/person/me/feed');

    });
