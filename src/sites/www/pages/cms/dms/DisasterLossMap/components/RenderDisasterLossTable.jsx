import React, {useMemo} from "react";
import { pgEnv } from "~/utils/";
import {ChoroplethCountyFactory} from "./choroplethCountyLayer.jsx";

export const RenderDisasterLossTable = ({  }) => {
    const map_layers = useMemo(() => [ ChoroplethCountyFactory() ], []),

    layerProps = useMemo(() =>
            ({ccl: {disaster_number, geoid, view: view || views[0].id, views, pgEnv, ...layerProps}}),
        [view, disaster_number, geoid, views, pgEnv, layerProps]);
   return (
       <div className={`flex-none h-[500px] w-full`}>
           <AvlMap
               mapbox_logo={false}
               navigationControl={false}
               accessToken={config.MAPBOX_TOKEN}
               falcor={falcor}
               mapOptions={{
                   // styles: [
                   //   // { name: "Light", style: "mapbox://styles/am3081/ckdfzeg1k0yed1ileckpfnllj" }
                   // ]
               }}
               layers={map_layers}
               layerProps={layerProps}
               CustomSidebar={() => <div />}
           />
       </div>
   )
};