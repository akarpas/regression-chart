import regression from "regression";

const parseData = (data, columnType) => {
    return Object.keys(data).map((key, index) => {
        return {
            server: key,
            points: data[key].map((item, index) => {
                return {
                    x: item.serverLoad,
                    y: item[columnType]
                };
            })
        };
    });
};

const calculateMaxMin = data => {
    let fullData = [];

    data.forEach(dataSet => {
        fullData.push(dataSet.points);
    });

    fullData = fullData.reduce((acc, val) => acc.concat(val), []);
    const xData = fullData.map(point => point.x);
    const yData = fullData.map(point => point.y);

    return {
        maxX: Math.max(...xData),
        maxY: Math.max(...yData),
        minX: Math.min(...xData),
        minY: Math.min(...yData)
    };
};

const calculateRegressions = (data, columnType) => {
    return Object.keys(data).map((key, index) => {
        const xyData = data[key].map(item => {
            return [item.serverLoad, item[columnType]];
        });
        const regressionData = regression.linear(xyData);
        const { points } = regressionData;

        return {
            server: key,
            points: data[key].map((item, index) => {
                return {
                    x: item.serverLoad,
                    yhat: points[index][1]
                };
            })
        };
    });
};

export { parseData, calculateMaxMin, calculateRegressions };
