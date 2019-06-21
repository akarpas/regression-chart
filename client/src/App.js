import React from 'react';
import LinearRegressionChart from './components/LinearRegressionChart';
import style from './App.module.css';

const App = () => {
  return (
    <div className={style.app}>
      <LinearRegressionChart />
    </div>
  );
}

export default App;
