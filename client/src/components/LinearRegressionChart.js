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
    // TO DO - Calculate regression data dynamically on button click

    return Object.keys(data.data).map((key, index) => {
      const xyData = data.data[key].map(item => {
        return [item.serverLoad, item.responseTime];
      })
      const regressionData = regression.linear(xyData);
      const { points } = regressionData;

      return {
        server: key,
        regressionPoints: points,
        points: data.data[key].map((item, index) => {
          return {
            x: item.serverLoad,
            y: item.responseTime,
            yhat: points[index][1]
          };
        })
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
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom().scale(x).ticks(20)

    const yAxis = d3.axisLeft().scale(y).ticks(20)

    const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let fullData = [];

    data.forEach(dataSet => {
      fullData.push(dataSet.points);
    })

    fullData = fullData.flat();
    const xData = fullData.map(point => point.x);

    const yData = fullData.map(point => point.y);
    const maxX = Math.max(...xData);
    const maxY = Math.max(...yData);
    const minX = Math.min(...xData);
    const minY = Math.min(...yData);

    // TO DO - Create line dynamically on button click
    const line = d3.line()
      .x((d) => {
        return x(d.x);
      })
      .y((d) => {
        return y(d.yhat);
      });

    y.domain([minY - 1, maxY + 1]);
    x.domain([minX - 0.5, maxX + 0.5]);

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

    data.forEach((dataSet, index) => {
      const { points } = dataSet;

      points.forEach((d) => {
        d.x = +d.x;
        d.y = +d.y;
        d.yhat = +d.yhat;
      });

      svg.selectAll("dot")
        .data(points)
        .enter().append("circle")
        .attr("class", `dot${index + 1}`)
        .attr("r", 3.5)
        .attr("cx", (d) => {
            return x(d.x);
        })
        .attr("cy", (d) => {
            return y(d.y);
        });

      // TO DO - Create line dynamically on button click
      svg.append("path")
        .datum(points)
        .attr("class", `line${index + 1}`)
        .attr("d", line);
    })
  }

  return (<div></div>);
}

export default LinearRegressionChart;