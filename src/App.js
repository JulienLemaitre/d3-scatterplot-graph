import React, { Component } from 'react';
import Scatterplot from './components/scatterplot';
import './App.css';

// TODO rapatrier le fetch de données ici et les envoyer au Scatterplot.
// Ne pas faire ça au niveau du composant

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React D3 Scatterplot Graph</h1>
        </div>
        <div className="App-body">
          <Scatterplot />
        </div>
      </div>
    );
  }
}

export default App;
