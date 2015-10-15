var express = require('express');
var router = express.Router();
var users = require('../models/users');

router.get('/', function (req, res, next) {
  users.list(function (err, users) {
    if (err) {
      res.render('error', {message: 'Error occured while getting the user list', error: err});
    } else {
      console.log('/users', 'users:', JSON.stringify(users));
      res.render('users', {
        project: {name: 'Budget Book', active: 'users'},
        title: 'Users',
        users: users,
        helpers: {
          selectedClass: function () {return '';}
        }
      });
    }
  });
});

router.get('/:id', function (req, res, next) {
  users.list(function (err, users) {
    if (err) {
      res.render('error', {message: 'Error occured while getting the user list', error: err});
    } else {
      var id = req.params.id;
      var selected;
      for (var i=0; i<users.length; i++) {
        if (users[i]._id === id) {
          selected = users[i];
          break;
        }
      }
      console.log('/users/'+ id, 'selected:', JSON.stringify(selected), 'users:', JSON.stringify(users));
      res.render('users', {
        project: {name: 'Budget Book', active: 'users'},
        title: 'Users',
        users: users,
        selected: selected,
        helpers: {
          selectedClass: function (id) {
            return selected._id === id ? 'active' : '';
          }
        }
      });
    }
  });
});

router.post('/new', function (req, res, next) {
  var name = req.body.name;
  console.log('/users/new', 'name:', name);
  if (name) {
    var newUser = {name: name};
    users.get(newUser, function (err, user) {
      if (err) {
        res.render('error', {message: 'Error occured while looking for users with the name "'+ name +'"', error: err});
      }
      if (!user || user.length === 0) {
        users.add(newUser, function (err, user) {
          if (err) {
            res.render('error', {message: 'Error occured while adding new user with the name "'+ name +'"', error: err});
          } else {
            console.log('created user: ', JSON.stringify(user));
            res.render('success', {message: 'The user '+ name +' has been created', url: '/users'});
          }
        });
      } else {
        res.render('error', {message: 'The user with the name "'+ name +'" already existed'});
      }
    });
  } else {
    res.render('error', {message: 'Please enter a name'});
  }
});

router.post('/update', function (req, res, next) {
  var id = req.body.id;
  var name = req.body.name;
  console.log('/users/update', 'id:', id, 'name:', name);
  if (id && name) {
    var updatedUser = {name: name, _id: id};
    users.update(updatedUser, function (err, user, numUpdated) {
      if (err) {
        res.render('error', {message: 'Error occured while updating user '+ JSON.stringify(updatedUser), error: err});
      }
      if (numUpdated === 1) {
        console.log('updated user: ', JSON.stringify(user));
        res.render('success', {message: 'The user '+ name +' has been updated', url: '/users'});
      } else {
        res.render('error', {message: 'The user with the id "'+ id +'" couldn´t be updated'});
      }
    });
  } else {
    res.render('error', {message: (id ? 'Please enter a name' : 'The user id was missing')});
  }
});

router.post('/remove', function (req, res, next) {
  var id = req.body.id;
  console.log('/users/remove', 'id:', id);
  if (id) {
    var user = {_id: id};
    users.remove(user, function (err, numRemoved) {
      if (err) {
        res.render('error', {message: 'Error occured while removing user '+ JSON.stringify(updatedUser), error: err});
      }
      if (numRemoved === 1) {
        console.log('removed user: ', id);
        res.render('success', {message: 'The user with the id "'+ id +'" has been removed', url: '/users'});
      } else {
        res.render('error', {message: 'The user with the id "'+ id +'" couldn´t be removed'});
      }
    });
  } else {
    res.render('error', {message: 'The user id was missing'});
  }
});

module.exports = router;
