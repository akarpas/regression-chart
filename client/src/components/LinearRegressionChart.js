import React, { useEffect, useLayoutEffect } from 'react';
import { parseData, calculateRegressions } from '../utils/dataParser';
import * as d3 from 'd3';

import './LinearRegressionChart.css';

const LinearRegressionChart = (props) => {
  const { columnType, xAxisLabel, margin, width, height, showLines } = props;

  useEffect(() => {
    drawChart(props.data)
  }, [props.columnType]); // eslint-disable-line

  useLayoutEffect(() => {
    if (showLines) {
      addLines(props.data);
    } else {
      removeLines();
    }
  }, [showLines]); // eslint-disable-line
  const removeLines = () => {
    d3.selectAll("path.line").remove();
  }

  const addLines = (data) => {
    const parsedData = parseData(data, columnType);
    const { maxX, maxY, minX, minY } = getMaxMin(parsedData);
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const regressionData = calculateRegressions(data, columnType);

    y.domain([minY - 1, maxY + 1]);
    x.domain([minX - 0.5, maxX + 0.5]);

    regressionData.forEach((dataSet, index) => {
      const { points } = dataSet;
      const line = d3.line()
        .x((d) => x(d.x))
        .y((d) => y(d.yhat));

      d3.select("svg").select("g").append("path")
        .datum(points)
        .attr("class", `line${index + 1} line`)
        .attr("d", line);
    });
  }

  const drawChart = (data) => {
    const parsedData = parseData(data, columnType);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const makeGridLines = type => {
      return type === 'x'
        ? d3.axisBottom(x).ticks(10)
        : d3.axisLeft(y).ticks(10);
    }

    const xAxis = d3.axisBottom().scale(x).ticks(20);
    const yAxis = d3.axisLeft().scale(y).ticks(20);

    if (!d3.select("#chart svg").empty()) d3.select("#chart svg").remove();

    const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "chart-svg")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(makeGridLines('x')
        .tickSize(-height)
        .tickFormat("")
      );

    svg.append("g")
      .attr("class", "grid")
      .call(makeGridLines('y')
        .tickSize(-width)
        .tickFormat("")
      );

    const { maxX, maxY, minX, minY } = getMaxMin(parsedData);

    y.domain([minY - 1, maxY + 1]);
    x.domain([minX - 0.5, maxX + 0.5]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      // .append("text")
      // .attr("class", "label")
      // .attr("x", width)
      // .attr("y", -6)
      // .style("text-anchor", "end")
      // .text("X-Value");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      // .append("text")
      // .attr("class", "label")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", ".71em")
      // .style("text-anchor", "end")
      // .text("Y-Value")

    svg.append("text")
      .attr(
        "transform",
        "translate(" + (width / 2) + " ," + (height + margin.bottom/2 + 10) + ")"
      )
      .attr("class","axis-label")
      .style("text-anchor", "middle")
      .text(xAxisLabel);

    const formattedColumnType = columnType.replace( /([A-Z])/g, " $1" );
    const yAxisLabel =
      formattedColumnType.charAt(0).toUpperCase() + formattedColumnType.slice(1);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("class","axis-label")
      .style("text-anchor", "middle")
      .text(yAxisLabel);

    parsedData.forEach((dataSet, index) => {
      const { points } = dataSet;

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
    })
  }

  // TO DO: Move in Parse Data Utility
  const getMaxMin = (data) => {
    let fullData = [];

    data.forEach(dataSet => {
      fullData.push(dataSet.points);
    })

    fullData = fullData.flat();
    const xData = fullData.map(point => point.x);
    const yData = fullData.map(point => point.y);

    return {
      maxX: Math.max(...xData),
      maxY: Math.max(...yData),
      minX: Math.min(...xData),
      minY: Math.min(...yData)
    }
  }

  return (
    <div className="chart-container">
      <div id="chart"></div>
    </div>
  );
}

export default LinearRegressionChart;
