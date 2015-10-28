import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

export default class UserForm extends React.Component {
  handleDelete () {
    var id = this.refs.id.value();
    this.props.onDelete({id: id});
  }

  handleSubmit () {
    var id = this.refs.id.value();
    var name = this.refs.name.value().trim();
    this.props.onSubmit({id: id, name: name});
  }

  render () {
    return (
      <form>
        <input type="hidden" name="id" value=""/>
        <div className="form-group">
          <label htmlFor="inputName">Name</label>
          <input type="text" name="name" className="form-control" id="inputName" placeholder="Name" value=""/>
        </div>
        <button type="button" className="btn btn-default" onclick={this.handleSubmit}>Submit</button>
        <button type="button" className="btn btn-danger" onclick={this.handleDelete}>Delete</button>
      </form>
    );
  }
}
