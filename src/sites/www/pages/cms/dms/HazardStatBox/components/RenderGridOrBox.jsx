import {RenderHazardStatBox} from "./RenderHazardStatBox.jsx";
import React from "react";
import {hazardsMeta} from "../../../../../../../utils/colors.jsx";
import {Link} from "react-router-dom";
import {formatDate} from "../../../../../../../utils/macros.jsx";
import get from "lodash/get.js";
import {Attribution} from "../../../components/attribution.jsx";

export const RenderGridOrBox = ({hazard, hazardPercentileArray= [], size, isTotal, type, geoid, attributionData, baseUrl}) => (
    <React.Fragment>
            {
                    type === 'grid' ?
                        <div className={`grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6  gap-2 mt-10`}>
                                {
                                        Object.keys(hazardsMeta)
                                            .sort((a, b) => hazardsMeta[a].name.localeCompare(hazardsMeta[b].name))
                                            .map(key => (
                                                <RenderHazardStatBox
                                                    hazard={key}
                                                    statePercentile={hazardPercentileArray.find(h => h.key === key)?.statePercentile}
                                                    nationalPercentile={hazardPercentileArray.find(h => h.key === key)?.nationalPercentile}
                                                    hazardPercentileArray={hazardPercentileArray}
                                                    hazardPercentile={hazardPercentileArray.find(h => h.key === key)?.value}
                                                    actualLoss={hazardPercentileArray.find(h => h.key === key)?.actualLoss}
                                                    exposure={hazardPercentileArray.find(h => h.key === key)?.exposure}
                                                    frequency={hazardPercentileArray.find(h => h.key === key)?.frequency}
                                                    geoid={geoid}
                                                    isTotal={false}
                                                    size={size}
                                                    eal={hazardPercentileArray.find(h => h.key === key)?.eal}
                                                />
                                            ))
                                }
                        </div> :
                        <RenderHazardStatBox
                            hazard={hazard === 'total' ? '' : hazard}
                            statePercentile={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.statePercentile}
                            nationalPercentile={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.nationalPercentile}
                            hazardPercentileArray={hazardPercentileArray}
                            hazardPercentile={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.value}
                            actualLoss={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.actualLoss}
                            exposure={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.exposure}
                            frequency={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.frequency}
                            geoid={geoid}
                            isTotal={isTotal}
                            size={size}
                            eal={hazardPercentileArray.filter(h => h.key === hazard || hazard === 'total')[0]?.eal}
                        />
            }
        <Attribution baseUrl={baseUrl} attributionData={attributionData} />
    </React.Fragment>
)