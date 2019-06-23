import React, { useEffect, useState } from "react";
import LinearRegressionChart from "./components/LinearRegressionChart";
import style from "./App.module.css";

const X_AXIS_LABEL = "Server Load";

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

    useEffect(() => {
        fetch("http://localhost:4000/api/v1/data")
            .then(response => response.json())
            .then(result => {
                setIsDataLoading(false);
                const { data } = result;
                setData(data);
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
            {isDataLoading && <div className={style.loading}>Loading...</div>}
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
            <div className={style.buttons}>
                <button
                    className={style.button}
                    onClick={() => {
                        setColumnType(
                            isResponseTime ? "processingPower" : "responseTime"
                        );
                        setShowLines(false);
                    }}
                >
                    {isResponseTime ? "Processing Power" : "Response Time"}
                </button>
                <button
                    className={style.button}
                    onClick={() => setShowLines(!showLines)}
                >
                    {showLines ? "Hide Regressions" : "Calculate Regressions"}
                </button>
            </div>
        </div>
    );
};

export default App;
