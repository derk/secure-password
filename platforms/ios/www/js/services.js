angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('DB', function($q, DB_CONFIG, $window, $location, $state, $ionicViewService) {
  var self = this;
  self.db = null;
         
  self.init = function() {
         document.addEventListener("deviceready", function() {
                                   console.log('** cordova ready **');
                                   
             
    try{
      if(window.sqlitePlugin){
         
        // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
                                   //self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
        self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});

        angular.forEach(DB_CONFIG.tables, function(table) {
          var columns = [];
                         
          angular.forEach(table.columns, function(column) {
            columns.push(column.name + ' ' + column.type);
          });

          var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
          self.query(query);
                         
          console.log('Table ' + table.name + ' initialized');
        });
                                   
        self.query("select count(id) as cnt from users").then(function(result){
//        alert("result.rows.length: " + result.rows.length + " -- should be 1");
//        alert("result.rows.item(0).cnt: " + result.rows.item(0).cnt + " -- should be 1");
          if(result.rows.item(0).cnt < 1) {
            //$location.path('/setpin');
            $ionicViewService.nextViewOptions({
              disableBack: true
            });
            $state.go('setpin');
          }
        });
      } else {
                                   //alert("rejected");
      }
    } catch(e) {
                                   //alert("error throwb:: " + e);
    }
    }, false);
  };
  
  self.query = function(query, bindings) {
    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();
         
    self.db.transaction(function(transaction) {
      transaction.executeSql(query, bindings, function(transaction, result) {
        deferred.resolve(result);
      }, function(transaction, error) {
        deferred.reject(error);
      });
    });
         
    return deferred.promise;
  };
         
  self.fetchAll = function(result) {
    var output = [];
         
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
         
    return output;
  };
         
  self.fetch = function(result) {
    return result.rows.item(0);
  };
         
  return self;
})


.factory('Users', function(DB) {
  var self = this;
         
  self.all = function() {
         alert("in select all query users");
    return DB.query('SELECT * FROM users')
      .then(function(result){
      return DB.fetchAll(result);
    });
  };
         
  self.getPin = function() {
    return DB.query('SELECT pin FROM users WHERE id = 1')
      .then(function(result){
        return result.rows.item(0).pin;
    });
  };
         
  self.setPin = function(pin) {
    return DB.query("INSERT INTO users (id, pin, created, lastLogin) VALUES (1,?,datetime(),datetime())", [pin]);
  };
         
  return self;
})


.service('LoginService', function($q) {
  return {
    loginUser: function(name, pw) {
      var deferred = $q.defer();
      var promise = deferred.promise;
         
      if (name == 'gov' && pw == 'secret') {
        deferred.resolve('Welcome ' + name + '!');
      } else {
        deferred.reject('Wrong credentials.');
      }
      
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
    
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  }
});
