import React from 'react';

export default class Layout extends React.Component {

  static defaultProps = {
    upperCase: function (str) {
      return str ? str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      }) : 'Home';
    }
  }

  render () {

    return (
      <div id="main_content" className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 main">
            <h1 className="page-header">{this.props.upperCase(this.props.selection)}</h1>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
