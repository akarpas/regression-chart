import regression from 'regression';

const parseData = (data, columnType) => {
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

export {parseData};