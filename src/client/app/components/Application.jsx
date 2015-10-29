import React from 'react';

import 'whatwg-fetch';

import Navigation from './Navigation.jsx';
import Layout from './Layout.jsx';

export default class Application extends React.Component {

  static intialState = {
    accounts: [],
    proxies: [],
    reports: [],
    transactions: [],
    users: [],
    errors: []
  }

  componentDidMount () {
    console.log('componentDidMount', fetch);
    var self = this;
    fetch('/api/state')
    .then(function (response) {
      console.log('response', response);
      return response.json();
    }).then(function (json) {
      console.log('json', json);
      self.setState(json);
    }).catch(function (ex) {
      self.setState({errors: [ex]});
    });
  }

  render () {
    return (
      <div>
        <Navigation selection={this.props.routes.length > 1 ? this.props.routes[1].path : ''}/>
        <Layout selection={this.props.routes.length > 1 ? this.props.routes[1].path : ''} state={this.state }>
          {this.props.children}
        </Layout>
      </div>
    );
  }
}
