import React, {Component} from 'react';
import * as d3 from 'd3';
import {withFauxDOM} from 'react-faux-dom';

class Scatterplot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    const faux = this.props.connectFauxDOM('div', 'chart');
    const width = 800;
    const height = 600;
    const margin = {top: 20, right: 120, bottom: 20, left: 20};
    const radius = 5;

    const component = this;
    let svg = d3.select(faux).append('svg');

/*
    {
      "Time": "36:50",
      "Place": 1,
      "Seconds": 2210,
      "Name": "Marco Pantani",
      "Year": 1995,
      "Nationality": "ITA",
      "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
      "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
    }
*/
    const onNameHover = function (event) {
      console.log("hover trigered:", event);
    };

    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, data) {
      const minTime = d3.min(data, d => d.Seconds);
      data.forEach( d => d.retard = d.Seconds - minTime );

      // scales
      const xMax = d3.max(data, d => d.retard);
      const xMin = d3.min(data, d => d.retard);
      const yMax = d3.max(data, d => d.Place);
      const yMin = d3.min(data, d => d.Place);

      const xScale = d3.scaleLinear()
        .domain([xMin, xMax + 10])
        .range([width - margin.right, margin.left]);

      const yScale = d3.scaleLinear()
        .domain([yMin, yMax + 2])
        .range([margin.top, height - margin.bottom]);

      let groups = svg.selectAll('g')
        .data(data)
        .enter().append('g');

      groups.append('circle')
        .attr('cx', d => xScale(d.retard))
        .attr('cy', d => yScale(d.Place))
        .attr('r', radius)
        .attr('fill', d => d.Doping.length > 0 ? "tomato" : "green");

      groups.append('text')
        .attr('x', d => xScale(d.retard))
        .attr('y', d => yScale(d.Place))
        .attr('dx', 10)
        .attr('dy', 5)
        .attr('text-anchor', 'start')
        .text(d => d.Name)
        .style('font-size', "12px");

      groups.on('mouseover', () => {
        console.log("hover");
        component.onNameHover();
      });

      // axis
      const xAxis = d3.axisBottom().ticks(5).tickFormat( d => {
        return `${Math.floor(d / 60)}:${d % 60}`;
      }).scale(xScale);
      const yAxis = d3.axisLeft().scale(yScale);

      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

      component.props.animateFauxDOM(800);
    });

  }

  render() {
    return (
      <div>
        <h2>Dope in Cycle sport</h2>
        <div className="rendereD3">
          {this.props.chart}
        </div>
      </div>
    );
  }
}

Scatterplot.defaultProps = {
  chart: 'loading'
};

export default withFauxDOM(Scatterplot);