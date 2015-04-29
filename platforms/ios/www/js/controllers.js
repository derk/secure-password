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

//.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
//  $scope.data = {};
//            
//  $scope.login = function() {
//    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
//      $state.go('tab.dash');
//    }).error(function(data) {
//      var alertPopup = $ionicPopup.alert({
//        title: 'Login failed!',
//        template: 'Please check your credentials!'
//      });
//    })
//  }
//})

.controller('UnlockCtrl', function($scope, $location, $timeout, DB, Users, $ionicViewService, $state) {
            
  $scope.init = function() {
    $scope.passcode = "";
  }
                      
  $scope.add = function(value) {
    if($scope.passcode.length < 4) {
      $scope.passcode = $scope.passcode + value;
    }
    if($scope.passcode.length == 4) {
      Users.getPin().then(function (pin) {
        if(pin == $scope.passcode) {
          $ionicViewService.nextViewOptions({
            disableBack: true
          });
          $state.go('tab.dash');
        } else {
          alert("passcodes do not match... try again");
        }
            
      });
            //      $timeout(function() {
//        alert("The four digit code was entered");
//      }, 500);
    }
  }
                      
  $scope.delete = function() {
    if($scope.passcode.length > 0) {
      $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
    }
  }
                      
})

.controller('SetPinCtrl', function($scope, $location, $timeout, Users, $ionicViewService, $state) {
  $scope.init = function() {
    $scope.setPasscode = "";
    $scope.confirmPasscode = "";
    $scope.lineDone = false;
  }
            
  $scope.add = function(value) {
    if($scope.setPasscode.length < 4) {
      $scope.setPasscode = $scope.setPasscode + value;
    }

    if($scope.confirmPasscode.length < 4 && $scope.lineDone) {
      $scope.confirmPasscode = $scope.confirmPasscode + value;
    }
    if($scope.confirmPasscode.length == 4 && $scope.lineDone) {
      if($scope.setPasscode == $scope.confirmPasscode) {
        Users.setPin($scope.setPasscode);
        $ionicViewService.nextViewOptions({
          disableBack: true
        });
        $state.go('tab.dash');
      } else {
        alert("The numbers do not match, please enter them again....");
      }
    }
    
    if($scope.setPasscode.length == 4 && !$scope.lineDone) {
      $scope.lineDone = true;
//           $timeout(function() {
//                     alert("The four digit code was entered");
//                     }, 500);
    }
  }
            
  $scope.delete = function() {
    if($scope.confirmPasscode.length > 0) {
      $scope.confirmPasscode = $scope.confirmPasscode.substring(0, $scope.confirmPasscode.length - 1);
    } else if($scope.setPasscode.length > 0) {
            $scope.lineDone = false;
      $scope.setPasscode = $scope.setPasscode.substring(0, $scope.setPasscode.length - 1);
    }
  }
            
            
})

.controller('DocumentCtrl', function($scope, Document) {
  $scope.documents = [];
  $scope.document = null;
  
  // Get all the documents
  Document.all().then(function(documents){
    $scope.documents = documents;
  });
  
  // Get one document, example with id = 2
  Document.getById(2).then(function(document) {
    $scope.document = document;
  });
});