angular.module('swachhbharat.controllers', [])

.controller('AppCtrl', function($scope, $state, OpenFB) {

    $scope.logout = function() {
        OpenFB.logout();
        window.sessionStorage['user_id'] = undefined;
        $state.go('login');
    };

    $scope.revokePermissions = function() {
        OpenFB.revokePermissions().then(
            function() {
                $state.go('login');
            },
            function() {
                alert('Revoke permissions failed');
            });
    };

})

.controller('LoginCtrl', function($scope, $rootScope, $http, $location, OpenFB) {
    // var ref = new Firebase("https://swachhbharat.firebaseio.com");

    //   var fb=$firebase(ref);
    $scope.login = function(provider, username, password) {
        switch (provider) {
            case 'facebook':
                $scope.facebookLogin();
                break;

            default:
                // code
        }
    };

    $scope.facebookLogin = function() {

        OpenFB.login('email,read_stream,publish_stream,user_friends').then(
            function() {

                OpenFB.get('/me').success(function(user) {
                    $scope.postLoginData(user, 'fb');
                });

                //    fb.$push({ uid: "hi" });
                // return window.sessionStorage['auth_token'];
                // $location.path('/app/person/me/feed');
            },
            function() {
                alert('OpenFB login failed');
            });
    };

    $scope.postLoginData = function(user, provider) {
        // window.sessionStorage.id=user.id;
        // var auth_token={};
        // data.id=user.id;
        var auth_token = window.sessionStorage['auth_token'];
        // data.auth_provider=provider;
        $http.post($rootScope.ServiceUrl + "/login", {
                "data": null,
                "auth_token": auth_token,
                "auth_provider": provider
            })
            .success(function(data) {
                if (data.success) {
                    window.sessionStorage['auth_token'] = data.auth_token;
                    window.sessionStorage['user_id'] = data.user_id;
                    $location.path('/app/person/me/feed');
                }
                // fb.$push(data);
            });

    };


})

.controller('ShareCtrl', function($scope, OpenFB) {

    $scope.item = {};

    $scope.share = function() {
        OpenFB.post('/me/feed', $scope.item)
            .success(function() {
                $scope.status = "This item has been shared on OpenFB";
            })
            .error(function(data) {
                alert(data.error.message);
            });
    };

})

.controller('ProfileCtrl', function($scope, $rootScope, $location, OpenFB, $http) {
    $http.get($rootScope.ServiceUrl + "/profile")
        .success(function(data) {
            if (data.success) {
                console.log(data);
                $scope.profile = data.profile;
                $location.path('/app/profile');
            }
            else {
                $rootScope.$emit('OAuthException');
            }
            // fb.$push(data);
        });
})

.controller('PersonCtrl', function($scope, $stateParams, OpenFB) {
    OpenFB.get('/' + $stateParams.personId).success(function(user) {
        $scope.user = user;
    });
})

.controller('FriendsCtrl', function($scope, $stateParams, OpenFB) {
    // console.log($stateParams);
    OpenFB.get('/' + $stateParams.personId + '/friends', {
            limit: 50
        })
        .success(function(result) {
            console.log(result);
            $scope.friends = result.data;
            // console.log($scope.friends);
        })
        .error(function(data) {
            alert(data.error.message);
        });
})

.controller('MutualFriendsCtrl', function($scope, $stateParams, OpenFB) {
    OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {
            limit: 50
        })
        .success(function(result) {
            $scope.friends = result.data;
        })
        .error(function(data) {
            alert(data.error.message);
        });
})

.controller('FeedCtrl', function($scope, $stateParams, OpenFB, $ionicLoading) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading...'
            });
        };
        $scope.hide = function() {
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            OpenFB.get('/' + $stateParams.personId + '/home', {
                    limit: 30
                })
                .success(function(result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    //  alert('hi');
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    })
    .controller('NominationCtrl', function($scope, $stateParams, OpenFB) {
        //  console.log($stateParams);
        OpenFB.get('/' + $stateParams.personId + '/friends', {
                limit: 50
            })
            .success(function(result) {
                $scope.friends = result.data;
                console.log($scope.friends);
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })
    .controller('CameraCtrl', function($scope, Camera,FileService) {
        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
                FileService.uploadFile(imageURI);
            }, function(err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };
    });