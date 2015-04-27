angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};
            
  $scope.login = function() {
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
      $state.go('tab.dash');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    })
  }
})

.controller('UnlockCtrl', function($scope, $location, $timeout) {
  $scope.init = function() {
    $scope.passcode = "";
            
  }
                      
  $scope.add = function(value) {
    if($scope.passcode.length < 4) {
      $scope.passcode = $scope.passcode + value;
    }
    if($scope.passcode.length == 4) {
      $timeout(function() {
        alert("The four digit code was entered");
      }, 500);
    }
  }
                      
  $scope.delete = function() {
    if($scope.passcode.length > 0) {
      $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
    }
  }
                      
});


