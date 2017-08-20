import React, { Component } from 'react';
import * as d3 from 'd3';
import Scatterplot from './components/scatterplot';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: null,
      error: null
    };
  }

  componentDidMount () {
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, datas) {
      if (err)
        this.setState({ error: err });
      else
        this.setState({ datas });
    }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React D3 Scatterplot Graph</h1>
        </div>
        <div className="App-body">
          {this.state.datas &&
          <Scatterplot
            datas = {this.state.datas}
            error = {this.state.error}
          />}
        </div>
      </div>
    );
  }
}

export default App;
