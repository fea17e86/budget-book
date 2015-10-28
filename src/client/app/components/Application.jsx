import React from 'react';

import Navigation from './Navigation.jsx';
import Layout from './Layout.jsx';

export default class Application extends React.Component {

  render() {
    return (
      <div>
        <Navigation selection={this.props.routes.length > 1 ? this.props.routes[1].path : ''}/>
        <Layout selection={this.props.routes.length > 1 ? this.props.routes[1].path : ''}>
          {this.props.children}
        </Layout>
      </div>
    );
  }
}
