import React, { useEffect, useLayoutEffect, useState } from "react";
import { parseData, calculateRegressions } from "../utils/dataParser";
import * as d3 from "d3";

import "./LinearRegressionChart.css";

const LinearRegressionChart = props => {
    const [ that, setThat ] = useState();
    const { columnType, xAxisLabel, margin, width, height, showLines } = props;

    function Chart(options) {
        this.rawData = options.rawData;
        this.data = options.data;
        this.element = options.element;
    }

    const chart = new Chart({
        element: null,
        data: parseData(props.data, columnType),
        rawData: props.data
    });

    useEffect(() => {
        chart.draw();
    }, [props.columnType]); // eslint-disable-line

    useLayoutEffect(() => {
        if (showLines) {
            chart.addLines();
        } else {
            removeLines();
        }
    }, [showLines]); // eslint-disable-line

    Chart.prototype.draw = function() {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.element = document.getElementById("chart");
        this.element.innerHTML = "";
        const svg = d3.select(this.element).append("svg");
        svg.attr("width", this.width + this.margin.left + this.margin.right);
        svg.attr("height", this.height + this.margin.top + this.margin.bottom);
        svg.attr("id", "chart-svg");

        this.plot = svg
            .append("g")
            .attr(
                "transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        this.createScales();
        this.addAxes();
        this.addGrid();
        this.addPoints();
        setThat(chart);
    };

    Chart.prototype.createScales = function() {
        const x = d3.scaleLinear().range([0, this.width]);
        const y = d3.scaleLinear().range([this.height, 0]);
        const { maxX, maxY, minX, minY } = getMaxMin(this.data);
        y.domain([minY - 1, maxY + 1]);
        x.domain([minX - 0.5, maxX + 0.5]);
        this.x = x;
        this.y = y;
    };

    Chart.prototype.addAxes = function() {
        const xAxis = d3
            .axisBottom()
            .scale(this.x)
            .ticks(20);
        const yAxis = d3
            .axisLeft()
            .scale(this.y)
            .ticks(20);

        this.plot
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        this.plot
            .append("g")
            .attr("class", "y axis")
            .call(yAxis);

        this.plot
            .append("text")
            .attr(
                "transform",
                "translate(" +
                    this.width / 2 +
                    " ," +
                    (this.height + this.margin.bottom / 2 + 10) +
                    ")"
            )
            .attr("class", "axis-label")
            .style("text-anchor", "middle")
            .text(xAxisLabel);

        const formattedColumnType = columnType.replace(/([A-Z])/g, " $1");
        const yAxisLabel =
            formattedColumnType.charAt(0).toUpperCase() +
            formattedColumnType.slice(1);

        this.plot
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - this.height / 2)
            .attr("dy", "1em")
            .attr("class", "axis-label")
            .style("text-anchor", "middle")
            .text(yAxisLabel);
    };

    Chart.prototype.addPoints = function() {
        this.data.forEach((dataSet, index) => {
            const { points } = dataSet;
            this.plot
                .selectAll("dot")
                .data(points)
                .enter()
                .append("circle")
                .attr("class", `dot${index + 1}`)
                .attr("r", 3.5)
                .attr("cx", d => {
                    return this.x(d.x);
                })
                .attr("cy", d => {
                    return this.y(d.y);
                });
        });
    };

    Chart.prototype.addGrid = function() {
        const makeGridLines = type => {
            return type === "x"
                ? d3.axisBottom(this.x).ticks(10)
                : d3.axisLeft(this.y).ticks(10);
        };

        this.plot
            .append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + this.height + ")")
            .call(
                makeGridLines("x")
                    .tickSize(-this.height)
                    .tickFormat("")
            );

        this.plot
            .append("g")
            .attr("class", "grid")
            .call(
                makeGridLines("y")
                    .tickSize(-this.width)
                    .tickFormat("")
            );
    };

    Chart.prototype.addLines = function() {
        const regressionData = calculateRegressions(that.rawData, columnType);
        regressionData.forEach((dataSet, index) => {
            const { points } = dataSet;
            const line = d3
                .line()
                .x(d => that.x(d.x))
                .y(d => that.y(d.yhat));

            that.plot
                .append("path")
                .datum(points)
                .attr("class", `line${index + 1} line`)
                .attr("d", line);
        });
    };

    const removeLines = () => {
        d3.selectAll("path.line").remove();
    };

    const getMaxMin = data => {
        let fullData = [];

        data.forEach(dataSet => {
            fullData.push(dataSet.points);
        });

        fullData = fullData.flat();
        const xData = fullData.map(point => point.x);
        const yData = fullData.map(point => point.y);

        return {
            maxX: Math.max(...xData),
            maxY: Math.max(...yData),
            minX: Math.min(...xData),
            minY: Math.min(...yData)
        };
    };

    return (
        <div className="chart-container">
            <div id="chart" />
        </div>
    );
};

export default LinearRegressionChart;
