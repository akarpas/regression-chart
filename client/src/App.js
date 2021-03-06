import React, { useEffect, useState } from "react";
import LinearRegressionChart from "./components/LinearRegressionChart";
import Controls from "./components/Controls";
import config from "./config.json";
import axios from "axios";

import style from "./App.module.css";

const X_AXIS_LABEL = "Server Load";
const API_URL = config[process.env.NODE_ENV].apiUrl;

const App = () => {
    const [columnType, setColumnType] = useState("responseTime");
    const [data, setData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [showLines, setShowLines] = useState(null);
    const margin = {
        top: 20,
        right: 20,
        bottom: 60,
        left: 40
    };
    const [width, setWidth] = useState(600 - margin.left - margin.right);
    const height = 400 - margin.top - margin.bottom;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isMinimized, setIsMinimized] = useState(false);
    const [initialRender, setInitialRender] = useState(true);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                if (response.status !== 200) {
                    throw Error(response.statusText);
                }
                const { data } = response.data;
                setData(data);
                setIsDataLoading(false);
            })
            .catch(() => {
                setIsDataLoading(false);
                setApiError(true);
            });

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (windowWidth <= 600 && !isMinimized) {
        setWidth(300 - margin.left - margin.right);
        if (!initialRender) setShowLines(false);
        setInitialRender(false);
        setIsMinimized(true);
    } else if (windowWidth > 600 && isMinimized) {
        setWidth(600 - margin.left - margin.right);
        if (!initialRender) setShowLines(false);
        setInitialRender(false);
        setIsMinimized(false);
    }

    const isResponseTime = columnType === "responseTime";

    return (
        <div className={style.app}>
            <h2>Server Performance Graph</h2>
            {isDataLoading && <div className={style.message}>Loading...</div>}
            {apiError && (
                <div className={style.message}>
                    Server error... please try again
                </div>
            )}
            {data && (
                <LinearRegressionChart
                    data={data}
                    columnType={columnType}
                    xAxisLabel={X_AXIS_LABEL}
                    margin={margin}
                    width={width}
                    height={height}
                    showLines={showLines}
                />
            )}
            <Controls
              setColumnType={() => {
                  setColumnType(
                      isResponseTime ? "processingPower" : "responseTime"
                  );
                  setShowLines(false);
              }}
              setShowLines={() => setShowLines(!showLines)}
              isResponseTime={isResponseTime}
              showLines={showLines}
            />
        </div>
    );
};

export default App;
