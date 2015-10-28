import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

import Application from './components/Application.jsx';
import Summary from './components/Summary.jsx';
import Container from './components/Container.jsx';

import UserList from './components/users/UserList.jsx';
import UserForm from './components/users/UserForm.jsx';

import AccountList from './components/accounts/AccountList.jsx';
import TransactionList from './components/transactions/TransactionList.jsx';
import ReportList from './components/reports/ReportList.jsx';

ReactDOM.render((
  <Router>
    <Route path="/" component={Application}>
      <IndexRoute component={Summary}/>
      <Route path="users" component={Container}>
        <IndexRoute component={UserList}/>
        <Route path="new" component={UserForm}/>
        <Route path="edit" component={UserForm}/>
      </Route>
      <Route path="accounts" component={Container}>
        <IndexRoute component={AccountList}/>
      </Route>
      <Route path="transactions" component={Container}>
        <IndexRoute component={TransactionList}/>
      </Route>
      <Route path="reports" component={Container}>
        <IndexRoute component={ReportList}/>
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));
