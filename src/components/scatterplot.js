import React, {Component} from 'react';
import * as d3 from 'd3';
import {withFauxDOM} from 'react-faux-dom';
import Tooltip from './tooltip';

class Scatterplot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOn: false,
      tooltipDatas: null
    };
  }

  onNameMouseOver(event) {
    this.setState({ tooltipOn: true, tooltipDatas: event });
  }

  onNameMouseOut() {
    this.setState({ tooltipOn: false });
  }

  componentDidMount () {
    if (!this.props.error) {

      const data = this.props.datas;
      const faux = this.props.connectFauxDOM('div', 'chart');
      const width = 800;
      const height = 600;
      const margin = {top: 80, right: 120, bottom: 50, left: 50};
      const radius = 5;
      const legendX = 500;
      const legendY = 400;
      const component = this;

      let svg = d3.select(faux).append('svg');

      const minTime = d3.min(data, d => d.Seconds);
      data.forEach(d => d.retard = d.Seconds - minTime);

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
        .enter().append('g')
        .style('cursor', 'pointer');

      groups.append('circle')
        .attr('cx', d => xScale(d.retard))
        .attr('cy', d => yScale(d.Place))
        .attr('r', radius)
        .attr('fill', d => d.Doping.length > 0 ? "tomato" : "limegreen");

      groups.append('text')
        .attr('x', d => xScale(d.retard))
        .attr('y', d => yScale(d.Place))
        .attr('dx', 10)
        .attr('dy', 5)
        .attr('text-anchor', 'start')
        .text(d => d.Name)
        .style('font-size', "12px");

      groups.on('mouseover', (e) => {
        clearTimeout(component.tooltipTimeout);
        component.onNameMouseOver(e);
      });

      groups.on('mouseout', (e) => {
        component.tooltipTimeout = setTimeout( () => {
          component.onNameMouseOut(e);
        }, 250);
      });

      // axis
      const xAxis = d3.axisBottom().ticks(5).tickFormat(d => {
        return `${Math.floor(d / 60)}:${d % 60}`;
      }).scale(xScale);
      const yAxis = d3.axisLeft().scale(yScale);

      let xAxisG = svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`);

      xAxisG.append('text')
        .attr('y', '40')
        .attr('x', `${width / 2}`)
        .style('text-anchor', 'middle')
        .style('font-size', '16px')
        .attr('fill', 'black')
        .text(' minutes behind fastest time');

      xAxisG.call(xAxis);

      let yAxisG = svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`);

      yAxisG.append('text')
        .attr('transform','rotate(-90)')
        .attr('y', `-25`)
        .attr('x', `${-margin.top}`)
        .style('text-anchor', 'end')
        .style('font-size', '16px')
        .attr('fill', 'black')
        .text('Ranking');

      yAxisG.call(yAxis);

      let legend = svg.append('g')
        .attr('class','legend');

      let firstLegend = legend.append('g');
      firstLegend.append('circle')
        .attr('cx', legendX)
        .attr('cy', legendY)
        .attr('r', radius)
        .attr('fill', "limegreen");

      firstLegend.append('text')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('dx', 10)
        .attr('dy', 5)
        .attr('text-anchor', 'start')
        .text('No doping allegation')
        .style('font-size', "12px");

      let secondLegend = legend.append('g');
      secondLegend.append('circle')
        .attr('cx', legendX)
        .attr('cy', legendY + 20)
        .attr('r', radius)
        .attr('fill', "tomato");

      secondLegend.append('text')
        .attr('x', legendX)
        .attr('y', legendY + 20)
        .attr('dx', 10)
        .attr('dy', 5)
        .attr('text-anchor', 'start')
        .text('Riders with doping allegations')
        .style('font-size', "12px");

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('Doping in Professional Bicycle Racing')
        .attr('class', "title1");

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .text('35 Fastest times up Alpe d\'Huez')
        .attr('class', "title2");

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 80)
        .attr('text-anchor', 'middle')
        .text('normalized to 13.8km distance')
        .attr('class', "title3");

      component.props.animateFauxDOM(800);

    }

  }

  render() {
    return (
      <div className="chart">
        {/*<h2>Doping in Professional Bicycle Racing</h2>*/}
        <Tooltip
          show = {this.state.tooltipOn}
          datas = {this.state.tooltipDatas}
        />
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