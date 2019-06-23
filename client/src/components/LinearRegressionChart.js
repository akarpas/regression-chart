import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    parseData,
    calculateMaxMin,
    calculateRegressions
} from "../utils/dataParser";
import * as d3 from "d3";

import "./LinearRegressionChart.css";

const LinearRegressionChart = props => {
    const [that, setThat] = useState();
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
    }, [props.columnType, props.width]); // eslint-disable-line

    useLayoutEffect(() => {
        if (showLines) {
            chart.addLines();
        } else if (showLines !== null) {
            chart.removeLines();
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
        this.addLegend();
        setThat(chart);
    };

    Chart.prototype.createScales = function() {
        const x = d3.scaleLinear().range([0, this.width]);
        const y = d3.scaleLinear().range([this.height, 0]);
        const { maxX, maxY, minX, minY } = calculateMaxMin(this.data);
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
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

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
                })
                .on("mouseover", d => {
                    const tooltipHtml =
                        "x: " + d.x.toFixed(2) + "<br/> y: " + d.y.toFixed(2);
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    tooltip
                        .html(tooltipHtml)
                        .style("left", d3.event.pageX - 15 + "px")
                        .style("top", d3.event.pageY - 40 + "px");
                })
                .on("mouseout", d => {
                    tooltip
                        .transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    };

    Chart.prototype.addLegend = function() {
        this.data.forEach((dataSet, index) => {
            const { server } = dataSet;
            const capitalizedName =
                server.charAt(0).toUpperCase() + server.slice(1);
            const label = `${capitalizedName.split("_")[0]} ${
                capitalizedName.split("_")[1]
            }`;
            this.plot
                .append("text")
                .attr("y", -2)
                .attr("x", 0 + this.margin.top / 2 + index * 100)
                .attr("class", `chart-legend${index + 1}`)
                .text(label);
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
                .attr("d", line)
        });
    };

    Chart.prototype.removeLines = function() {
        that.plot.selectAll("path.line").remove();
    };

    return (
        <div className="chart-container">
            <div id="chart" />
        </div>
    );
};

export default LinearRegressionChart;
