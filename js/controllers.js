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
    .controller('CameraCtrl', function($scope, Camera, FileService, $ionicLoading) {
        $scope.show = function() {
            // $scope.loading = $ionicLoading.show({
            //     content: 'Uploading...'
            // });

        };
        $scope.hide = function() {
            // $scope.loading.hide();
        };
        $scope.getPhoto = function() {
            //  alert("calling getphoto");
            Camera.getPicture().then(function(imageURI) {
                // console.log(imageURI);
                $scope.lastPhoto = imageURI;
                $scope.$parent.photoUploaded = true;
                $scope.show();
                FileService.uploadFile(imageURI, function(success) {
                    if (success) {
                        //alert(imageURI);
                        $scope.hide();
                    }
                    else {
                        $scope.hide();
                        alert("Please take photo again.");
                    }
                });
            }, function(err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };
    }).
controller('NewChallengeCtrl', function($scope, $rootScope, $http, $location, FileService) {
    $scope.photoUploaded = false;
    $scope.challenge = {
        createChallenge: function(challengeform) {
            if (challengeform.$invalid)
                return false;
            // alert(FileService.getFileName());
            // alert();
            // $scope.data=angular.copy(data);
            var photoFileName = FileService.getFileName();
            if (photoFileName.length > 0) {

                $scope.challenge.photoFileName = photoFileName;
                var challenge_data = angular.toJson($scope.challenge);
                // var photoFileName=FileService.getFileName();
                // alert(photoFileName);
                //challenge_data.photoFileName=photoFileName;
                alert("challenge_data is:");
                alert(challenge_data);
                // var data=;
                // data.chal_name=challenge_data.name;
                // data.chal_desc=challenge_data.description;
                // data.chal_pic_list=challenge_data.photoFileName;

                //  alert(challenge_data);

                $http.post($rootScope.ServiceUrl + "/createChallenge", challenge_data)
                    .success(function(data) {
                        if (data.success) {
                            console.log(data);
                            // $scope.profile = data.profile;
                            $location.path('/app/profile');
                        }
                        else {
                            $rootScope.$emit('OAuthException');
                        }
                        // fb.$push(data);
                    });
            }
            else {
                alert("Please capture some image.");
            }


        }
    }
});