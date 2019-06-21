import React, { useEffect, useState } from 'react';
import regression from 'regression';
import * as d3 from 'd3';

import './LinearRegressionChart.css';

const LinearRegressionChart = () => {
  const [columnType, setColumnType] = useState('responseTime');

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/data')
      .then(response => response.json())
      .then(result => {
        const { data } = result;
        drawChart(data);
      })
  }, []); // eslint-disable-line

  const parseData = (data) => {
    return Object.keys(data).map((key, index) => {
      const xyData = data[key].map(item => {
        return [item.serverLoad, item[columnType]];
      })
      const regressionData = regression.linear(xyData);
      const { points } = regressionData;

      return {
        server: key,
        regressionPoints: points,
        points: data[key].map((item, index) => {
          return {
            x: item.serverLoad,
            y: item[columnType],
            yhat: points[index][1]
          };
        })
      }
    })
  }

  const drawChart = (data) => {
    const parsedData = parseData(data);

    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom().scale(x).ticks(20)

    const yAxis = d3.axisLeft().scale(y).ticks(20)

    const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "chart-svg")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let fullData = [];

    parsedData.forEach(dataSet => {
      fullData.push(dataSet.points);
    })

    fullData = fullData.flat();
    const xData = fullData.map(point => point.x);
    const yData = fullData.map(point => point.y);
    const maxX = Math.max(...xData);
    const maxY = Math.max(...yData);
    const minX = Math.min(...xData);
    const minY = Math.min(...yData);

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

    svg.append("text")
      .attr(
        "transform",
        "translate(" + (width / 2) + " ," + (height + 30) + ")"
      )
      .style("text-anchor", "middle")
      .text("X-AXIS");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Y-AXIS");

    parsedData.forEach((dataSet, index) => {
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
    })

    d3.select(".chart-container").append("button")
      .text("Regressions")
      .attr("class", "button")
      .on("click",() => {
        parsedData.forEach((dataSet, index) => {
          const { points } = dataSet;
          const line = d3.line()
            .x((d) => {
              return x(d.x);
            })
            .y((d) => {
              return y(d.yhat);
            });

          svg.append("path")
            .datum(points)
            .attr("class", `line${index + 1} line`)
            .attr("d", line);
        });
    });
  }

  return (
    <div className="chart-container">
      <div id="chart"></div>
    </div>
  );
}

export default LinearRegressionChart;
