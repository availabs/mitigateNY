import get from "lodash/get";
import { LayerContainer } from "~/modules/avl-maplibre/src";
import { getColorRange } from "~/modules/avl-components/src";
import { fnum } from "~/utils/macros";
import {drawLegend} from "./drawLegend.jsx";

class EALChoroplethOptions extends LayerContainer {
  constructor(props) {
    super(props);
  }

  name = "ccl";
  id = "ccl";
  data = [];
  sources = [
    // {
    //   id: "states",
    //   source: {
    //     "type": "vector",
    //     "url": "https://api.mapbox.com/v4/mapbox.satellite/{x}/{y}/{z}.webp?sku=101PRSiEvYwSK&access_token=tk.eyJ1IjoiYW0zMDgxIiwiZXhwIjoxNjg2NTk1ODM1LCJpYXQiOjE2ODY1OTIyMzUsInNjb3BlcyI6WyJlc3NlbnRpYWxzIiwic2NvcGVzOmxpc3QiLCJtYXA6cmVhZCIsIm1hcDp3cml0ZSIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1cGxvYWRzOnJlYWQiLCJ1cGxvYWRzOmxpc3QiLCJ1cGxvYWRzOndyaXRlIiwic3R5bGVzOnRpbGVzIiwic3R5bGVzOnJlYWQiLCJmb250czpsaXN0IiwiZm9udHM6cmVhZCIsImZvbnRzOndyaXRlIiwic3R5bGVzOndyaXRlIiwic3R5bGVzOmxpc3QiLCJzdHlsZXM6ZG93bmxvYWQiLCJzdHlsZXM6cHJvdGVjdCIsInRva2VuczpyZWFkIiwidG9rZW5zOndyaXRlIiwiZGF0YXNldHM6bGlzdCIsImRhdGFzZXRzOnJlYWQiLCJkYXRhc2V0czp3cml0ZSIsInRpbGVzZXRzOmxpc3QiLCJ0aWxlc2V0czpyZWFkIiwidGlsZXNldHM6d3JpdGUiLCJkb3dubG9hZHM6cmVhZCIsInZpc2lvbjpyZWFkIiwidmlzaW9uOmRvd25sb2FkIiwibmF2aWdhdGlvbjpkb3dubG9hZCIsIm9mZmxpbmU6cmVhZCIsIm9mZmxpbmU6d3JpdGUiLCJzdHlsZXM6ZHJhZnQiLCJmb250czptZXRhZGF0YSIsInNwcml0ZS1pbWFnZXM6cmVhZCIsImRhdGFzZXRzOnN0dWRpbyIsImN1c3RvbWVyczp3cml0ZSIsImNyZWRlbnRpYWxzOnJlYWQiLCJjcmVkZW50aWFsczp3cml0ZSIsImFuYWx5dGljczpyZWFkIl0sImNsaWVudCI6Im1hcGJveC5jb20iLCJsbCI6MTY2NzMyNjMxNDMwMSwiaXUiOm51bGwsImVtYWlsIjoiYW0zMDgxQGdtYWlsLmNvbSJ9.MUxuViB3XLGcyKfIvNuP3A"
    //   },
    // },
    {
      id: "counties",
      source: {
        "type": "vector",
        "url": "https://tiles.availabs.org/data/tl_2020_36_county.json"
      },
    }
  ];

  layers = [
    {
      "id": "counties",
      "source": "counties",
      "source-layer": "tl_2020_us_county",
      "type": "fill",
      "paint": {
        "fill-color": '#8f680f'
      }
    },
    {
      "id": "counties-line",
      "source": "counties",
      "source-layer": "tl_2020_us_county",
      "type": "line",
      paint: {
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 1,
          22, 1
        ],
        "line-color": "#000000",
        "line-opacity": 0.5
      }
    }
  ];

  legend = {
    Title: e => '',
    type: "threshold",
    format: "0.2s",
    domain: [0, 25, 50, 75, 100],
    range: getColorRange(5, "RdYlGn", false),
    show: true
  };

  onHover = {
    layers: ["counties"],
    HoverComp: ({ data, layer }) => {
      return (
        <div style={{ maxHeight: "300px" }} className={`rounded relative px-1 overflow-auto scrollbarXsm bg-white`}>
          {
            data?.length && data.map((row, i) =>
              <div key={i} className="flex">
                {
                  row?.length && row.map((d, ii) =>
                    <div key={ii}
                      // style={{maxWidth: '200px'}}
                         className={`
                    ${ii === 0 ? "flex-1 font-bold" : "overflow-auto scrollbarXsm"}
                    ${row.length > 1 && ii === 0 ? "mr-4" : ""}
                    ${row.length === 1 && ii === 0 ? `border-b-2 text-lg ${i > 0 ? "mt-1" : ""}` : ""}
                    `}>
                      {d}
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      );
    },
    callback: (layerId, features, lngLat) => {
      return features.reduce((a, feature) => {
        let { view: currentView, data } = this.props;
        const keyMapping = key => Array.isArray(currentView?.columns) ? key : Object.keys(currentView?.columns || {}).find(k => currentView.columns[k] === key);
        let record = data.find(d => d.geoid === feature.properties.geoid),
          response = [
            [feature.properties.geoid, ''],
            ...Object.keys(record || {})
              .filter(key => key !== 'geoid')
              .map(key => [keyMapping(key), fnum(get(record, key))]),
            currentView?.paintFn ? ['Total', fnum(currentView.paintFn(record || {}) || 0)] : null
          ];
        return response;
      }, []);
    }
  };

  init(map, falcor, props) {
    map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
    map.on('idle', (e) => {
      const canvas = document.querySelector("canvas.maplibregl-canvas"),
          newCanvas = document.createElement("canvas");

      let img;

      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      const context = newCanvas.getContext("2d")
      context.drawImage(canvas, 0, 0);


      drawLegend({legend: this.legend, filters: this.filters}, newCanvas, canvas);
      img = newCanvas.toDataURL();
      this.img = img;
      this.props.change({filters: this.filters, img, bounds: map.getBounds(), legend: this.legend, style: this.style})

    })

  }

  // fetchData(falcor) {
  //
  // }

  handleMapFocus(map, props) {
    if (props.mapFocus) {
      try {
          map.fitBounds(props.mapFocus)
      } catch (e) {
        map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
      }
    } else {
    map.fitBounds([-125.0011, 24.9493, -66.9326, 49.5904]);
    }
  }

  paintMap(map, props) {
    let { geoColors = {}, domain = [], colors = [], title = '' } = props
    this.legend.domain = domain;
    this.legend.range = colors;
    this.legend.title = title
    map.setFilter("counties", ["in", ['get', "geoid"], ['literal', Object.keys(geoColors)]]);
    map.setFilter("counties-line", ["in", ['get', "geoid"], ['literal', Object.keys(geoColors)]]);
    map.setPaintProperty("counties", "fill-color", ["get", ["get", "geoid"], ["literal", geoColors]]);

  }

  receiveProps(props, prev, map, falcor) {
    console.log('props', props)
    this.paintMap(map, props);
    this.handleMapFocus(map, props);
  }

  // render(map, falcor) {
  // }
}

export const ChoroplethCountyFactory = (options = {}) => new EALChoroplethOptions(options);