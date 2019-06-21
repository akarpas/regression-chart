import React, { useEffect, useState } from 'react';
import regression from 'regression';
import * as d3 from 'd3';

import './LinearRegressionChart.css';

const LinearRegressionChart = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/data')
      .then(response => response.json())
      .then(data => {
        setGraphData(data);
        const parsedData = parseData(data);
        drawChart(parsedData);
      })
    return;
  }, []);

  const parseData = (data) => {
    const parsedData = data.data.server_1.map(item => {
      return [item.serverLoad, item.responseTime];
    })

    const result = regression.linear(parsedData);
    const { points } = result;

    return points.map((point, index) => {
      return {
        yhat: point[1],
        y: parsedData[index][1],
        x: parsedData[index][0]
      }
    })
  }

  const drawChart = (data) => {
    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, width]);
    console.warn(x);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom().scale(x)

    const yAxis = d3.axisLeft().scale(y)

    const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach((d) => {
      d.x = +d.x;
      d.y = +d.y;
      d.yhat = +d.yhat;
    });

    const line = d3.line()
    .x((d) => {
        return x(d.x);
    })
    .y((d) => {
        return y(d.yhat);
    });

    x.domain(d3.extent(data, (d) => {
      return d.x;
    }));
    y.domain(d3.extent(data, (d) => {
      return d.y;
    }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("X-Value");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y-Value")

    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", (d) => {
          return x(d.x);
      })
      .attr("cy", (d) => {
          return y(d.y);
      });

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  }

  return (<div></div>);
}

export default LinearRegressionChart;
