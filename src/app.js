var Users = require('./models/users.js'),
    Accounts = require('./models/accounts.js');

function getUsers (callback) {
  Users.list(callback);
}

function initUsers (callback) {
  Users.set([{name: 'tobias'}, { name: 'cynthia'}], callback);
}

function receiveUsers (err, users) {
  if (users && users.length > 0) {
    console.log('users', users);
    for (var i=0; i<users.length; i++) {
      getAccounts(users[i], createReceiveAccounts(users[i]));
    }
  } else {
    initUsers(receiveUsers);
  }
}

function getAccounts (user, callback) {
  Users.accounts(user, callback);
}

function initAccounts (user, callback) {
  Accounts.set({ name: 'Bargeld', type: Accounts.type.cash, balance: 0, owner: user._id }, callback);
}

function createReceiveAccounts (user) {
  var callback = function (err, accounts) {
    if (accounts && (!Array.isArray(accounts) || accounts.length > 0)) {
      console.log(user.name, 'accounts', accounts);
    } else {
      initAccounts(user, callback);
    }
  };

  return callback;
}

getUsers(receiveUsers);
