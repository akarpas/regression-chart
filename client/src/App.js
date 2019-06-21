import React, { useEffect, useState } from 'react';
import LinearRegressionChart from './components/LinearRegressionChart';
import style from './App.module.css';

const X_AXIS_LABEL = 'Server Load';

const App = () => {
  const [columnType, setColumnType] = useState('responseTime'); // eslint-disable-line
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/data')
      .then(response => response.json())
      .then(result => {
        const { data } = result;
        setData(data);
      })
  }, []); // eslint-disable-line

  const margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 40
  },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  return (
    <div className={style.app}>
      {data &&
        <LinearRegressionChart
          data={data}
          columnType={columnType}
          xAxisLabel={X_AXIS_LABEL}
          margin={margin}
          width={width}
          heigh={height}
        />}
        <button
          className="button"
          onClick={
            e => setColumnType(columnType === 'responseTime' ? 'processingPower' : 'responseTime')
          }
        >
          Toggle Data
        </button>
    </div>
  );
}

export default App;
