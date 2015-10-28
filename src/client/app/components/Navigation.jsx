import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {

  render () {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">Budget Book</a>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className=""><Link to="/users">Users</Link></li>
              <li className=""><Link to="/accounts">Accounts</Link></li>
              <li className=""><Link to="/transactions">Transactions</Link></li>
              <li className=""><Link to="/reports">Reports</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
