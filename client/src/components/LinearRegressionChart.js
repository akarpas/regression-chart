import React, { useEffect, useState } from 'react';

const LinearRegressionChart = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/data')
      .then(response => response.json())
      .then(data => {
        setGraphData(data);
        drawChart();
      })
    return;
  }, []);

  const drawChart = () => {}

  return (
    <div>
      Graph
    </div>
  );
}

export default LinearRegressionChart;
