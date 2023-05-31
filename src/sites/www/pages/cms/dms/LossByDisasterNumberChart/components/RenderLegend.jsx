import {hazardsMeta} from "../../../../../../../utils/colors.jsx";
import get from "lodash/get.js";
import React from "react";

export const RenderLegend = () =>
    (
        <div className={"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-9 gap-1 text-xs align-middle"}>
            {
                Object.keys(hazardsMeta)
                    .map(key =>
                        <div className={"h-full flex"} key={key}>
              <span className={"rounded-full m-1 shrink-0"}
                    style={{
                        height: "10px",
                        width: "10px",
                        backgroundColor: get(hazardsMeta, [key, "color"], "#ccc")
                    }}/>
                            <label className={"pl-2"}>{hazardsMeta[key].name}</label>
                        </div>)
            }
        </div>
    );