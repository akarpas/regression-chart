import React from "react";

import style from './Controls.module.css';

const Controls = props => {
    const { setColumnType, setShowLines, isResponseTime, showLines } = props;

    return (
        <div className={style.buttons}>
            <button
                className={style.button}
                onClick={setColumnType}
            >
                {isResponseTime ? "Processing Power" : "Response Time"}
            </button>
            <button
                className={style.button}
                onClick={setShowLines}
            >
                {showLines ? "Hide Regressions" : "Calculate Regressions"}
            </button>
        </div>
    );
};

export default Controls;
