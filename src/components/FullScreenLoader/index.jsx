import Loader from "react-js-loader";

import React from 'react'

const FullScreenLoader = () => {
    const color = "#0E5B93";
    return (
        <div className={"App"}>
            <div className={"content"}
                style={{
                    marginTop: "100px",
                    marginBottom: "100px",
                }}
            >
                <div className={"zoom-out"}>
                    <div className={"item"}>
                        <Loader type="spinner-cub" bgColor={color} color={color} size={100} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullScreenLoader