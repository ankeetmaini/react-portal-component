import React, { Component } from 'react';
import { render } from 'react-dom';
import Portal from './../../src/index';

export default class ComplexDialog extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div>
        <h1>ComplexExample: Below is a complex portal</h1>
        <hr />
        <Portal />
      </div>
    );
  }
}

const div = document.createElement('div');
div.setAttribute('id', 'complex-div');
document.body.appendChild(div);

render(<ComplexDialog />, div);
