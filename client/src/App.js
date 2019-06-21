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

  return (
    <div className={style.app}>
      {data &&
        <LinearRegressionChart
          data={data}
          columnType={columnType}
          xAxisLabel={X_AXIS_LABEL}
          />
        }
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
